#!/usr/bin/env python3
"""
Validator for languages.json + glossary.json conformance.

Checks:
  - glossary       Every entry whose English source contains a glossary term
                   has the locked target term in every language's translation.
  - pattern_regex  Each pattern in `patterns` compiles as a valid regex.
  - pattern_capture  Each {N} reference in a pattern template points to a
                     capture group that exists in the regex.
  - curly_quote    Output translation values use ASCII straight quotes
                   (' and "), not typographic ones (' '   ).
  - untranslated   Informational: target value equals English source. Often
                   intentional for brand names, but worth a glance.

Exit code:
  0 if no violations.
  1 if any blocking violations (everything except `untranslated`).

Usage:
  ./validate.py            # human-readable output
  ./validate.py --quiet    # only the totals
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LANGUAGES_PATH = ROOT / "languages.json"
GLOSSARY_PATH = ROOT / "glossary.json"

LANGS = ["ja", "es", "pt", "ko", "fr", "tr", "zh-CN", "zh-TW", "id"]
CURLY_QUOTE_RE = re.compile(r"[‘’“”]")


def load():
    with open(LANGUAGES_PATH, encoding="utf-8") as f:
        langs_data = json.load(f)
    with open(GLOSSARY_PATH, encoding="utf-8") as f:
        glossary_data = json.load(f)
    return langs_data, glossary_data


def check_glossary_enforcement(langs_data, glossary_data):
    """For every glossary term, every entry whose English source contains
    the term (word-boundary match) must have the locked target term as a
    substring in every language's translation."""
    violations = []
    translations = langs_data["translations"]
    terms = glossary_data["terms"]

    for src_term, mapping in terms.items():
        # Word-boundary on English side: src_term not surrounded by other
        # letters. Handles "Journey" matching only standalone, not "Journeys".
        # Always case-insensitive for the source side — UI text varies
        # ("subscriber preferences" vs "Subscriber Records" both ought to
        # match the "Subscriber" glossary entry).
        pattern = re.compile(
            r"(?<![A-Za-z])" + re.escape(src_term) + r"(?![A-Za-z])",
            re.IGNORECASE,
        )
        # Per-term skip list: English source keys where the term appears
        # in a different sense (e.g. "Segment" the Twilio company, not
        # the OneSignal feature) and the glossary check should not apply.
        skip_keys = set(mapping.get("_skip_keys", []))
        for english_key, target in translations.items():
            if english_key in skip_keys:
                continue
            if not pattern.search(english_key):
                continue
            for lang in LANGS:
                locked = mapping.get(lang)
                if not locked:
                    continue
                actual = target.get(lang)
                if actual is None:
                    continue
                # Glossary value can be a string OR a list of acceptable
                # forms (covers grammatical variants like Spanish verb
                # "Filtrar" + noun "Filtro" both being correct for
                # "Filter" depending on context). Case-insensitive
                # substring match — Spanish/Portuguese lowercase nouns
                # mid-phrase; Japanese/Korean have no case distinction.
                acceptable = locked if isinstance(locked, list) else [locked]
                if not any(form.lower() in actual.lower() for form in acceptable):
                    violations.append(
                        {
                            "check": "glossary",
                            "term": src_term,
                            "lang": lang,
                            "source_key": english_key,
                            "expected_substring": " | ".join(acceptable),
                            "actual": actual,
                        }
                    )
    return violations


def check_patterns(langs_data):
    violations = []
    for i, p in enumerate(langs_data.get("patterns", [])):
        match = p.get("match", "")
        try:
            compiled = re.compile(match)
            n_groups = compiled.groups
        except re.error as e:
            violations.append(
                {
                    "check": "pattern_regex",
                    "pattern_index": i,
                    "pattern": match,
                    "error": str(e),
                }
            )
            continue
        for lang, template in p.get("translations", {}).items():
            refs = re.findall(r"\{(\d+)\}", template)
            for ref in refs:
                n = int(ref)
                if n < 1 or n > n_groups:
                    violations.append(
                        {
                            "check": "pattern_capture",
                            "pattern_index": i,
                            "pattern": match,
                            "lang": lang,
                            "template": template,
                            "error": f"reference {{{n}}} but pattern has {n_groups} group(s)",
                        }
                    )
    return violations


def check_curly_quotes(langs_data):
    violations = []
    for english_key, target in langs_data["translations"].items():
        for lang, value in target.items():
            if CURLY_QUOTE_RE.search(value):
                violations.append(
                    {
                        "check": "curly_quote",
                        "lang": lang,
                        "source_key": english_key,
                        "value": value,
                    }
                )
    return violations


