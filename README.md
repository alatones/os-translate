# OneSignal Dashboard Translator

A Manifest V3 Chrome/Edge extension that translates the OneSignal admin
dashboard (`https://dashboard.onesignal.com`) into non-English languages.
Ships with Japanese and Spanish out of the box, plus a placeholder for
Portuguese.

The extension only runs on the OneSignal dashboard — no other sites are
touched and no browsing data is collected.

## Install (Load Unpacked)

1. Clone this repo.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and point at the repo root.
5. Visit <https://dashboard.onesignal.com>. Japanese is the default.
6. Click the extension icon to switch languages.

## Supported Languages

Language codes follow ISO 639-1.

| Code | Language   | Status                     |
| ---- | ---------- | -------------------------- |
| `en` | English    | Passthrough (no changes)   |
| `ja` | Japanese   | ~724 dashboard terms + patterns |
| `es` | Spanish    | ~724 dashboard terms + patterns |
| `pt` | Portuguese | ~724 dashboard terms + patterns |
| `ko` | Korean     | ~724 dashboard terms + patterns |

## How Persistence Works

Your language choice is stored with `chrome.storage.sync`. This is a small
key-value store provided by the browser, scoped to this extension's ID.

When you pick a language in the popup, `popup.js` writes
`{ language: '<code>' }` to `chrome.storage.sync`. On every subsequent page
load — new tab, new window, browser restart, or a different computer signed
into the same Chrome/Edge profile — `content.js` reads that same value
before running its first translation pass. **Set it once and it sticks.**

`storage.sync` also emits a `chrome.storage.onChanged` event, which
`content.js` listens to. If you change the language while the dashboard is
already open, the popup triggers a full page reload (after confirming —
see below) so the translation starts from a known-clean DOM.

## Reload Confirmation

Switching languages reloads the active dashboard tab so every string
re-renders from scratch. Before reloading, the popup shows a `confirm()`
dialog warning you that unsaved work (drafts, segment builders, open
editors) will be lost. Click **Cancel** to keep your current language and
preserve in-flight edits.

## Reporting Translation Issues

The audience for this extension is marketers, PMs, and CRM ops — not
developers. Feedback opens a **pre-filled email** in the user's default
mail client. No account, no signup, no GitHub required.

Two paths:

1. **Right-click a specific string.** Select any text on the dashboard,
   right-click, and choose **Suggest a better translation for "…"**. A
   new email opens with To / Subject / Body pre-filled: the selected
   text, current language, and dashboard URL are already there — the
   user just writes the suggested replacement and hits Send.
2. **General feedback.** Click the extension icon and hit **Report a
   translation issue** at the bottom of the popup. Same pre-filled email,
   but without a specific selection.

Nothing is transmitted by the extension itself. The mail client controls
the send — the user can edit, cancel, or discard the message like any
other draft.

### Setting the feedback address

Edit `FEEDBACK_EMAIL` in **two places** (keep them in sync):

- `background.js` (near the top, ~line 6)
- `popup.js` (near the top, ~line 5)

Reload the extension from `chrome://extensions` after changing it.

### Prefer a Google Form instead of email?

If you'd rather collect feedback in a spreadsheet, create a Google Form
with pre-filled fields for language, page URL, and suggestion, then grab
its pre-filled URL
(`https://docs.google.com/forms/d/e/.../viewform?entry.123=...`). Replace
the `mailto:` URL construction in `background.js` and `popup.js` with
your form URL — the code path (`chrome.tabs.create({ url })`) is
identical, only the URL shape differs.

## Dictionary Shape & Maintenance

`languages.json` is **keyed by English term**, with every language nested
inside one block per term:

```json
{
  "languages": {
    "ja": "日本語 — Japanese",
    "es": "Español — Spanish"
  },
  "translations": {
    "Settings": { "ja": "設定", "es": "Ajustes" },
    "Segments": { "ja": "セグメント", "es": "Segmentos" }
  }
}
```

This shape is optimized for maintenance:

- **Adding a term** = one new line. Add `"Save changes": { "ja": "変更を保存" }`
  and you're done — fill in other languages later. Missing codes fall
  through to English silently.
- **Adding a language** = add one line to the top-level `languages` map
  (e.g. `"fr": "Français — French"`) and start sprinkling `"fr": "..."`
  into the term blocks you care about. The popup dropdown and content
  script both read the registry at load — **no JS or HTML edits.**
