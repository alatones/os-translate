# Translation Style Guide

## Goal

Clear, consistent translations of the OneSignal dashboard. The end user — a
marketer, PM, or CRM ops person — should be able to navigate the product in
their language without friction. **Consistency across the product matters
more than any single phrase being maximally elegant.**

## Source-of-truth order

When two rules collide, the order is:

1. `glossary.json` — locked English-to-target mappings.
2. `style/<lang>.md` — per-language addendum (register, punctuation, brand
   policy specific to that language).
3. This guide — global rules.

If still ambiguous, follow the existing pattern in `languages.json`.

---

## Global rules

### 1. Brand and vendor names: preserve in Latin

Never transliterate or translate **brand names**.

- **Companies / vendors**: OneSignal, Twilio, Amplitude, Mixpanel, HubSpot,
  Segment (when the company — i.e. Twilio Segment), Mailgun, Snowflake,
  BigQuery, Postgres, MySQL, ClickHouse, Trino, Adobe, Apache Kafka, AWS,
  Google, Apple, Microsoft, Mozilla, Firefox, Chrome, Edge, Safari.
- **Technical protocol/term loanwords with no natural translation**:
  Webhook, API, SDK, CSV, URL, HTML, JSON.

**Generic marketing channel and feature names ARE translated** per the
glossary into the natural form for each target language. This includes:
Push, Email, SMS, RCS, In-App, Live Activity / Live Activities, Journey /
Journeys, Segment / Segments (the OneSignal feature, distinct from
Twilio Segment the company), Outcome / Outcomes, Subscription, Data Feed.

How aggressively to translate depends on what's natural in the target
language:

- **East Asian (ja, ko, zh-CN, zh-HK)**: translate to native script
  (e.g. Push → 推送 / 推送 / プッシュ / 푸시).
- **European (es, pt, fr, tr)**: many of these terms — "Push", "Email",
  "SMS", "RCS" — are used in Latin form by marketers natively in those
  languages. Don't force a translation that reads less natural than
  what marketers actually say. Turkish "E-posta" for Email is the one
  exception — it's the standard Turkish term. Use the glossary to lock
  the natural choice.

When "Segment" refers to the OneSignal feature, translate. When it
refers to the company (Twilio Segment), keep in Latin and use the
`_skip_keys` glossary mechanism to exempt those source strings.

### 2. Martech meaning, not generic meaning

Translate within the marketing-tech context, not the dictionary sense.

- "Campaign" → messaging campaign, not a military one.
- "Conversion" → tracked outcome event, not religious / unit conversion.
- "Delivery" → message delivery, not parcel.
- "Open" → email open event, not the verb "to open".
- "Send" → dispatch a message, not generic transfer.

### 3. Consistency: same source + same UI role = same translation

Two strings with the same English source AND the same UI role must have the
same translation. Across different UI roles, the same source may take
different translations if natural phrasing demands it.

UI roles:

| Role           | What it covers                                              |
| -------------- | ----------------------------------------------------------- |
| `button`       | Primary CTA. Imperative verb. Short.                        |
| `label`        | Form field label, sidebar item, table-column header.        |
| `heading`      | Page or section title. Noun phrase, slightly fuller.        |
| `tooltip`      | Explanatory copy, hover hints, descriptive paragraphs.      |
| `error`        | Validation messages, failed-state copy.                     |
| `status`       | Inline state badges (Active, Paused, Failed, etc.).         |
| `empty-state`  | What shows when a list is empty.                            |
| `nav`          | Top-level navigation links.                                 |
| `a11y`         | Alt text, screen-reader labels, ARIA descriptions.          |
| `placeholder`  | Input field placeholder text.                               |

If the role isn't clear, treat the string as a `label`. If a deliberate
choice is made to use different translations for the same English source
across roles, lock both in the glossary with the role tag.

### 4. Glossary is binding

`glossary.json` lists locked mappings. Wherever a glossary term appears in
its scoped role, the locked translation is used — even if a competing
rendering reads slightly more naturally. The cost of inconsistency is
higher than the gain in any single phrase.

A new translation that introduces a competing rendering for a glossary term
is wrong. Either use the locked term, or update the glossary first (which
re-translates every existing occurrence in the same commit).

### 5. Action-oriented for buttons, noun phrases for labels

- Buttons / CTAs: imperative verbs ("Send", "Create", "Save").
- Labels / headings: noun phrases ("Notifications", "Delivery rate").
- Match the original part of speech unless the target language requires
  otherwise (e.g. some languages prefer noun-form button labels).

### 6. Don't over-localize

The product is a SaaS dashboard, not a consumer app. If the English is
terse, the translation is terse. If the English uses no punctuation, the
translation uses no punctuation. Don't soften, embellish, or rewrite.

### 7. Don't invent terminology

If you don't know the natural domain term and it isn't in the glossary,
prefer a careful loanword (katakana, Latin, Hangul transliteration as
appropriate) over coining a new domain word. Then add the chosen rendering
to the glossary so it's locked for next time.

### 8. Placeholders are sacred

These appear in pattern templates and source strings and must survive
translation unchanged:

- Capture-group references: `{1}`, `{2}`, `{3}` — used to substitute regex
  matches into pattern templates.
- Liquid-style tokens: `{{var_name}}`, `{% if %}`, `{% endif %}`.
- Printf-style: `%s`, `%d`.

Repositioning a placeholder for grammatical reasons is allowed. Dropping,
renaming, or modifying one is not.

### 9. Quotes and punctuation

- **Output values use ASCII straight quotes** (`'` and `"`). The dashboard
  source side mixes curly and straight; that's normalized at lookup
  (`content.js:normalizeQuotes`). Output stays ASCII for portability.
- Native typographic punctuation that's part of the target language's
  standard (Japanese `「」`, Spanish `¿…?` `¡…!`) is fine and encouraged
  where natural.
- Preserve the source string's terminal punctuation: a period at the end
  of an English sentence keeps a period (or its language equivalent) at
  the end of the translation. A heading without terminal punctuation
  stays without it.

### 10. Length

- No hard caps. But if a button label translation is meaningfully longer
  than the source and a shorter natural phrasing is acceptable, prefer
  the shorter one.
- Per-language addenda may set tighter budgets for specific roles (e.g.
  Japanese button labels target ≤ 8 characters where possible).

---

## What gets translated, what stays English

| Stays English                       | Gets translated                |
| ----------------------------------- | ------------------------------ |
| Brand / vendor names (rule 1)       | All other user-facing UI copy  |
| Product feature names (glossary)    |                                |
| Liquid template tokens              |                                |
| Code samples and identifiers        |                                |
| Numeric placeholders                |                                |
| SMS protocol keywords (STOP, START, HELP, YES, UNSTOP, UNSUBSCRIBE, SUBSCRIBE, JOURNEY) — these are protocol tokens carriers recognize, not English words |  |

When unclear, prefer leaving English over a guess.

---

## Process for adding new translations

1. **Check the glossary.** If the term is there, use the locked mapping.
2. **Check the per-language addendum** for register and punctuation.
3. **Look at how analogous strings in the same UI role are already
   translated.** Mirror that pattern.
4. **Add the entry.** If it introduces a recurring term not yet in the
   glossary, add it to the glossary in the same commit.
5. **Run the validator** (when it exists).

## What this guide does not say

Anything not called out here is the per-language addendum's job. Don't
read silence as permission to vary — fall back to the existing pattern
in `languages.json` for that language.
