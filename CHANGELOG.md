# Changelog

All notable changes to OS Translate. The format is
loosely based on [Keep a Changelog](https://keepachangelog.com/) and the
project follows [Semantic Versioning](https://semver.org/) — see
[CLAUDE.md](./CLAUDE.md) for the bump rules.

## [Unreleased]

### Fixed

- Updated three references to the old GitHub repo name (`Translate-os`)
  after the maintainer renamed the repo to `os-translate`. Touched the
  README's example download path and the two CHANGELOG comparison/tag
  links in the footer. GitHub redirects from the old URL but the
  canonical URL is cleaner — particularly for the privacy-policy URL
  pasted into the Chrome Web Store Developer Dashboard.
- Cleaned a duplicated intro paragraph in `PRIVACY.md` left over from
  the rename + unofficial-extension PR merge: removed the stub line
  "OS Translate is a Chrome/Edge browser extension" (without
  continuation) above the disclaimer, and updated the full-sentence
  intro below the disclaimer to use "OS Translate" instead of the
  stale "OneSignal Dashboard Translator." One clean intro paragraph
  now follows the disclaimer.

### Added

- `store-listing/` directory with the long-form Chrome Web Store
  marketing description in English (and per-language translations as
  they land). These are paste-ready plain text for the Web Store
  Developer Dashboard's per-locale "Detailed description" field —
  separate from the short `_locales/<code>/messages.json`
  `extDescription` (≤132 chars) which Chrome localizes automatically.
- `PRIVACY.md` — public privacy policy for the Chrome Web Store
  listing requirement. Describes the local-only language preference,
  the opt-in missed-string ledger, the `couldBeUI` filter list, and
  what the extension explicitly does NOT collect (PII, browsing
  history, behavioral data, customer/campaign content). Hostable on
  GitHub Pages or linkable as a raw GitHub blob URL.

## [1.1.3] — 2026-05-01

### Changed

- Extension renamed to **OS Translate** (was "OneSignal Dashboard
  Translator" / "OneSignal Translator"). Applied across every
  identity surface: `manifest.json` action.default_title, popup
  `<title>` and `<h3>`, all 8 `_locales/<code>/messages.json`
  extName entries, all 8 `store-listing/<code>.md` mid-prose
  references, README and PRIVACY.md titles, internal console-log
  prefixes (`[OS Translate]`).
- The rename completes the unofficial-extension reframe: the
  extension's display name no longer references the OneSignal
  brand at all. Descriptive prose in the README, PRIVACY policy,
  and store listings still names the OneSignal dashboard as the
  thing being translated — that use is protected under the
  nominative fair use language already on `unofficial-extension`.

## [1.1.2] — 2026-05-01

### Changed

- New extension icon: replaced the OneSignal "1" mark with a generic
  translation glyph (chat bubbles with "A" / "文" inside a larger
  bubble, blue-to-purple gradient). Eliminates the strongest
  trademark concern of using a brand's logo on a third-party tool —
  the unofficial framing in PRIVACY.md and README.md (along with the
  nominative-fair-use language) gives the textual coverage; this
  swap gives the visual coverage. Source PNG renamed from
  `os-logo-512.png` to `logo-512x512.png` and committed at the
  repo root. Generated `icons/icon-{16,32,48,128}.png` from the new
  source via Lanczos downsampling. Follow-up commit applied a
  flood-fill alpha mask so the corners outside the chat-bubble
  shape render transparent on dark menu surfaces.

## [1.1.1] — 2026-04-30

### Changed

- Dropped the redundant `activeTab` permission from the manifest. Our
  existing `host_permissions: ["https://dashboard.onesignal.com/*"]`
  already covers the only `chrome.tabs.*` calls we make
  (`tabs.query` + `tabs.reload` against the dashboard tab), and we
  never act on non-dashboard tabs. Removing it tightens the install
  warning surface with no behavior change. Permissions are now
  exactly: `storage`, `contextMenus`, `alarms` plus the two
  scoped host_permissions for the dashboard and the Apps Script
  ledger endpoint.

## [1.0.1] — 2026-04-30

### Fixed

- Fresh installs now default to **English (off)** instead of Japanese.
  Previously a brand-new install would auto-translate the dashboard to
  Japanese before the user had picked a language — surprising for
  English-speaking testers. The popup now shows "English (off)" until
  you explicitly pick a language.
## [1.1.0] — 2026-04-30

### Added

- Multi-language Chrome Web Store listing. Added `_locales/` files for
  English, Japanese, Spanish, Brazilian Portuguese, Korean, French,
  Turkish, and Simplified Chinese. The Web Store now displays the
  extension's name and short description in the user's browser locale,
  improving discoverability for non-English markets.
- `default_locale: "en"` declared in the manifest as the fallback for
  unsupported browser locales.

### Notes

- Chrome's locale codes use underscores in directory names
  (`zh_CN`, `pt_BR`), distinct from the hyphenated codes the extension
  uses internally for the dashboard translation feature (`zh-CN`).
  This is purely a Web Store listing change — the dashboard
  translation engine is untouched.
- The `name` and `description` manifest fields now reference
  `__MSG_extName__` and `__MSG_extDescription__`. Loading the
  unpacked extension still works the same way; the per-locale
  rendering activates when distributed via the Web Store.

## [1.0.0] — 2026-04-30 — Beta release

First version released for beta testing.
Pre-1.0 development happened in a tight burst; this entry captures the
cumulative state at the beta cut.

### Languages

Seven supported languages, each at full coverage of **1,517 dictionary
entries + 73 regex patterns**:

- 🇯🇵 Japanese (`ja`)
- 🇪🇸 Spanish (`es`) — LATAM-neutral
- 🇧🇷 Portuguese (`pt`) — pt-BR
- 🇰🇷 Korean (`ko`)
- 🇫🇷 French (`fr`) — vous formal, infinitive buttons
- 🇹🇷 Turkish (`tr`) — siz formal, 2nd-person imperative buttons
- 🇨🇳 Simplified Chinese (`zh-CN`) — Mainland, drop-pronoun or 您 formal,
  bare-verb buttons

### Translation engine

- React-safe DOM translation: text-node walker, attribute allowlist,
  MutationObserver, curly-quote normalization, extension-context
  invalidation guard.
- Pattern-based translation for dynamic strings (date abbreviations,
  numeric counts, time-ago, "X selected" pluralization).
- Glossary substring enforcement so locked terms (Send / Manage / Delete /
  Audience / Segment / Journey / etc.) translate consistently across the
  dashboard.

### Feedback & ledger

- Right-click **"Suggest a better translation for ..."** context-menu
  entry, localized per active language. Opens a pre-filled Google Form
  with the highlighted text and current language already populated.
- Popup **"Report a translation issue"** button opens the same form
  pre-filled with the language only.
- Crowdsourced missed-string ledger: dashboard strings that didn't match
  the dictionary get queued in `chrome.storage.local`, batched daily, and
  POSTed to a Google Apps Script endpoint that lands rows in a Sheet.
  Opt-in by default (popup checkbox), with a "view what's queued" page.

### Popup chrome

- Localized popup UI: "Language" label, opt-in checkbox, queue link,
  feedback button, hint text, status messages, and the reload-confirm
  dialog all render in the active target language.
- Flag emojis next to each option in the language picker.
- OneSignal-branded extension icon (16/32/48/128, downscaled from a
  single 512×512 source PNG via Lanczos).

### Tooling

- `glossary.json` — 68 locked terms with per-language grammatical-variant
  alts and per-term `_skip_keys` for sources where the term appears in a
  different sense.
- `validate.py` — glossary substring check (case-insensitive on source),
  pattern regex compilability, capture-group reference check, ASCII
  straight-quote enforcement, untranslated informational count.
- `style/<lang>.md` — per-language addendum covering register, punctuation,
  length budgets, brand handling.
- `CLAUDE.md` — agent / contributor playbook, including the "always fill
  every supported language" rule and (added with this changelog) the
  versioning convention.

[Unreleased]: https://github.com/alatones/os-translate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/alatones/os-translate/releases/tag/v1.0.0