- **Reviewing coverage** = scan a column. One glance at `"Settings"`
  shows every language that has translated it.

### Adding a New Language (step-by-step)

1. Add the code + display label to `languages` in `languages.json`:
   ```json
   "languages": { "fr": "Français — French", ... }
   ```
2. In the `translations` object, add `"fr": "..."` to whichever terms
   you want to translate. Leave the rest — those show English.
3. Reload the extension from `chrome://extensions`. The popup dropdown
   picks up the new language automatically.

### Adding a New Term

One edit, one file:

```json
"translations": {
  "Save changes": { "ja": "変更を保存", "es": "Guardar cambios" }
}
```

No other files to touch.

## Regex Patterns (for dynamic strings)

Exact-match handles fixed UI copy. For strings with a variable portion —
"Sent 1,234 messages", "Last 7 days", "3 segments selected" — use a
pattern. Same file, sibling array:

```json
"patterns": [
  {
    "match": "^Sent (\\d+) messages?$",
    "translations": {
      "ja": "{1}件のメッセージを送信しました",
      "es": "Enviados {1} mensajes"
    }
  }
]
```

**Authoring rules:**

- `match` is a JavaScript regex source string. Escape backslashes for JSON
  (`\\d`, `\\s`, etc.).
- **You are responsible for anchors** (`^…$`). Unanchored patterns will
  substring-match and may catch more than you intended. Start with `^…$`.
- `{1}`, `{2}`, … in each translation refer to the first, second, … capture
  group. `{0}` is the full match.
- Patterns are tried **after** exact-match, in array order. First match
  wins. Keep more specific patterns higher up.
- Missing languages fall through to English for that pattern, same as
  exact-match.
- If a `match` regex is invalid, it's skipped with a `console.warn` — it
  won't break the translator.

## Crowdsourced Missed-String Ledger

The extension notices every English string it sees on the dashboard that
it can't translate (neither exact-match nor pattern), counts how often
each one appears, and — if the user opts in — sends a daily anonymized
batch to a Google Sheet you own. You harvest the highest-count entries
and add them to `languages.json`.

This replaces the "maintainer has to hand-audit the live dashboard"
workflow. Actual users of the translated dashboard surface the gaps for
free.

### What gets sent (and what doesn't)

**Sent:**

- Active language code (`ja` / `es` / `pt`).
- The English string itself.
- How many times it was seen on this install.
- URL **pathname only**, with any segment that looks like an ID
  (16+ chars) replaced by `:id`. Example:
  `/apps/6d9b1f09-.../messages/push/new` → `/apps/:id/messages/push/new`.

**Never sent:**

- Full URLs, query strings, hashes.
- User IDs, install IDs, cookies, auth headers.
- Strings containing `@`, `http(s)://`, long digit runs, or base64-shaped
  tokens. These are filtered client-side before the string is even queued.
- Strings shorter than 2 or longer than 80 characters.
- Strings seen fewer than 3 times on the install (debounces one-off
  dynamic content).

Users can view the full pending queue in a bundled page — popup →
**View what's queued →** — to see exactly what would be sent, and can
clear it or flip opt-in off at any time.

### Backend Setup (Google Apps Script, once)

Zero-infrastructure receiver. ~5 minutes end-to-end.

1. Create a new Google Sheet. Name the first tab `ledger`. Add a header
   row: `timestamp | lang | path | string | count`.
2. **Extensions → Apps Script.** Paste this into `Code.gs`:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActive().getSheetByName("ledger");
     const body = JSON.parse(e.postData.contents);
     const now = new Date();
     const rows = (body.entries || []).map((en) => [
       now,
       en.lang || "",
       en.path || "",
       en.string || "",
       en.count || 0,
     ]);
     if (rows.length) {
       sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
     }
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true, received: rows.length }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Type: Web app.**
   - Execute as: **Me**.
   - Who has access: **Anyone** (the URL itself is the secret).
   - Click **Deploy**, grant permissions, and copy the
     `https://script.google.com/macros/s/.../exec` URL.

4. Paste that URL into `background.js` at the top:

   ```javascript
   const LEDGER_ENDPOINT = "https://script.google.com/macros/s/.../exec";
   ```

5. Reload the extension from `chrome://extensions`.

After a day of use on any install, new rows will appear in the sheet.
Sort by `count` descending, skim the top entries, and fold anything real
into `languages.json`.

