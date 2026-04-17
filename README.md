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

| Code | Language   | Status                     |
| ---- | ---------- | -------------------------- |
| `en` | English    | Passthrough (no changes)   |
| `jp` | Japanese   | ~50 dashboard terms        |
| `es` | Spanish    | ~50 dashboard terms        |
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

This extension only mutates **Text node `nodeValue`**. A `TreeWalker`
filtered to `SHOW_TEXT` visits every text node in the subtree; if the
trimmed content exactly matches a key in the active dictionary, we rewrite
just the text. Element nodes, attributes (`placeholder`, `title`,
`aria-label`), and React-owned handlers are never touched. When React
re-renders and replaces a text node, a `MutationObserver` catches the
addition and re-translates. Bursts of mutations are batched with
`requestAnimationFrame` so we don't thrash during rapid re-renders.

## File Map

```
manifest.json    Manifest V3 config, scoped to dashboard.onesignal.com
languages.json   Translation dictionaries keyed by language code
content.js       Text-node walker + MutationObserver
popup.html       Extension popup UI
popup.js         Saves language, warns about unsaved edits, reloads tab
styles.css       CJK-friendly typography (line-height, font stack)
```

## Known Limitations (v1)

- **Exact-match only.** "Settings" is translated, but "Project Settings"
  is not unless you add it as its own key. This prevents partial-substring
  corruption (e.g. translating "Settings" inside a URL fragment).
- **Text nodes only.** Placeholders, tooltips (`title`), and ARIA labels
  are still English.
- **Short strings may collide.** A key like "Send" will translate every
  standalone "Send" in the DOM. Prefer longer, context-specific keys where
  possible.
- **No ISO code nit:** We use `jp` instead of `ja` per the original spec.
  If you prefer `ja`, rename the key in `languages.json` and the option
  value in `popup.html` together.

## Development

No build step. Edit source files, then click the reload icon on the
extension card in `chrome://extensions`.

## License

MIT.
