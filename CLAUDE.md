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

## Keep README.md in sync

After any **major** change, update `README.md` so it reflects the current
state of the extension. Major changes include:

- New supported language, or shifts in coverage that affect the language
  table.
- New filters or behavior changes in `content.js` that users would notice
  (e.g. the curly-quote normalization layer, extension-context teardown).
- Changes to the missed-string ledger schema, filter list, or thresholds
  in `couldBeUI`.
- New top-level files (validator, style guide, glossary, etc.) — these
  belong in the File Map and usually need a section explaining what they
  are.
- Workflow changes (how to add a language, how to add a term, how to
  report feedback).

Routine fixes (a typo here, a single new translation entry) don't need
README updates. Use judgement: if a new contributor reading the README
would be surprised by what they find in the code, the README is stale.

When you do update `README.md`, keep it concise and prefer editing in
place over appending. Cross-link to the relevant artifact (CLAUDE.md,
STYLE_GUIDE.md, glossary.json, style/<lang>.md, validate.py) rather than
duplicating their content.