### Harvesting workflow

- Sort the sheet by `count` descending.
- Ignore anything that looks like user-generated content (app names,
  segment names, custom data values). These are the false positives the
  PII filter can't catch.
- For each legitimate UI string: add it to `translations` (exact-match)
  or — if it has a `\d+` / variable portion — add a new entry to
  `patterns`.
- Release a new version. Users pull your update and those strings stop
  appearing in future batches.

### Quotas & scaling

Apps Script gives you 20k executions/day per script. At 1 POST per
install per day, that's 20k daily active installs before you need to
think about it. When/if that limit becomes real, the client is written
to be endpoint-agnostic — point `LEDGER_ENDPOINT` at a tiny serverless
function on any host.

### Privacy surface

- Default: **on**. The first time the popup opens after install, a
  one-time banner explains what's shared and links to the queue viewer.
- One checkbox in the popup flips it off. Opting out stops future POSTs
  immediately; the local queue is preserved until manually cleared
  (useful if the user wants to review what would have been sent).
- Local ledger lives in `chrome.storage.local` and never syncs to Google
  account storage.

## How Translation Works (and Why It's Safe With React)

OneSignal's dashboard is a React single-page app. Naive translation
approaches (overwriting `innerHTML` or `element.textContent`) break React
because they invalidate the virtual-DOM diff and often detach event
listeners.

This extension mutates two narrow surfaces:

1. **Text node `nodeValue`.** A `TreeWalker` filtered to `SHOW_TEXT` visits
   every text node in the subtree; if the trimmed content exactly matches a
   key in the active dictionary, we rewrite just the text. Element nodes
   and React-owned event handlers are never touched.
2. **An attribute allowlist.** `placeholder`, `title`, `aria-label`,
   `aria-placeholder`, `aria-description`, and `alt` are translated in
   place via `setAttribute`. This covers form placeholders, tooltips,
   screen-reader labels, and the ARIA surfaces that inline validation /
   error messages ride on. Structural attributes (`class`, `id`, `data-*`,
   event handlers) are left alone.

A `MutationObserver` watches `childList`, `characterData`, and attribute
changes filtered to the allowlist. When React re-renders, new nodes and
changed attributes are re-translated automatically. Bursts of mutations
are batched with `requestAnimationFrame` so we don't thrash during rapid
re-renders.

## File Map

```
manifest.json    Manifest V3 config, scoped to dashboard.onesignal.com
languages.json   Exact-match dictionary + regex patterns, per language
content.js       Text-node walker, attribute allowlist, MutationObserver, missed-string tracker
background.js    Service worker: feedback mailto, daily ledger batch POST
popup.html       Extension popup: language picker, ledger opt-in, queue link
popup.js         Saves language, manages opt-in, first-run disclosure
queue.html       Full-page viewer for the local missed-string queue
queue.js         Reads chrome.storage.local, renders by lang/path, manual send/clear
styles.css       CJK-friendly typography (line-height, font stack)

CLAUDE.md        Always-loaded instructions for AI-assisted edits
STYLE_GUIDE.md   Global translation rules (UI roles, quotes, brand handling)
glossary.json    Locked English-to-target term mappings (with grammatical alts)
style/<lang>.md  Per-language addenda (register, punctuation, length budgets)
validate.py      Mechanical conformance check; must report 0 blocking violations
```

## Known Limitations

- **Exact-match + regex patterns only.** "Settings" is translated, but
  "Project Settings" is not unless you add it as its own key. This
  prevents partial-substring corruption (e.g. translating "Settings"
  inside a URL fragment). Dynamic strings (`Sent 1234 messages`) need a
  regex pattern — see the patterns section above.
- **Short strings may collide.** A key like "Send" will translate every
  standalone "Send" in the DOM — including attributes. Prefer longer,
  context-specific keys where possible.
- **Browser-native validation messages are not translated.** Messages
  produced by the browser itself (e.g. the default tooltip on a `required`
  field) are controlled by the browser locale, not the DOM, so the
  extension cannot reach them. App-rendered error text is covered.
- **Free-form product copy** (long paragraphs, marketing text) is out of
  scope for exact-match / regex and isn't covered. Post-V1 roadmap may
  add an LLM fallback, but the ledger should tell us whether that's
  actually worth the cost.

## Development

No build step. Edit source files, then click the reload icon on the
extension card in `chrome://extensions`.

## License

MIT.
