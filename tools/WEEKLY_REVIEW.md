# Weekly ledger review

The procedure for the Friday review of the missed-string ledger and the
translation-feedback form. A scheduled Claude task runs it unattended; a
person can follow it too. The spreadsheet IDs live in the scheduled
task's prompt, not here, because this repo is public.

The run has two phases:

1. **Review (unattended, read-only).** Produce a recommendation: UPDATE or
   WAIT.
2. **Build (only after the maintainer approves in the same session).** Make
   the change and open a PR.

In phase 1, never create branches, edit or commit files, push, or write to
either spreadsheet. The only file the review writes is the scratch input
under `.review/` (gitignored).

## Phase 1: Review

### 1. Sync

```bash
git -C <repo> checkout main
git -C <repo> pull --ff-only
```

If the working tree isn't clean or the pull fails, stop and report that
instead of reviewing stale code.

### 2. Triage the ledger

1. Read the `ledger_rollup` tab, range `A1:F`, from the ledger spreadsheet.
2. Write the response JSON verbatim to `<repo>/.review/rollup.json`.
3. Run `node tools/triage.js .review/rollup.json`. The defaults are the
   latest version in the sheet and 1+ installs. The install base is
   small, so a string one install reported is still a real gap. Use the
   install count to rank rows, not to drop them.

The script runs every string through the current engine. **"Already
handled"** rows need no action. They're usually backlog: the extension
stamps a batch with the version installed when it's sent, so the first
batch after an update carries strings the old version missed. Count them
in the report, but don't list them individually. Since 1.13.3, each
string carries the version of the build that saw it, so this backlog
should mostly disappear for installs on 1.13.3 or later.

If the pivot is empty, the verdict is WAIT. Say so in one line.

### 3. Classify each "Needs a decision" row

Use the paths and roles from the raw `ledger` tab when the string alone
isn't enough to decide.

| Class | What it looks like | Action |
|---|---|---|
| **UI copy** | Product text a OneSignal user sees: labels, buttons, headings, empty states, tooltips | Translate in all 10 languages |
| **Dynamic UI** | UI text with a number, date, or name slot (`3m ago`, `Button 2`, `Good morning, Ana`) | Add a pattern |
| **Technical noise** | Format hints, metric values, chart screen-reader text, IDs | Add a filter in `content.js` |
| **UGC** | Org/app names (incl. `<Org> settings`, `<Org> Apps`, names with PRD/QA/DSV/STG/EXCLUIR), segment/journey/template names, message content, font names, people's names | Skip |
| **Fragment** | A piece of a sentence split by a link or bold text, usually lowercase-initial (`aren't shown here.`, `more`) | Skip, unless it reads as a complete phrase on its own |
| **Third-party chrome** | Intercom, other extensions' overlays | Filter |

**Engine-bug signal:** a string the current code *should* handle but
doesn't. For example, it looks like it matches an existing pattern or
entry, or a whole family of near-identical rows is open. Investigate before
recommending. Past examples: Highcharts double-spaced days (`Aug  1`),
curly-apostrophe dictionary keys, and Title Case → sentence case drift.

Check whether a "PARTIAL" row is missing languages in `languages.json`.
Every key must cover all 10 languages.

### 4. Check the feedback form

1. Read `Form Responses 1`, range `A1:G`, from the feedback spreadsheet.
2. Consider responses from the last 14 days.
3. For each one, check whether it's already addressed in `languages.json`.
4. List open ones with the language, current text, suggestion, and your
   assessment.

Only mention the email address column if you need to identify who to ask
for clarification. Never copy addresses into the repo or a PR.

### 5. Decide

Recommend **UPDATE** if any of these holds:

- 10+ real new UI strings (UI copy + dynamic UI), at any install count
- any real UI string at 2+ installs
- any engine-bug signal
- a form response reporting a clearly wrong translation

Otherwise recommend **WAIT**, and say what's accumulating, e.g. "6 real
strings so far".

### 6. Report

Lead with the verdict and the one-line reason. Then:

- **Numbers:** strings reviewed, already handled, real UI, patterns,
  filters, skipped.
- **Proposed changes**, grouped by action (translate / pattern / filter),
  each with installs and paths. Mark anything you're unsure about.
- **Skipped** rows, grouped by reason (UGC / fragment), briefly.
- **Feedback form:** open items or "no new responses".
- **Next step:** "Reply **approve** to build it (or tell me what to
  change)", or "Nothing to do this week."

Keep it scannable. The maintainer reads this first thing Friday.

## Phase 2: Build (after approval only)

Follow `CLAUDE.md`, `STYLE_GUIDE.md`, `glossary.json`, and the relevant
`style/<lang>.md`. In short:

1. Branch from `main` (e.g. `ledger-sweep-<mon>-<yyyy>`).
2. Add every new key in **all 10 languages**. Append new keys at the end
   of `translations` and new patterns at the end of `patterns`. Write
   `languages.json` with 2-space indent, `ensure_ascii=False`.
3. Run `./validate.py`. It must report `Blocking: 0`. Fix glossary hits
   with the locked term, an alt form, or `_skip_keys` — never by loosening
   the check.
4. Run `node tools/regress.js`. It must report 0 mismatches.
5. Re-run `node tools/triage.js .review/rollup.json`. Only the rows you
   deliberately skipped should still need a decision.
6. Bump `manifest.json` and add a `CHANGELOG.md` entry **in the same
   commit** as the change. Use PATCH for under 50 strings; MINOR for 50+, a
   new language, or a visible behavior change. Update `README.md` for
   major changes, per `CLAUDE.md`.
7. Check `store-listing/*.md`. If the string count crossed the next
   hundred, or the pattern count changed, update all 11 files.
8. Push and open a PR.
9. Give the maintainer:
   - the PR link
   - the full updated English long description from `store-listing/en.md`,
     if it changed
   - a reminder that after merging, they upload the GitHub ZIP to the Web
     Store, and can then clear the `ledger` tab. Clearing is optional, since
     the triage dismisses already-handled rows on its own.
