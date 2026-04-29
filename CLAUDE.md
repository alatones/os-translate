# Translation work

When adding or modifying any entry in `languages.json`, **read `STYLE_GUIDE.md`
and `glossary.json` first**. The style guide defines rules; the glossary locks
terminology. The locked terms in `glossary.json` are non-negotiable — use them
exactly, even when alternative renderings sound slightly more natural.

Per-language nuance (formality register, punctuation, length budgets) lives in
`style/<lang>.md`. Read the relevant addendum before drafting in that language.

When in doubt, prefer the existing pattern in `languages.json` over inventing
a new one. Consistency across the dashboard outweighs any single phrase being
maximally elegant.

## Before committing

Run `./validate.py` after every edit to `languages.json` or `glossary.json`.
It must report `Blocking: 0 violation(s)`. The `Informational: untranslated`
count is non-blocking — those entries (brand names, Latin acronyms) are
expected to equal the English source.

Glossary terms can have alternate acceptable forms (array values) and a
per-term `_skip_keys` list for English sources where the term appears in a
different sense (e.g. "Segment" the company vs the OneSignal feature). When
adding a new entry that triggers a glossary violation in good faith, prefer
adding an alt or `_skip_keys` over loosening the check.