def check_cross_contamination(langs_data):
    """Catches copy-paste errors where a translation value was accidentally
    pulled from a different source key. Concretely: for every non-English
    translation value, if it case-insensitively equals some *other*
    source key in the dictionary, flag it. Equal-to-own-source matches are
    skipped (that's the existing 'untranslated' informational check).

    Example caught: source 'Event Streams' had es value 'Custom Events',
    where 'Custom Events' is itself a separate source key. The intent was
    almost certainly to type 'Event Streams' (Latin, matching the the Chilean Spanish reviewer
    pattern for product feature names), and the wrong English label was
    pasted in.

    False positives are possible when two distinct source keys legitimately
    share a Latin target (e.g. two surfaces of the same feature). If one
    surfaces, add (source_key, target_value) to SKIP_PAIRS below.
    """
    # Legitimate cross-matches that aren't bugs. Pairs are (source_key,
    # target_value); language-agnostic since a single linguistic reality
    # usually covers every affected language.
    SKIP_PAIRS = {
        # Languages that don't pluralize English loan acronyms / words.
        ("SDKs", "SDK"),
        ("Webhooks", "Webhook"),
        ("Aliases", "Alias"),
        # Coincidental word collisions (target is the correct native form
        # but happens to also be an English source key for something else).
        ("Date", "Data"),       # pt: 'Data' = Portuguese for date; also EN feature noun
        ("Tue", "Mar"),         # es/fr: 'Mar' = Tuesday abbrev; also EN March abbrev
        # Turkish doesn't carry the English 'is X' copula structure.
        ("is True", "True"),
        ("is False", "False"),
        ("is true", "true"),
        # Indonesian: no pluralization of loanwords; status labels collapse.
        ("Filters", "Filter"),      # id: plural drops; Filter is correct singular
        ("Errored", "Error"),       # id: status 'Errored' = 'Error' (same word)
        ("Drafts", "Draf"),         # id: 'Draf' is both singular and plural
        ("Labels", "Label"),        # id: plural drops; Label is correct singular
        ("Platforms", "Platform"),  # id: plural drops; Platform is correct singular
    }
    violations = []
    translations = langs_data["translations"]
    # Case-insensitive lookup: lowered -> original. Picks the first source
    # key for each lowercase form (the conflict message uses this).
    source_keys_lower = {}
    for key in translations:
        source_keys_lower.setdefault(key.lower(), key)
    for english_key, target in translations.items():
        own_lower = english_key.lower()
        for lang in LANGS:
            value = target.get(lang)
            if not isinstance(value, str) or not value:
                continue
            value_lower = value.lower()
            if value_lower == own_lower:
                continue  # handled by check_untranslated
            other = source_keys_lower.get(value_lower)
            if other is None or other == english_key:
                continue
            if (english_key, value) in SKIP_PAIRS:
                continue
            violations.append(
                {
                    "check": "cross_contamination",
                    "lang": lang,
                    "source_key": english_key,
                    "value": value,
                    "conflict": other,
                }
            )
    return violations


def check_untranslated(langs_data):
    flags = []
    for english_key, target in langs_data["translations"].items():
        for lang in LANGS:
            value = target.get(lang)
            if value is None:
                continue
            if value == english_key:
                flags.append(
                    {
                        "check": "untranslated",
                        "lang": lang,
                        "source_key": english_key,
                    }
                )
    return flags


def format_violation(v):
    """Render a single violation in a one-line, copyable form."""
    if v["check"] == "glossary":
        return (
            f"  glossary  {v['lang']}  '{v['source_key']}': "
            f"missing '{v['expected_substring']}' in '{v['actual']}'"
        )
    if v["check"] == "pattern_regex":
        return (
            f"  pattern_regex  [{v['pattern_index']}]  "
            f"{v['pattern']!r}: {v['error']}"
        )
    if v["check"] == "pattern_capture":
        return (
            f"  pattern_capture  [{v['pattern_index']}]  {v['lang']}  "
            f"{v['pattern']!r} -> {v['template']!r}: {v['error']}"
        )
    if v["check"] == "curly_quote":
        return (
            f"  curly_quote  {v['lang']}  '{v['source_key']}': '{v['value']}'"
        )
    if v["check"] == "untranslated":
        return f"  untranslated  {v['lang']}  '{v['source_key']}'"
    if v["check"] == "cross_contamination":
        return (
            f"  cross_contamination  {v['lang']}  '{v['source_key']}': "
            f"value '{v['value']}' equals another source key '{v['conflict']}'"
        )
    return repr(v)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--quiet", action="store_true", help="only print totals, not each violation"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="max items to print per check (default 20; --limit 0 prints all)",
    )
    args = parser.parse_args()

    langs_data, glossary_data = load()

    blocking = []
    blocking += check_glossary_enforcement(langs_data, glossary_data)
    blocking += check_patterns(langs_data)
    blocking += check_curly_quotes(langs_data)
    blocking += check_cross_contamination(langs_data)

    untranslated = check_untranslated(langs_data)

    by_check = {}
    for v in blocking:
        by_check.setdefault(v["check"], []).append(v)

    print(
        f"Loaded {len(langs_data['translations'])} translations, "
        f"{len(langs_data.get('patterns', []))} patterns, "
        f"{len(glossary_data['terms'])} glossary terms."
    )

    if blocking and not args.quiet:
        for check_type in sorted(by_check):
            items = by_check[check_type]
            print(f"\n[{check_type}] {len(items)} violation(s):")
            shown = items if args.limit == 0 else items[: args.limit]
            for item in shown:
                print(format_violation(item))
            if args.limit and len(items) > args.limit:
                print(f"  ... and {len(items) - args.limit} more")

    if untranslated and not args.quiet:
        print(
            f"\n[untranslated] {len(untranslated)} informational "
            f"(may be intentional for brand names)."
        )
        if args.limit:
            for item in untranslated[: args.limit]:
                print(format_violation(item))
            if len(untranslated) > args.limit:
                print(f"  ... and {len(untranslated) - args.limit} more")

    print()
    print(f"Blocking: {len(blocking)} violation(s).")
    print(f"Informational: {len(untranslated)} entry(s).")

    return 1 if blocking else 0


if __name__ == "__main__":
    sys.exit(main())
