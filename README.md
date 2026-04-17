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
| `ja` | Japanese   | ~65 dashboard terms        |
| `es` | Spanish    | ~65 dashboard terms        |
| `pt` | Portuguese | Placeholder — contribute!  |

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

## Adding a New Language

No JS changes required. Edit `languages.json`:

```json
{
  "fr": {
    "Settings": "Paramètres",
    "Segments": "Segments",
    "Messages": "Messages"
  }
}
```

Then add a matching `<option value="fr">French</option>` to the
`<select id="lang">` in `popup.html`, reload the extension from
`chrome://extensions`, and you're live.

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
languages.json   Translation dictionaries keyed by language code
content.js       Text-node walker + attribute allowlist + MutationObserver
background.js   Service worker: right-click "Suggest a better translation"
popup.html       Extension popup UI (language picker + feedback button)
popup.js         Saves language, warns about unsaved edits, opens issue form
styles.css       CJK-friendly typography (line-height, font stack)
```

## Known Limitations (v1)

- **Exact-match only.** "Settings" is translated, but "Project Settings"
  is not unless you add it as its own key. This prevents partial-substring
  corruption (e.g. translating "Settings" inside a URL fragment).
- **Short strings may collide.** A key like "Send" will translate every
  standalone "Send" in the DOM — including attributes. Prefer longer,
  context-specific keys where possible.
- **Browser-native validation messages are not translated.** Messages
  produced by the browser itself (e.g. the default tooltip on a `required`
  field) are controlled by the browser locale, not the DOM, so the
  extension cannot reach them. App-rendered error text is covered.

## Development

No build step. Edit source files, then click the reload icon on the
extension card in `chrome://extensions`.

## License

MIT.
