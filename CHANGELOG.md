# Changelog

All notable changes to OS Translate. The format is
loosely based on [Keep a Changelog](https://keepachangelog.com/) and the
project follows [Semantic Versioning](https://semver.org/) — see
[CLAUDE.md](./CLAUDE.md) for the bump rules.

## [Unreleased]

## [1.4.0] — 2026-05-06

### Changed

- **Charts (SVG content) are no longer translated.** The text walker,
  attribute walker, and MutationObserver now all skip subtrees rooted
  at any `<svg>` element. Previously chart axis labels and legend
  text were inconsistently translated — some labels caught on first
  paint, others (e.g. labels rendered after a filter change or zoom)
  reverting to English — because Highcharts replaces SVG subtrees on
  re-render in ways our observer races. Consistent English chart
  chrome reads better than partial translation. Net effect on the
  user: chart labels (`May '25`, `Jul '25`, `Confirmed receipt`,
  `Clicked`, etc.) stay in English. Net effect on the missed-string
  ledger: a major reduction. Each chart had been generating one
  `aria-label` ledger entry per data point per series — for a
  monthly chart with four series, that's 50+ rows of accessibility
  metadata like `"May 2025, 7. Unsubscribed."` per page-load. Those
  are now suppressed entirely.

### Removed

- **`/super-user/*` paths are now ignored entirely.** This is the
  OneSignal-internal admin tool — not customer-facing. Every text
  node on those pages is UGC (org names, customer emails, account
  metadata). The translation walk and ledger reporting both
  short-circuit when the URL pathname starts with `/super-user`.
  Behavior for non-internal users: unchanged (they don't see those
  pages).

## [1.3.2] — 2026-05-04

### Changed

- **Spanish, Portuguese, French — `Journey` / `Journeys` Latin →
  native translations** (`Recorrido` / `Jornada` / `Parcours`).
  Previously the policy was applied only to Turkish and the East
  Asian languages; now it's consistent across all 8 supported
  locales. 56 es entries + 56 pt entries + 58 fr entries swept.
- Portuguese required gender flips since `Jornada` is feminine
  while `Journey` was treated as masculine: articles
  (`o → a`, `do → da`, `no → na`, `ao → à`), demonstratives
  (`este → esta`, `deste → desta`, `neste → nesta`),
  possessives (`seu → sua`, `meu → minha`), indefinites
  (`um → uma`), adjectives/past participles
  (`novo → nova`, `salvo → salva`, `criado → criada`,
  `atualizado → atualizada`, `ativo → ativa`,
  `próprio → própria`, `todo o → toda a`,
  `disparados → disparadas`).
- Spanish/French compound-modifier order fixed where
  `"Journey Webhooks"` had become `"Recorrido Webhooks"` /
  `"Parcours Webhooks"` after substitution: re-rendered as
  `"Webhooks de Recorrido"` / `"Webhooks de Parcours"` to read
  naturally in those languages (English-style noun-modifier
  inversion isn't natural in es/fr).

### Notes

- French `Parcours` is invariable (same form singular and plural),
  so `"les Journeys"` becomes `"les Parcours"` with article-only
  change.
- Skip-keys preserved (the `JOURNEY` SMS protocol token, the
  "Walkthrough your user journey…" entry where "journey" is
  lowercase common-noun usage, and the `The journey is the reward.`
  easter egg).
- Glossary canonicals were already in place from 1.3.0; this
  release is the languages.json sweep that brings the actual
  translations in line with those canonicals.

## [1.3.1] — 2026-05-04

### Fixed (translation feedback batch)

- **Turkish — Journey strings still showed in English.** The 1.3.0
  policy change promoted `Yolculuk` (Turkish for "journey") as the
  canonical, but only zh-CN/zh-HK entries got swept. Now 56 Turkish
  entries are translated, with proper Turkish grammar — k→ğ vowel
  harmony, attached suffixes instead of apostrophe-suffixes
  (`Journey'inizi` → `Yolculuğunuzu`, `Journey'den` → `Yolculuktan`).
  Glossary alts for `Yolculuk` now include inflected stems
  (`Yolculuğ`, `Yolculu`) so the validator accepts the harmonized
  forms.
- **Korean — `자동화됨` → `자동화`** (Automated). Dropped the passive
  `~됨` suffix on category labels; SaaS UI prefers nominal noun
  form. The `~됨` form is reserved for event-status badges
  (`발송됨` Sent, `실패됨` Failed, `완료됨` Completed). 2 entries
  affected.
- **Korean — `통합` → `연동`** (Integration). `통합` reads as
  "unified / consolidated" and is imprecise for the SaaS sense of
  integrating with an external system. `연동` is the natural
  Korean term for webhook / API / third-party tool integrations.
  10 entries affected (`Integrations`, `Add Integration`, `Connect
  Integration`, `HubSpot Integration Metrics`, `Data Warehouse
  Integration`, etc.).
- **`style/ko.md`** updated to lock these conventions
  (`자동화` not `자동화됨` for category labels; `연동` not `통합`
  for technical integrations).

### Added (translation feedback batch)

- **Portuguese (BR)** — six entries that were missing translations
  (and filled in across all 8 languages):
  - `View Org in Dashboard | View Audit Logs`
  - `App Disabled` → `App Desativado`
  - `This organization was disabled.` → `Essa organização foi
    desativada.`
  - `Portuguese` → `Português` (language picker label)
  - `Upgrade to see your users' recent messaging activity…
    Contact Sales` → full pt-BR translation
  - `for` → `para` (single-word UI label)

### Changed (translation feedback batch)

- **`Date timestamps are stored in UTC time (EDT is -04:00 from
  UTC)`** converted from a hardcoded EDT-only entry to a regex
  pattern that handles all timezone abbreviations (CDT, PST, MST,
  GMT, etc.). Per pt-BR feedback the Portuguese template was
  refined to "Os timestamps de data são armazenados em UTC
  ({1} é UTC{2})" — clearer phrasing than the previous "Datas
  são armazenadas em UTC ({1} é {2} do UTC)".
- Glossary `Disabled`: added feminine alts for es (`Deshabilitada`)
  and pt (`Desativada`), plus verb-form alts for ko (`비활성화되`,
  `비활성화`) so phrases like "essa organização foi desativada"
  validate against the glossary.

## [1.3.0] — 2026-05-04

### Changed

- **Generic marketing channel and feature names are now translated**
  in zh-CN and zh-HK instead of being kept in Latin. Affects: Push,
  Email, SMS, RCS, In-App, Live Activity / Live Activities, Journey /
  Journeys, Segment / Segments (the OneSignal feature), Data Feed /
  Data Feeds. Previously these read as English in an otherwise-
  translated dashboard, which felt jarring to East Asian readers.
  Sweep updated 227 zh-CN entries + 229 zh-HK entries + 6 patterns.
- New zh-CN canonicals (per Mainland coworker recommendations):
  推送 / 电子邮件 / 短信 / 富媒体短信 / 应用内 / 实时活动 / 旅程 /
  用户分群 / 数据源.
- New zh-HK canonicals (Traditional Chinese, HK lexicon):
  推送 / 電郵 / 短訊 / 富媒體短訊 / 應用內 / 即時動態 / 旅程 /
  用戶分群 / 資料來源.
- Turkish glossary canonical for "Email" promoted from `Email` to
  `E-posta` (proper Turkish term).
- `STYLE_GUIDE.md` rule #1 rewritten to distinguish brand names
  (locked Latin: OneSignal, Twilio, Mixpanel, etc.) from generic
  channel/feature names (translated per glossary). Webhook stays
  Latin in all languages — no natural translation in any major
  locale.

### Notes

- Skip-keys preserved: "Twilio Segment" (the company) stays Latin
  in entries where it's mentioned as a vendor; SMS protocol
  keywords (JOURNEY, STOP, etc.) stay Latin; "The journey is the
  reward." easter egg untouched.
- Other languages (ja, ko, es, pt, fr) had correct canonicals already
  and weren't swept. Japanese and Korean already translate to native
  script (プッシュ / メール / 푸시 / 이메일). Spanish, Portuguese, and
  French keep "Push" / "Email" / "SMS" in Latin since marketers in
  those languages use the Latin loanwords natively.

## [1.2.0] — 2026-05-04

### Added

- **Traditional Chinese (Hong Kong)** as a supported language (`zh-HK`).
  Full coverage: 1,517 dictionary entries + 73 regex patterns, plus
  the popup chrome and right-click CTA. HK-flavoured Traditional
  Chinese in 書面語 register (formal written, not 粵語白話文
  colloquial), with HK-specific lexicon — `儲存` / `設定` / `搜尋` /
  `匯入` / `匯出` / `受眾` — distinct from both zh-CN (Simplified,
  Mainland) and zh-TW (Traditional, Taiwan).
- `glossary.json` now locks 68 terms across 8 languages.
- New `style/zh-HK.md` per-language addendum documenting register,
  punctuation, length budgets, and an HK-vs-CN-vs-TW vocabulary table.
- `_locales/zh_HK/messages.json` for the Web Store listing.
- 🇭🇰 flag emoji in the language picker.

## [1.1.5] — 2026-05-01

### Fixed

- Fixed `ReferenceError: tab is not defined` crash in the popup when
  switching languages. The `tab` variable was scoped inside a `try`
  block but referenced outside it for `chrome.tabs.reload()`.

## [1.1.4] — 2026-05-01

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
- Added sender-ID validation to the `chrome.runtime.onMessage` handler
  in `background.js` so only messages from the extension's own contexts
  are processed.
- Obfuscated the ledger endpoint URL and added a shared request token
  sent with every ledger POST; the Apps Script backend validates the
  token before writing to the sheet.
- Replaced `innerHTML = ""` DOM clear in `queue.js` with a safe
  child-removal loop.
- Added structure validation to `loadDictionaries` in `content.js` so
  a malformed `languages.json` produces a clear error rather than a
  silent type fault.
- Wrapped `chrome.tabs.query()` in `popup.js` in a try/catch so a rare
  API failure degrades gracefully instead of crashing the popup.

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

[Unreleased]: https://github.com/alatones/os-translate/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/alatones/os-translate/compare/v1.3.2...v1.4.0
[1.3.2]: https://github.com/alatones/os-translate/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/alatones/os-translate/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/alatones/os-translate/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/alatones/os-translate/compare/v1.1.5...v1.2.0
[1.1.5]: https://github.com/alatones/os-translate/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/alatones/os-translate/compare/v1.0.0...v1.1.4
[1.0.0]: https://github.com/alatones/os-translate/releases/tag/v1.0.0
