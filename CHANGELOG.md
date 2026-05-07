# Changelog

All notable changes to OS Translate. The format is
loosely based on [Keep a Changelog](https://keepachangelog.com/) and the
project follows [Semantic Versioning](https://semver.org/) — see
[CLAUDE.md](./CLAUDE.md) for the bump rules.

## [Unreleased]

## [1.5.4] — 2026-05-07

### Fixed

- **Context-aware ledger filters now apply to attribute walks too.**
  The previous wiring (1.5.0 onward) only passed context through the
  text-node path of `translateString`. The attribute walker
  (`translateAttributes`) called `translateString` without context,
  so DOM-aware filters (Name column, UGC chrome, value picker,
  auto-suggest) silently no-op'd for any attribute they touched.
  This surfaced concretely in the value-picker case: react-select
  options render as `<div title="X">X</div>`, where the text
  content was correctly suppressed but the `title` attribute leaked
  the same UGC string into the ledger via the second walk.
  Fix: `translateAttributes` now passes `{ element: el }` as
  context; `trackMissed` normalizes either `context.textNode` or
  `context.element` into a single target element; helpers
  (`isInNameColumn`, `isInUgcChrome`, `isInUgcValuePicker`,
  `isInUgcAutoSuggest`) now accept an element directly. AutoSuggest
  options happened to dodge this because they don't carry title
  attributes — so 1.5.4 looked partially-working but was actually
  buggy across all four filters for any attribute-bearing markup.

### Added

- **Filter-value picker ledger skip.** Filter-value picker dropdowns
  (the popovers that open from filter tokens like "Label is X",
  "Tag is Y", etc.) show options sourced from the user's account
  data — UGC. Their menus get portaled away from the popover by
  react-select, so a contextual `closest()` can't find them. New
  `isInUgcValuePicker()` helper walks back via the shared
  `react-select-N-input` (which stays in the original popover
  while only the listbox portals): finds the input by ID, walks
  up looking for a nearby `<label>`, and matches the label text
  against an allowlist of known UGC-picker labels. Translation
  still runs through the listbox normally; only ledger reporting
  is suppressed.
- **2 more translations** for empty-state and audience-description
  prose: `A group of users` and `You don't have any segments`,
  full coverage across all 8 languages. (For es/pt/fr the segment-
  count phrasing uses the plural form to match the glossary lock —
  "No tienes Segmentos" / "Você não tem Segmentos" /
  "Vous n'avez pas de Segments".)
- **ARIA live-region ledger skip.** react-select (and other ARIA-
  compliant widgets) inject screen-reader-only announcements into
  hidden a11y spans every time the user interacts with a dropdown —
  things like "Crown Casino, 73 of 78.", "option , selected.",
  "Use Up and Down to choose options, press Enter to select the
  currently focused option…", "Select is focused, type to refine
  list, press Down to open the menu". The announcements live in
  visually-hidden spans (class `a11yText`), so they're invisible to
  the user but the text walker sees them. New `isInA11yLiveRegion()`
  helper matches a layered selector: `[id$='-live-region']` (the
  react-select live-region span), `[id$='-input-description']` (the
  keyboard-instructions span), `[aria-live]` (any ARIA-live region),
  the standard `[role='log'|'status'|'alert']` triplet, plus
  `[class*='a11yText']` as a catch-all for any react-select a11y
  span we don't enumerate, and direct ID matches for react-select's
  announcement spans (`#aria-selection`, `#aria-focused`,
  `#aria-guidance`, `#aria-context`, `#aria-results`) — these
  sometimes get detached from their `aria-live` wrapper before the
  observer fires, so ancestor-based selectors miss them. Translation
  still runs through these strings; only ledger reporting is
  suppressed.
- **Auto-suggest popover ledger skip.** The dashboard renders an
  `AutoSuggestPopoverMenu` whenever the user types into a property /
  tag / event-name input — and the suggested matches are sourced
  from the user's own account data, so by nature UGC. New
  `isInUgcAutoSuggest()` matches via the styled-component prefix
  `[class*='AutoSuggestPopoverMenu__']` (set by the dashboard's
  app code, stable across builds). Single `closest()` check covers
  both the `<ul>` container (`MatchList`) and each `<li>` option
  (`Match`). Translation still runs through the popover; only
  ledger reporting is suppressed.
- **UGC value-picker label allowlist** with two starting patterns
  (extensible, same shape as `NAME_HEADER_SOURCE_TERMS`):
  - `^Label is$` — the Label filter value picker
  - `^Labels \(\d+/\d+\)$` — the multi-select label counter
    ("Labels (0/5)" through "(N/M)")
  Active-language translations are added at runtime so the rule
  works whether the dashboard label reads `"Label is"` (English)
  or `"라벨이"` / `"标签为"` / etc.
- **9 new translations** for filter-editing UI and the message-row
  action menu:
  - `Label is` — value-picker header
  - `Search or select...` — react-select placeholder
  - `missing value` — appears as `[missing value]` in built filter chips
  - `View report` / `Edit labels` / `Copy message ID` /
    `View audit logs` / `View Audit Logs` — message-row dropdown
    menu items
  - `Reach targeted audience based on user properties or events
    from` — descriptive prefix on the audience filter card (the
    "Data Tags" link is rendered separately, so the prefix needs
    its own entry to translate independently)

### Notes

- New UGC-picker label patterns ("Tag is", "Country is",
  hypothetical "Labels (0/10)" if the max changes, etc.) will
  appear in the ledger as untranslated strings and can be added
  to `UGC_VALUE_PICKER_LABEL_SOURCES` / the translatable-sources
  list as they surface — same maintenance pattern as
  `NAME_HEADER_SOURCE_TERMS`.

## [1.5.3] — 2026-05-06

### Fixed

- **Name-column ledger filter now matches *all* identifier columns,
  not just the first one.** The 1.5.0 implementation iterated table
  headers but stopped at the first match — e.g. on a Messages table
  with columns `Name | Labels | Status | …`, the loop matched `Name`
  at index 0 and never registered `Labels` at index 1, so UGC label
  values like "Crown Bingo", "Joy Test", "Crown Casino" continued
  hitting the missed-string ledger. The cache now stores a `Set` of
  indices per table; `isInNameColumn` does set membership instead
  of equality. Renamed: `findNameColumnIndex` →
  `findNameColumnIndices`, `tableNameColumnCache` →
  `tableNameColumnsCache`.

## [1.5.2] — 2026-05-06

### Fixed

- **Name-column header term: `Label` → `Labels`.** The 1.5.1 entry
  was the wrong term — the actual dashboard table uses the plural
  header "Labels". Tables whose header reads "Labels" now get the
  Name-column ledger skip; tables with a singular "Label" header
  (rare, if any) no longer match this rule.
- **`CTR` now translates** to native script in East Asian languages:
  ja → `クリック率`, ko → `클릭률`, zh-CN → `点击率`, zh-HK → `點擊率`.
  Spanish, Portuguese, French, and Turkish keep `CTR` (industry
  standard among marketers in those languages). Glossary alts
  updated so the new canonicals validate.
- **Standalone `Label` translates** as a UI label
  (filter dropdown item, etc.). Translations: ラベル / 라벨 /
  Etiqueta / Etiqueta / Libellé / Etiket / 标签 / 標籤. (Distinct
  from `Tag` in languages where the words differ — French uses
  `Libellé` for Label vs `Tag` Latin; pt uses `Etiqueta` vs `Tag`.)

### Added

- **Subscription-count abbreviations** (`Push subs`,
  `SMS / RCS subs`, `Email subs`) translate to native phrasings
  in all 8 supported languages — full forms like
  `推送订阅` / `푸시 구독` / `Suscripciones push` /
  `Abonnements push`, etc.

### Changed

- **Ledger filter: drop bare `OneSignal` and `OneSignal.com`.**
  These appear across many pages (footers, links, version strings)
  but aren't translatable copy. The exact-match regex
  `^OneSignal(\.com)?$` is added to `couldBeUI`. Compound feature
  names like `OneSignal AI`, `OneSignal ID`, `OneSignal SMS` are
  unaffected — those are already in the dictionary and translate.

## [1.5.1] — 2026-05-06

### Changed

- **Ledger filter: added `Label` as a Name-column header term.**
  Tables whose `<th>` reads "Label" (or its active-language
  translation) get the same Name-column treatment as Name / Title /
  ID / Identifier — translation still attempted in cells, ledger
  reporting suppressed. Catches a class of tables (e.g. message
  Labels columns) where the visible identifier header is "Label",
  not "Name".
- **Ledger filter: skip the breadcrumb trail and app/account
  switcher chrome.** Both render on essentially every page-load and
  surface the same org names, app names, and signed-in emails over
  and over — collectively a substantial fraction of the per-batch
  ledger volume. Detection is via styled-component class prefixes
  (`BreadcrumbTrail__`, `BreadcrumbItem__`,
  `CleanSidebar__AppSwitcher`, `AppAccountDropdown`); using a
  prefix match makes the rule robust to per-build hash suffix
  changes. Translation continues to run through both surfaces.

## [1.5.0] — 2026-05-06

### Added

- **Context-aware ledger filtering.** `translateString` now threads
  a `context` object (currently the source text node) down into
  `trackMissed`. The translation logic itself is unchanged — every
  text node still gets a translation attempt — but the ledger filter
  can now make decisions based on *where* in the DOM the text came
  from, not just the text itself. This is the architectural seat
  for any future context-aware ledger filters (cross-install
  thresholds, proper-noun heuristics, etc.).
- **Name-column ledger skip.** When the active language's table
  headers identify a "Name / Title / ID / Identifier" column
  (matching either the English source or the translated form
  rendered in the active language), text inside that column's
  cells is no longer reported to the missed-string ledger. Crucial
  caveat: translation still runs through those cells, so structured
  subtext like "User Tag account_status is activated" or
  "Last Session greater than 168 hours ago" continues to translate
  via patterns. Only the *prominent UGC name* (which wouldn't
  translate anyway) stops polluting the ledger. Detection is by
  header text, not column position, so tables where Name is the
  second column work the same as tables where it's the first.
- **24 new date patterns** for chart axis date formats:
  - 12 `Mon 'YY` patterns (`Jan '25`, `May '26`, …)
  - 12 `Month YYYY` patterns (`January 2025`, `September 2026`, …)
  - Per-language formatting matches each locale's date conventions:
    East Asian languages put the year first (`'{1}年5月`); Spanish/
    Portuguese use "de" for full-year forms (`enero de {1}`); French
    omits the connector (`janvier {1}`); Turkish keeps month first
    (`Ocak {1}`).
  - These don't translate text inside `<svg>` (still skipped as of
    1.4.0) but are positioned to handle the formats wherever they
    appear outside SVG (range selectors, comparison tooltips, chart
    titles outside SVG, future SVG allowlist additions).

### Notes

- The Name-column heuristic relies on `<th>` text matching one of
  `Name`, `Title`, `ID`, `Identifier` (or their active-language
  translations). Tables that use a non-standard identifier header
  ("Campaign Name", "Segment Name", etc.) won't be detected and
  their cells will continue to populate the ledger as before. If
  this becomes a real source of noise we can extend the source-term
  list.
- Per-table "which column is Name?" lookups are cached in a
  `WeakMap` keyed by the table element, so repeated checks during
  a page-load don't re-traverse the header row. The cache releases
  automatically when React unmounts the table.

## [1.4.0] — 2026-05-06

### Changed

- **Charts (SVG content) are no longer translated, with one
  exception: the Highcharts legend.** The text walker, attribute
  walker, and MutationObserver skip subtrees inside `<svg>` *unless*
  they're inside `.highcharts-legend`. Axis labels (`May '25`,
  `Jul '25`), data-point markers, and accessibility aria-labels
  (`"May 2025, 7. Unsubscribed."`) all stop translating; the legend
  text (`Delivered`, `Confirmed receipt`, `Clicked`,
  `Unsubscribed`, etc.) keeps translating because it's stable —
  toggling series visibility only changes the legend's
  `text-decoration` style, not the text content, so the race
  condition that hits axis labels doesn't apply. Net effects: chart
  axis chrome reads consistent English, the legend keeps reading in
  the active language, and the missed-string ledger drops a
  major source of noise — each chart had been generating one
  aria-label entry per data point per series (50+ rows per page-load
  on a monthly chart with four series).

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

[Unreleased]: https://github.com/alatones/os-translate/compare/v1.5.4...HEAD
[1.5.4]: https://github.com/alatones/os-translate/compare/v1.5.3...v1.5.4
[1.5.3]: https://github.com/alatones/os-translate/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/alatones/os-translate/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/alatones/os-translate/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/alatones/os-translate/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/alatones/os-translate/compare/v1.3.2...v1.4.0
[1.3.2]: https://github.com/alatones/os-translate/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/alatones/os-translate/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/alatones/os-translate/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/alatones/os-translate/compare/v1.1.5...v1.2.0
[1.1.5]: https://github.com/alatones/os-translate/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/alatones/os-translate/compare/v1.0.0...v1.1.4
[1.0.0]: https://github.com/alatones/os-translate/releases/tag/v1.0.0
