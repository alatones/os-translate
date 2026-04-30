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

## Always fill in every supported language

When adding a **new English source key** to `languages.json`, provide a
translation for **every supported language** (`ja`, `es`, `pt`, `ko`, `fr`,
`tr`, `zh-CN`) — not just the one that surfaced the missing string in the
ledger.

Missing-language entries silently fall through to English at runtime, so
the extension keeps working — but the dashboard ends up half-translated
for users on other languages, and that inconsistency is invisible to
maintainers until those users notice. The cost of writing six more
translations up front is much lower than the cost of tracking down
which entries still need filling later.

If you genuinely don't know a translation for a language, leave a `TODO`
comment in the commit and flag it explicitly — don't omit silently.

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

## Versioning

When you ship a change to beta testers, bump `manifest.json`'s `version`
field and add an entry to `CHANGELOG.md`. We follow semver
(MAJOR.MINOR.PATCH):

- **PATCH** (1.0.x): translation tweaks, glossary refinements, single
  dictionary entries, icon refresh from the same source, copy fixes,
  validator/tooling improvements that don't change user-visible behavior.
- **MINOR** (1.x.0): a new supported language, a new visible feature
  (popup changes, feedback flow changes, icon system changes), a
  substantial dictionary expansion (50+ new entries in one drop).
- **MAJOR** (x.0.0): breaking schema changes, removing a supported
  language, a rebrand. Rare.

Keep changelog entries short and user-facing — what a beta tester would
notice — not a commit log. "Added Simplified Chinese" or "Localized popup
UI", not "fix validate.py to accept zh-CN locale code."

Chrome doesn't auto-update unpacked extensions. Beta testers must reload
the extension at `chrome://extensions` after pulling new code, but the
version number tells them whether they need to and the changelog tells
them what changed.

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
