# Changelog

All notable changes to OS Translate. The format is
loosely based on [Keep a Changelog](https://keepachangelog.com/) and the
project follows [Semantic Versioning](https://semver.org/) — see
[CLAUDE.md](./CLAUDE.md) for the bump rules.

## [Unreleased]

## [1.9.1] — 2026-06-24

### Fixed

- **Web Store short descriptions now list all 9 languages.** The
  `extDescription` field in each `_locales/<lang>/messages.json`
  (the short blurb Chrome shows under the extension name in the
  Web Store, 132-char cap) was stale — it still referenced 7 or 8
  languages depending on locale. Both Traditional Chinese (added
  1.6.10) and Indonesian (added 1.6.17) were folded into the
  long-form `store-listing/*.md` files in 1.7.1, but the short
  descriptions never got the sweep. Updated 10 locales (en, es, fr,
  id, ja, ko, pt_BR, tr, zh_CN, zh_TW) to list all 9 in the
  canonical order: Japanese, Spanish, Portuguese, Korean, French,
  Turkish, Chinese (Simp/Trad), Indonesian.

  English string lands at 127 chars (was 131); all other locales
  comfortably fit. CJK locales (ja/ko/zh-CN/zh-TW) at ~54-74 chars
  per character density.

## [1.9.0] — 2026-06-24

### Added

- **70 new UI translations across 9 languages**, sourced from the
  June 24 ledger pass. Triaged into five buckets:
  - **Bucket A** (5 strings + 1 pattern): missed from Tier C in
    1.8.0 — `Card`, `Block`, `Margin`, `Frequency`, `Alignment`.
    Plus a new `^Card (\d+)$` regex pattern so `Card 1`, `Card 2`,
    etc. translate by index rather than as separate dict entries.
  - **Bucket B** (25 strings): high-install genuinely new UI —
    stats / detail-pane colon variants (`Delivered:`, `Subscribes:`,
    `Included:`, `Created:`, `Last Updated:`, `Subscribed:`,
    `Subscription ID:`), filter / chart toggles (`Show Opened`,
    `Any Day`), metrics (`Subscribed Users`, `Conversion Metrics`),
    Journey UI (`Journey Goal`, `Custom Event Occurs`,
    `Enters a Segment`, `Previous Message`), Journey branching
    feature (`Branch A` / `B`, `Add Branch`, `Equal Distribution`,
    `Randomize`, `Branch Distribution`, `Expiration Branch`,
    `Re-entry`), and admin UI (`Audit logs`, `Team members`,
    `Manage app`, `Add an App`, `New App`,
    `Move Apps Into Organization`).
  - **Bucket C** (17 strings): AI assistant feature — `New
    conversation`, `View reasoning`, `Stop generating`, status
    spinners (`Thinking…`, `Processing…`, `Analyzing your
    request…`, `Calculating`, `Working on it…`), chat surface
    (`Ask me anything about your app...`, `Chat message input`,
    `What do you want to know?`, `AI can make mistakes, always
    verify.`), and suggested prompts (`Show me my active
    segments`, `What are my app stats?`, `How are my recent
    push notifications performing?`, `Create a new segment
    called 'VIP Users'`).
  - **Bucket D** (10 strings): Journey wait-window / time-window UI
    — `Wait Until Time Window`, `Set Time Window Rules`,
    `Set a time window`, `What time / days can users proceed to
    the next step?`, `Timezone Fallback`, `Select Timezone`,
    `Any time`, `Tracked up to`, `Users On`.
  - **Bucket E** (10 strings): empty states / onboarding copy —
    `You'll see data here…` variants, `User has not been in any
    Journeys`, `Send your first in-app!`, `Your events are live!`,
    `You're all set up`, `No recent activity`, `To get started,
    add your first app.`, `Learn more about subscriptions.`,
    `Message events in last 60 days`.

  All glossary locks honored — Journey/Segment native forms in
  ja/ko (`ジャーニー`/`저니`, `セグメント`/`세그먼트`), Subscription
  native forms in 8 langs (id stays Latin per Santi's rule),
  In-App + App locks satisfied by `インアプリ` / `인앱` (containing
  `アプリ` / `앱`), Push + Notification combined via `推送通知` in
  zh-CN/zh-TW.

### Fixed

- **Popup widget now localized in Indonesian and Traditional Chinese.**
  `POPUP_STRINGS` was missing `id` and `zh-TW` entries for all 11 keys,
  so the popup chrome (language label, opt-in checkbox, disclosure,
  hint, queue link, feedback button, status messages, reload confirm)
  silently fell back to the inline English in `popup.html` whenever
  either language was selected — even though the dashboard itself was
  translating correctly. 22 new strings added (2 langs × 11 keys),
  applying style/id.md and style/zh-TW.md conventions.

### Changed (per Indonesian reviewer — Santi, first-round)

- **Four Indonesian terminology corrections** following Santi's review
  of the 1.7.0 first-draft. Each term reads as semantically wrong or
  unnatural in Indonesian; the English form is the common loanword in
  Indonesian product/analytics copy and is now locked:
  - `Overview` (was: `Ikhtisar`) — Ikhtisar isn't used in everyday
    Indonesian product/analytics contexts.
  - `Engagement` (was: `Keterlibatan`) — Keterlibatan reads literally
    as "involvement"; doesn't carry the marketing sense.
  - `Subscription` / `Subscriptions` (was: `Berlangganan`) —
    Berlangganan reads as "opted-in to a service," not the OneSignal
    noun (a record representing a way to reach a user).
  - `Subscriber` / `Subscribers` (was: `Pelanggan`) — Pelanggan reads
    as "customer."
  - `drag-and-drop` family (was: `seret-dan-lepas`) — literal calque;
    `drag-and-drop` is the loanword convention in Indonesian product
    UI. Inflected verb forms (`menyeret`, `diseret`) in a11y
    instruction prose are untouched — those are correct conjugation,
    not the noun-compound term.

  61 id translations swept (gated on source-key word-boundary match
  so verb forms like "Subscribed" / "Unsubscribed" in source stay as
  `Berhenti berlangganan` etc., avoiding broken Indonesian).
  `glossary.json`: id locks for Subscription / Subscriptions /
  Subscriber / Subscribers switched to Latin lists (singular + plural
  variants accepted). New glossary entries added for Overview,
  Engagement, drag-and-drop — id-only locks; other languages keep
  translation freedom. `style/id.md` updated with a "Stays Latin (per
  Indonesian reviewer)" section.

### Notes (no code change)

- **Issue 1 — context menu in English** (Santi): resolved on Santi's
  end by updating the local install to 1.8.0; `MENU_TITLES` already
  has `id` and `zh-TW` entries. Stale unpacked install was the cause.
- **Issue 2 — Google Form pre-fill not selecting Indonesian**: resolved
  externally by adding `Indonesian` as a dropdown option on the form.
  Pre-fill mapping in `FORM_LANG_LABEL` was already correct. Note:
  `Traditional Chinese` as a form option still TBD — once added there,
  zh-TW pre-fill works automatically (no code change).
## [1.8.0] — 2026-06-12

### Added

- **111 new UI string translations across 9 languages**, sourced from
  the June 2026 ledger pass. Grouped into three tiers for review:
  - **Tier A** (23 strings): metrics & session-attribution labels —
    `Unique clicks`, `Unique Opens`, `Total Opens/Clicks`, `Conversions`,
    `Suppressed`, `Unattributed / Influenced / Direct sessions`
    (plus colon variants), chart-series toggles (`Show Unattributed
    sessions`, etc.), `Show Confirmed`, conversion-overview pickers
    (`Select conversion metric`, `All Channels`), `Click to Open Rate`,
    `Click activity`.
  - **Tier B** (21 strings): filters/actions/auth — `View filter JSON`,
    `View Click Activity`, `View Journeys documentation`, `Update
    Segment`, `Refresh Stats`, `Copy / Remove filter (group)`,
    `Create new template`, `Create or select a template...`, `Search By
    OneSignal ID`, plus the full 2FA flow (`Verify`, `Verify Your
    Identity`, `Use a recovery code`, `Unable to authenticate?`,
    `Enter the code from your authentication app.`, `Authentication
    Code`).
  - **Tier C** (67 strings): status badges, section headers, inline
    trailing-colon labels, percentage labels, journey-exit conditions
    (5 strings), long-form body copy / empty states (`Activity is
    available for 30 days...`, `Loading In-App Message...`,
    `Per-subscription activity data is no longer available...`),
    numbered step labels (`1. Message`, `3. Triggers`, `4. Schedule`),
    and Latin acronym passthroughs (`HubSpot`, `CTOR`, `CRM`).

  All glossary locks honored — Journey/Segment/Subscription native
  forms in ja/ko/zh-CN/zh-TW, Tag locks applied to pt/fr/id, Active
  lock for tr, Delivered (`tersampaikan`) lock for id. Several
  first-pass translations adjusted post-validator (e.g. `Click to
  Open Rate` restructured in 5 languages to contain the locked
  Open Rate substring; `Loading In-App Message...` uses
  `インアプリ`/`인앱` which contain `アプリ`/`앱` to satisfy both
  In-App and App locks at once).

- **Five new `content.js` ledger-noise filters** for high-install
  strings the June 2026 ledger surfaced that aren't UI text:
  - `MISSED_DAY_MONTH_DATE_RE` — `Wed Jun 03 2026` style
    (JS `Date.toString()` output). Translation patterns deferred:
    full coverage would require day-of-week × month combinations.
  - `MISSED_VERBOSE_TIMESTAMP_RE` — `December 18th 2025, 1:14 pm`
    style audit-log timestamps.
  - `MISSED_GMT_OFFSET_RE` — `Local (GMT-3):` and bare `GMT-3`
    timezone metadata accompanying chart axis context.
  - `MISSED_MOBILE_DEVICE_RE` — `Samsung Galaxy Tab A8 (14)`,
    `Redmi Redmi Note 14 (15)`, `Motorola moto g05 (15)` —
    analytics user-agent fingerprints, never UI strings.
  - `MISSED_INTEGRATION_BLURB_RE` — integration marketplace
    descriptions (`Mixpanel provides behavioral product
    analytics...`) — verbose marketing copy that changes
    upstream frequently; better filtered than translated.

### Changed

- **Ledger POST payload now includes `extensionVersion`.** New top-level
  field carrying `chrome.runtime.getManifest().version` so every row
  in the receiver sheet can be tagged with the build that emitted it.
  The Apps Script `doPost` template in `README.md` updated to extract
  the field and add it as a new column (`extensionVersion`); the
  documented sheet schema becomes
  `timestamp | lang | path | string | count | installId | extensionVersion`.
  Older installs (pre-1.8.0) POST without the field; the Apps Script
  substitutes `""` so their rows show blank in that column rather than
  failing. Lets you separate noise from stale unpacked installs from
  genuine regressions on the latest build by pivoting on version.

### Investigation

- **Bare `Jun 1` / `May 8` ledger noise:** still appearing despite
  pattern coverage and `MISSED_BARE_MONTH_DAY_RE` filter (both
  added in 1.6.15). Most plausible cause: beta-tester unpacked
  installs that haven't been reloaded since 5/20. Chrome doesn't
  auto-reload unpacked extensions; the Web Store version updates
  automatically but beta cohort installs are manual. No code
  change needed — beta testers should reload at
  `chrome://extensions`.

## [1.7.1] — 2026-05-29

### Added

- **Indonesian (id) store listing** (`store-listing/id.md`) — Web
  Store description in Bahasa Indonesia following the style guide
  (Anda formal address, Latin channel/feature names, marketer
  loanwords).

### Changed

- **All store listings now mention nine languages.** Each localized
  Web Store description (`en`, `es`, `fr`, `ja`, `ko`, `pt_BR`,
  `tr`, `zh_CN`, `zh_TW`) updated to add Indonesian to the language
  count and the supported-languages bullet list.

## [1.7.0] — 2026-05-29

### Added

- **Indonesian (id) — first-draft translations.** All 1,793 source
  keys and all 98 regex patterns now have Indonesian translations.
  Glossary locks in place for all 75 terms (plural-collapse forms
  handled as acceptable-alt lists; Latin locks for product-feature
  names and KPI labels per style guide). Marked "pending native
  review" until the Indonesian reviewer signs off.

## [1.6.17] — 2026-05-20

### Added

- **Indonesian (id) language plumbing.** Wiring only — selectable
  from the popup as `Bahasa Indonesia — Indonesian` (🇮🇩), but the
  dashboard falls through to English until translation entries land
  in the next PR. Touches:
  - `_locales/id/messages.json` (Web Store metadata)
  - `popup.js` LANG_FLAGS + FORM_LANG_LABEL
  - `background.js` FORM_LANG_LABEL + MENU_TITLES
  - `validate.py` LANGS array (so glossary enforcement applies
    once entries land)
  - `languages.json` dropdown-label map
  - `style/id.md` new (variant notes, register, vocabulary,
    Latin-for-feature-name rules mirroring the established
    es/pt/tr/zh-TW reviewer patterns)
  - `README.md` language table row (marked "pending native review")
  Translations + glossary locks come in the next PR. Native review
  loop with the Indonesian reviewer (Indonesian QA) starts after that.

## [1.6.16] — 2026-05-20

### Added

- **64 new UI string translations across 8 languages.** Surfaced
  from a ledger pass on entries with 2+ install IDs. Grouped into
  five tiers committed independently for reviewability:
  - **Tier 1** (10 strings): high-volume buttons / sections —
    `Upgrade`, `Apps`, `Outcomes`, `Engagement`, `Lifecycle`,
    `View details`, `Show Last 30 days`, `Show historical data`,
    `Set Up`, `Subscribes`.
  - **Tier 2** (18 strings): specialized UI — journey nodes
    (`Wait Until`, `Split Branch`), filters / buttons (`Send a
    Message`, `Create New Message`, `Preview Segments`, `Show
    Subscribes`, `All Message Types`, `Subscription status changes`),
    add-record buttons (`Add tag` / `phone number` / `email` /
    `alias`), column headers (`Tag actions`, `Last Updated/Sent/
    Created Date`), `Delivery schedule`, `Started sending at`.
  - **Tier 3** (25 strings): body copy, tooltips, empty states,
    form labels — goal-flow UI, push onboarding card, stats labels.
  - **Tier 4** (7 strings): template UI cluster — `Template ID`,
    `Template settings`, `Template statistics`, `Template not used.`,
    `This template was created prior to`, `Messages leveraging
    template`, `Ready to send? Create your first message using
    this template`.
  - **Tier 5** (4 strings): Journeys-page inspirational quotes —
    `The only journey is the one within.`, `Embrace the journey.`,
    `Every journey starts with the first step (and an audience
    segment).`, `Don't stop believing.`

  All glossary locks were honored — the Chilean Spanish reviewer's es Latin-product-feature
  pattern, the pt Template Latin call, the tr (Turkish) reviewer conventions, the HK Traditional Chinese reviewer's
  zh-TW HK-leaning lexicon, plus the Sent (Enviado) / Delivered
  (Entregado) distinction in es/pt. Several first-pass translations
  were adjusted post-validator to comply with locks (Push native
  forms in body copy, Edit-verb variants, Click-through Rate, etc.).

  Three Journey quotes added to `Journey._skip_keys` so the
  colloquial use of 'journey' doesn't trip the feature-noun
  enforcement.

## [1.6.15] — 2026-05-20

### Changed

- **Ledger noise filters expanded.** Five additions to `content.js`'s
  miss-tracking regex battery, targeting high-install entries that
  weren't real UI:
  - Bare `Month Day` chart axis labels (`May 8`, `Apr 28`,
    `January 14`) — Highcharts emits these as x-axis ticks; existing
    chart-date filter required the year.
  - Y-axis magnitude labels (`40.0k`, `1.6M`, `500.0k`, `7.0k`).
  - Chart tooltip `(UTC):` trailing colon — existing tooltip filter
    anchored on `(UTC)$` only.
  - Highcharts accessibility text (`Chart with N data points.`).
  - Claude in Chrome browser-extension overlay (`Claude is active in
    this tab group`, `Open chat`) — not OneSignal UI.

### Added

- **Three Open-X-menu aria-labels** mirroring the existing
  `Close Delivery menu`: `Open Audience menu`, `Open Messages menu`,
  `Open Delivery menu`. Translations in all 8 languages following
  each language's standalone-section vocabulary; tr uses
  `Bildirim Geçmişi` (the Turkish reviewer's rename) for the Delivery family.

## [1.6.14] — 2026-05-20

### Changed

- **Portuguese (BR): `Template` / `Templates` stay Latin.** Per the BR Portuguese reviewer
  (BR reviewer): `Modelo` / `Modelos` reads as a literal translation;
  Brazilian marketers reach for `Template` in SaaS contexts. Same
  Latin-product-feature pattern applied to Spanish (Custom
  Events, Event Stream, Data Feed, Delivery Rate, etc.). Glossary
  locks `Template` and `Templates` to Latin in pt; 35 pt entries
  swept across the Template family. `style/pt.md` updated with the
  rule.

## [1.6.13] — 2026-05-20

### Fixed

- **Spanish: `Event Stream` and `Event Streams` no longer mis-translate
  to `Custom Event` / `Custom Events`.** Two cross-contaminated copy-
  paste errors where the wrong English source key was pasted as the
  Spanish value. Both now read `Event Stream` / `Event Streams` per
  the Latin-product-feature-name reviewer pattern (Journey, Live
  Activity, Custom Events, Data Feed, Delivery Rate, etc.). Also
  aligned `New Event Stream` from `Nuevo flujo de eventos` to
  `Nuevo Event Stream` for family consistency.

### Added

- **`cross_contamination` validator check.** For every non-English
  translation value, if it case-insensitively equals some *other*
  source key, flag it. Catches exactly the kind of copy-paste error
  that produced the Event Stream bug. Initial sweep surfaced 8
  legitimate cross-matches (plural-less loan acronyms, coincidental
  word collisions, Turkish copula structure); those are explicitly
  documented in `SKIP_PAIRS` so future maintainers see the
  rationale.
- **Glossary locks for `Custom Event`, `Custom Events`, `Event Stream`,
  `Event Streams`** — each with `es: <Latin form>` so the Chilean Spanish reviewer's
  Latin-for-product-feature-names rule is enforced by the validator
  rather than relying on convention.

## [1.6.12] — 2026-05-18

### Fixed

- **Chrome Web Store "Red Titanium" rejection — remove base64
  obfuscation of `LEDGER_ENDPOINT`.** The ledger endpoint URL was
  stored as a base64 string decoded via `atob()` at load time. The
  original author's comment was candid: "This is obfuscation, not
  encryption — the value is recoverable by anyone with source
  access." Chrome's policy reviewer flagged it as a violation of
  the "Developers must not obfuscate code or conceal functionality"
  rule. URL now lives as a plain string. Abuse prevention still
  rides on `LEDGER_TOKEN` checked server-side by the Apps Script.

## [1.6.11] — 2026-05-15

### Changed

- **`FORM_LANG_LABEL["zh-TW"]` → `"Traditional Chinese"`** (was
  `"Traditional Chinese (HK)"`). Aligns with the location-neutral
  labeling from 1.6.10. Note: the Google feedback form currently
  has no Traditional Chinese option at all, so pre-fill is a no-op
  either way. Once a `Traditional Chinese` option is added to the
  form, this label will pre-fill the language field as expected.

## [1.6.10] — 2026-05-15

### Changed

- **Traditional Chinese is now location-neutral and recognized by
  the Chrome Web Store.** The popup picker displays the option as
  `繁體中文 — Traditional Chinese` (was `繁體中文 (香港) — Traditional
  Chinese (Hong Kong)`); flag emoji moved from 🇭🇰 to 🇹🇼.
  `_locales/zh_HK/` renamed to `_locales/zh_TW/` (Chrome's official
  i18n list recognizes `zh_TW`, not `zh_HK`) so the Web Store
  package preview now lists Traditional Chinese. Chrome locale
  negotiation falls through `zh_HK → zh_TW → zh → en`, so HK users
  still see the localized metadata.
- **Internal locale code renamed `zh-HK` → `zh-TW` everywhere.**
  1,825 keys in `languages.json` + 68 in `glossary.json`, plus
  every code reference (`popup.js`, `background.js`), the style
  file (`style/zh-HK.md` → `style/zh-TW.md`), and cross-references
  in `README.md` / `STYLE_GUIDE.md` / `style/tr.md` / `style/zh-CN.md`.
  The underlying vocabulary stays HK-leaning (per the HK reviewer's review).
  **Beta testers will need to re-pick Traditional Chinese** — any
  previously saved `language="zh-HK"` in storage falls back to
  English silently after this update (no migration shim shipped).
- **Validator now enforces glossary on Traditional Chinese.**
  `validate.py`'s `LANGS` list was missing `zh-HK` entirely, so
  Traditional Chinese had been silently skipped from glossary
  enforcement since day one. Adding `zh-TW` to `LANGS` surfaced
  3 pre-existing inconsistencies: the `3./4./5. Delivery Schedule`
  entries used `發送排程` (send schedule) while the rest of the
  Delivery family used `送達`. All three corrected to `送達排程`.

### Added

- **`store-listing/zh_TW.md`** — Traditional Chinese Chrome Web
  Store listing (HK-leaning lexicon, structured to match `zh_CN`).

## [1.6.9] — 2026-05-15

### Fixed

- **Eliminate "Cannot create item with duplicate id suggest-translation"
  error.** Three triggers (`onInstalled`, `onStartup`, language change)
  all called `recreateMenu()`; concurrent fires could land a `create()`
  while a previous menu item was still present, and the `create`
  callback never read `chrome.runtime.lastError`, so Chrome flagged it
  as Unchecked in DevTools. Fix: serialize menu operations through a
  Promise chain (only one runs at a time), acknowledge `lastError`
  inside the callbacks, and fall back to `contextMenus.update()` on
  the unlikely surviving duplicate so the menu title still reflects
  the current language. No user-visible change to the right-click
  menu itself — just clean console output.

## [1.6.8] — 2026-05-15

### Changed

- **Turkish (tr) reviewer pass from the Turkish reviewer.** Seven source keys
  updated for natural Turkish UI vocabulary:
  - `Live Activity` / `Live Activities` /
    `Live Activities documentation` — `Aktivite` → `Etkinlik`
    family (glossary + style guide updated).
  - `Set Up Push` button — `Push'u kur` → `Push Bildirim Oluştur`
    (describes the action, not the literal verb).
  - `Dashboard` — `Pano` → `Kontrol Paneli` (standard Turkish for
    enterprise dashboards).
  - `Delivery` menu — `Teslimat` → `Bildirim Geçmişi` (Notification
    History — describes what the page actually shows). Paired
    `Close Delivery menu` aria-label moves with it. Other source
    keys containing "Delivery" still use the `teslim`/`Gönderim`
    family; both deviating keys are added to the glossary's
    `_skip_keys` so the validator allows the override.
  - `Keys & IDs` — `Anahtarlar ve ID'ler` →
    `Anahtarlar ve Kimlik Bilgileri`.

## [1.6.7] — 2026-05-15

### Added

- **MCP onboarding card translated.** Three new source keys covering
  the "Connect OneSignal to your AI tools" promo card surfaced on
  `/apps/:id`: the heading, the `Set up MCP` button, and the body
  copy that lists ChatGPT/Claude/Codex/Cursor. Translations for all
  seven supported languages plus zh-HK, modeled on the existing
  `Manage OneSignal with AI tools` family for consistency.

## [1.6.6] — 2026-05-15

### Changed

- **Spanish: restore Sent/Delivered distinction.** the Chilean Spanish reviewer (Chilean
  reviewer) retracted his earlier "collapse both to Enviado" call
  after we surfaced that OneSignal tracks Sent and Delivered as
  distinct states. Final rule: `Sent` → `Enviado` (we dispatched);
  `Delivered` → `Entregado` (carrier/device confirmed receipt).
  Reverts the 1.6.5 status/KPI changes back to the Entrega/Entregado
  family. Plus one new tidy: the bare `Delivery` source key was
  `Enviados` pre-1.6.5 too (a pre-existing inconsistency); now
  `Entregados` for consistency with the rest of the Delivered
  family. `style/es.md` rewritten with the corrected rule and an
  explicit note not to reintroduce the collapse.

## [1.6.5] — 2026-05-12

### Changed

- **Spanish: standardize delivery-related status labels on `Envío/Enviado`.**
  Per the Chilean Spanish reviewer: in Spanish-language marketing, the
  `Envío/Enviado` family is the KPI standard; `Entrega/Entregado`
  reads as a literal translation that practitioners don't reach for.
  Affected source keys (10): `Delivered`, `Confirmed Delivered`,
  `Delivered Events`, `Show Delivered`, `Show Delivered Events`,
  `Total Delivered`, `Message Event Delivery`, `Deliveries by
  platform`, `Delivery Statistics for All Time`, `Close Delivery
  menu`. The verb `entregar` and body-copy noun `entrega` still
  translate normally — only status / event / KPI labels go to the
  Envío family. **Known collision:** `Sent` and `Delivered` both
  now render as `Enviado` in Spanish (the reviewer call — Spanish
  marketing doesn't distinguish them); flagged in `style/es.md`.
- **Traditional Chinese (zh-HK): finish the Data Feed sweep.** The
  one remaining generic "data sources" reference inside a filter
  helper string now also reads as `資料串流` per the HK Traditional Chinese reviewer — she
  confirmed the source string is referring to the Data Feed product
  feature, not generic upstream data sources.

## [1.6.4] — 2026-05-12

### Changed

- **Traditional Chinese (zh-HK) nav-bar labels match page titles.**
  HK reviewer (the HK Traditional Chinese reviewer) feedback: the terse one-word menu items
  felt unsynced with their descriptive page titles. Standalone
  source keys updated:
  - `Push` → `推送通知` (was `推送`)
  - `In-App` → `應用內訊息` (was `應用內`)
  - `New In-App` → `新應用內訊息` (was `新應用內`)
  - `Users` → `用戶記錄` (was `用戶`)
  - `Subscriptions` → `訂閱記錄` (was `訂閱`)
  - `Test Subscriptions` → `測試訂閱記錄` (was `測試訂閱`)
- **Data Feed (zh-HK) renamed to `資料串流`.** Per the HK Traditional Chinese reviewer, `資料來源`
  (data source) reads as a generic descriptor and doesn't identify
  the product feature. Updated the glossary lock and swept the 9
  source keys that name the feature. The generic phrase "data
  sources" (SDKs, integrations) keeps `資料來源`.

## [1.6.3] — 2026-05-12

### Changed

- **Spanish: lock Delivery-stem KPI/feature labels in Latin.** Native
  Spanish reviewer (Chilean) feedback: `Tasa de entrega` /
  `Entrega inteligente` read as awkward for dashboard KPI and
  feature-name contexts, even though they're literally correct.
  Same pattern already accepted for Journey, Live Activity, Data
  Feed. Affected: `Delivery Rate`, `Intelligent Delivery`,
  `Delivery time`, `Delivery Schedule` (plus its numbered variants).
  The verb `entregar` and the body-copy noun `entrega` still
  translate normally — only feature/KPI labels go Latin.

## [1.6.2] — 2026-05-11

### Changed

- **Ledger: skip UGC-dominated sections by heading.** A new generic
  filter suppresses missed-string reporting inside any section whose
  heading is on a small allowlist — same mental model as the existing
  table Name-column filter, but anchored on section headings rather
  than column headers. Initial entry: "Start from a pre-built design"
  (the create-message template picker, which was flooding the ledger
  with customer-named templates). Adding the next noisy section is
  one line. Translation still runs everywhere.

## [1.6.1] — 2026-05-11

### Changed

- **Spanish: keep product feature names in Latin form.** Native
  Spanish reviewer feedback: the prior translations of several
  feature names read as awkward in their market — marketers
  reach for the English forms by default. Treat the affected
  Spanish renderings as bad translations rather than accepted
  alts: glossary `es` is now Latin-only (no native fallback),
  and `languages.json` is swept to match. Affected features:
  - `Journey` / `Journeys` (was `Recorrido` / `Recorridos`)
  - `Live Activity` / `Live Activities` (was `Actividad en vivo`
    / `Actividades en vivo`)
  - `Data Feed` / `Data Feeds` (was `Fuente de datos` /
    `Fuentes de datos`)
  - `Custom Event` / `Custom Events` (was `Evento personalizado` /
    `Eventos personalizados`) — not in the glossary, swept via
    bulk rewrite of all `es` values
  Generic uses of "data sources" (lowercase, not the feature) keep
  `fuentes de datos` — confirmed source-by-source.
- **Three targeted source-key overrides** in `es`:
  - `Delivery` (left-hand nav): `Entrega` → `Enviados`. Other
    `Delivery`-stem strings ("Delivery Rate", "Intelligent
    Delivery", etc.) keep the `Entrega/entrega` rendering — that
    one's natural for those contexts. `Enviados` added as an
    accepted alt under the `Delivery` glossary so the one-off
    override doesn't trip the lock.
  - `Event Stream` / `Event Streams`: `Flujo(s) de eventos` →
    `Custom Event` / `Custom Events`.
  - `Engagement trends`: `Tendencias de participación` →
    `Tendencias de Engagement`.

## [1.6.0] — 2026-05-11

### Added

- **Per-install ID for ledger deduplication.** A randomly generated
  UUID is now stored in `chrome.storage.local` (deliberately not
  `.sync`) and sent with each opt-in ledger flush. Lets the
  receiving Apps Script count *distinct browser installs* that have
  encountered an untranslated string — a much stronger signal than
  raw instance counts, which a single busy browser can dominate.
  Generated lazily on first flush; reinstalling the extension
  regenerates it. Contains no information about the user. See
  [`PRIVACY.md`](./PRIVACY.md).
- **UI-context hints on each ledger entry**: a `role` field
  (`button`, `heading`, `cell`, `status`, `label`, `tooltip`,
  `placeholder`, `option`, `menuitem`, or `other`) and a `classChain`
  field (up to three ancestor styled-component class names from
  OneSignal's own front-end, e.g. `Modal__Container>Modal__Title>h2`).
  Lets the maintainer locate a missed string in the dashboard much
  faster, and disambiguates same-source-different-role rows (e.g.
  "Save" the button vs "Save" the heading). Both fields are
  best-effort — `role` defaults to `"other"` when no signal is clear,
  `classChain` is empty when no styled-component class is found
  within 3 ancestors. Contain no user data.

### Changed

- **Ledger payload version 1 → 2.** Wire envelope is now
  `{ version: 2, token, installId, entries: [...] }` (was
  `{ version: 1, token, entries: [...] }`). Each entry now carries
  `role` and `classChain` in addition to the existing `lang`,
  `path`, `string`, `count`.
- **Local ledger storage shape**. Entries in `chrome.storage.local`
  under the `ledger` key now store
  `{ count, role, classChain }` per key (previously a bare number).
  Pre-1.6 entries with the bare-number shape are still readable and
  get migrated to the object shape on next write.

## [1.5.7] — 2026-05-07

### Fixed

- **Web Store description length.** The English `extDescription`
  was 143 chars (Chrome Web Store cap is 132), blocking package
  upload. Shortened to 131 chars while still naming all 8 supported
  languages — Chinese variants now collapse into one phrase
  (`Chinese (Simplified/Traditional)`) instead of two separate
  list items.

## [1.5.6] — 2026-05-07

### Added

- **16 translations** for the audit-log table (`IP Address`,
  `Item Type`, `Member Added to App`, `Subscription`, `Subscription
  Updated`, `User Action`) and the new-Data-Feed creation form
  (`Alias`, `Customer Cart`, `Data Feed Name`, `Example:`, `GET`,
  `Learn more about Liquid syntax`, `URL supports Liquid syntax
  such as`, plus three longer help-text strings).
- `GET` joins `POST` as Latin in every language (HTTP method).

## [1.5.5] — 2026-05-07

### Fixed

- **Name-column header matching is now case-insensitive.** Same
  column renders as `Item Name` in some tables and `Item name` in
  others — previously each casing required its own entry. Both the
  source-list set and the per-table header probe now lowercase
  before comparing, so a single entry covers all casings. `Item Name`
  in the source list is renamed to `Item name` for readability;
  behavior is unchanged for every other entry.

### Added

- **8 audit-log event translations** (the activity badges and entity-
  type column on the team/audit screen): `Notification Created`,
  `In-App Message Created`, `In-App Message Updated`, `Segment
  Updated`, `Segment Deleted`, `User Updated`, plus the standalone
  entity-type values `In-App Message` and `User`. `Notification
  Created` was the only `Created` variant missing — `Segment
  Created` and `Journey Updated` already existed and continue to
  render correctly.

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
- **Cohort-sync filter rows** (Mixpanel / Segment.com / Amplitude)
  now also flagged via the value-picker filter, using the sibling
  `FilterForm__FilterTitle` text as the signal. Catches both the
  portaled listbox options AND the `css-1dimb5e-singleValue`
  display showing the currently-selected cohort name. Same helper
  (`isInUgcValuePicker`); the new path runs when `closest()` from
  the input lands inside a `[class*='FilterForm__Filter-']` row.
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
- **4 more identifier-column headers** added to the Name-column
  ledger filter: `External ID`, `Email`, `Tags`, `Event name`. Cells
  in those columns are dominated by user-defined values (subscription
  IDs, addresses, tag values, custom event names), so the matching
  cells are now suppressed from the missed-string ledger. Translation
  still runs through them.
- **`Destination URL`, `Item Name`, `Key ID`** added to the
  Name-column ledger filter (URLs, item names, and access-key IDs
  are user-defined).
- **10 more translations** for the team / settings screens:
  `2-Step Authentication`, `Access Restricted`, `Composer`,
  `Email & Password`, `Enterprise SSO`, `Facebook`, `GitHub`,
  `Google` (brands kept Latin), `Previous Period:`,
  `Are you sure that you want to disable "` (confirmation-prompt
  prefix; name gets injected after the trailing opening quote).
- **5 more translations**:
  - `CDP` — industry acronym (Customer Data Platform), Latin in
    every language to match the API/SDK pattern.
  - `We couldn't find any results` — generic empty-state copy.
  - Long descriptive paragraphs for the test-domain warning, the
    Double Opt-In feature, and the Re-Subscribe keywords feature
    (shown on the Subscriptions / Email config screens). Industry
    feature names (`Double Opt-In` / `Double Opt In`) kept Latin
    in all languages.
- **5 more translations**: `Live Activities Push-to-Start`,
  `Live Activities Push-to-Update` (Apple compound terms — kept
  Latin and exempted from the `Push` / `Update` glossary locks via
  `_skip_keys`), `Sent At`, `Test`, `dashboard`.
- **89 more translations** from a second feedback batch:
  - **40 language names** (Arabic through Vietnamese, plus English,
    Chinese (Simplified), Chinese (Traditional)) — translated to each
    target language's standard exonym; brand-style names like
    `Hindi` / `Punjabi` keep their conventional forms per language.
  - **Time-relative filter operators**: `days ago`, `minutes ago`,
    `weeks ago`.
  - **Comparison operators**: `equals to`, `not equals to`,
    `greater than or equal to`, `less than or equal to`, `is True`,
    `is False`, `is true`, `is within`.
  - **Channel selectors**: `Any SMS`, `Any email`, `Any in-app
    message`, `Any push notification`, `Web Push (All Browsers)`,
    `Chrome Extension`, plus brand-name targets `Alexa`, `Huawei`,
    `Windows Phone 8.0` (Latin in all langs).
  - **Audience / report UI**: `Audience Report`, `Channel Breakdown`,
    `Calculating...`, `subscribed records`, `subscribed records for
    this filter.`, `unsubscribed`, `sessions`, `Add Property`.
  - **Geo / event filter UI**: `Latitude (ex: 18.344)`, `Longitude
    (ex: -66.753)`, `Radius`, `latitude`, `longitude`, `meters`,
    `is within`, `Type and select event`, `Select a channel...`,
    `Missing property and value`, `Nested event properties can be
    referenced using dot notation. Example:`, `Booleans`, `Numbers`,
    `Strings`, `property`, `of the following properties:`, `With`,
    `all`, `and`, `. Learn more at`, `Custom Event Filters
    documentation`.
- **25 new translations** from feedback batch:
  - Filter operators: `does not exist`, `time elapsed greater than`,
    `time elapsed less than`
  - Cohort-sync section: `Cohorts you have synced with Amplitude`
    / `Mixpanel` / `Segment.com`, plus the brand names themselves
    (`Amplitude`, `Mixpanel`, `Segment.com` — recorded as Latin in
    every language so the validator marks them informational, not
    untranslated). `Segment.com` is added to the `Segment` glossary
    `_skip_keys` to distinguish from the OneSignal Segment feature.
  - Filter-builder UI: `And Filter`, `Manually type in (exact match)
    or select tags pulled from your test users`
  - Webhook-config UI: `Authorization`, `Content-Type`, `POST`
    (HTTP protocol tokens — Latin), `Headers`, `Body`, `Custom Body`,
    `Add Header`, `Remove entry`, `key`, `value`, `Configure`,
    `Edit Journey Webhook`, `Webhook Documentation`, `Webhook Name`

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
