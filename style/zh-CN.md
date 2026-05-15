# Simplified Chinese (zh-CN) Style Addendum

## Variant

- **Simplified Chinese, Mainland convention** (zh-CN /
  简体中文 / 大陆). Not Traditional Chinese (zh-TW) which uses
  different characters and a different lexicon.
- The dashboard targets marketers in Mainland China and Simplified-
  reading users in Singapore/Malaysia. Don't use Taiwan/HK lexicon
  (e.g. `登入` instead of Mainland `登录`, `軟體` instead of Mainland
  `软件`).

## Register and address

- **Drop pronouns when possible.** Chinese is pro-drop — most B2B SaaS
  UI labels and prose work fine without "you/your" stated. This is
  the most natural Chinese.
- When a pronoun is required, use **您** (formal you), never **你**
  (informal). This is the B2B SaaS default — Tencent Cloud, Alibaba
  Cloud, Notion 中文, GitHub 中文, Stripe 中文 all use 您 in their
  Chinese interfaces.
- Imperative form: just the bare verb, no pronoun. `保存`, `删除`,
  `发送`, `创建`.
- For instructional prose: `请...` (please) is acceptable but optional;
  most Chinese SaaS dashboards use bare imperative.

## Buttons: bare verb form

- Buttons use the bare verb: `保存` (Save), `发送` (Send), `删除`
  (Delete), `创建` (Create). 2-character verb is the Chinese SaaS
  norm.
- Status badges use perfective `已 + verb` form: `已发送` (Sent),
  `已送达` (Delivered), `已点击` (Clicked).

## Punctuation

- **Use full-width Chinese punctuation (`。 ， ：`) for prose ending
  in Chinese characters.** This is standard CJK typography.
- Use **ASCII straight quotes** (`'` and `"`) in translation values.
  Chinese guillemets `「」` `『』` are typographically more correct but
  fiddly in software UIs and inconsistent across the source.
- For form labels and short button text: no terminal punctuation
  (matches source).
- When source has a colon, use full-width `：` not ASCII `:` if the
  text is otherwise Chinese.
- Numbers stay Arabic (`123`), not Chinese numerals (`一二三`).
  Decimal point: `.` (not `。`).
- Percent: `%` after the number (`50%`), not before like Turkish.

## Brand and feature names

- Latin script for brands and acronyms: `OneSignal`, `Apple`, `Twilio`,
  `HubSpot`, `Mixpanel`, `Amplitude`, `Segment`, `Snowflake`, `BigQuery`,
  `Webhook`, `Push`, `SMS`, `RCS`, `In-App`, `Live Activity`, `Journey`,
  `Journeys`. Chinese readers are accustomed to inline Latin in tech
  contexts.
- `Email` stays Latin (with `邮件` as an alt). `电子邮件` is more
  formal but reads as bureaucratic; `邮件` is the natural body-prose
  word; `Email` is what nav/feature labels use.
- `App` stays Latin or `应用` (loanword). Both are widely used.
- Acronyms always Latin: `API`, `SDK`, `CSV`, `URL`, `HTML`, `CTR`.

## Length

- Button labels: target ≤ 6 characters. Soft cap 8.
- Status badges: target ≤ 5 characters.
- Chinese is roughly 50–60% as long as English; expect translations
  to be much shorter than source. This is fine — UIs designed for
  English will have plenty of room.

## Conventions

- "Save" → `保存`. Never `储存` (Taiwan), `保留` (preserve, wrong
  sense).
- "Delete" → `删除`. Never `刪除` (Traditional character).
- "Edit" → `编辑`.
- "Settings" → `设置`. Never `設定` (Taiwan/HK form).
- "Search" → `搜索`. Never `搜尋` (Taiwan/HK).
- "Send" → `发送`. Never `傳送` (Taiwan).
- "Filter" → `筛选` (verb) / `筛选条件` (the filter condition itself).
- "Manage" → `管理`.
- "User" → `用户`. Never `用戶` (Traditional).
- "Login" → `登录`. Never `登入` (Taiwan).
- "Software" → `软件`. Never `軟體` (Taiwan).
- "Notification" → `通知`.
- "Subscriber" → `订阅者`. Plural same form (Chinese doesn't
  pluralize nouns).
- "Audience" → `受众`. The marketing-tech term.
- "Campaign" → `营销活动` (the term most precisely matches the
  marketing concept) or `活动` in compounds.
- Rate metrics use `率` suffix: `打开率` (open rate), `点击率`
  (click rate), `送达率` (delivery rate), `转化率` (conversion rate).

## No pluralization

- Chinese nouns don't pluralize. `5 messages` → `5 条消息` (with
  measure word `条`). For UI dictionary entries where the same
  source says "Subscribers" plural, the translation is just `订阅者`
  — no plural marker.
- Measure words (`条 个 项 位`) appear in patterns where a quantity
  is given.

## Examples

| English (role)              | ✓ Right                  | ✗ Wrong                          |
| --------------------------- | ------------------------ | -------------------------------- |
| Send (button)               | 发送                     | 傳送 (Traditional); 发出 (off)    |
| Save changes (button)       | 保存更改                 | 儲存變更 (Traditional)            |
| Create Segment (button)     | 创建 Segment             | 建立 Segment (Taiwan verb)        |
| Are you sure? (dialog)      | 确定要继续吗？            | 你确定吗？ (informal pronoun)     |
| Sent (status)               | 已发送                   | 发送 (no perfective marker)       |
| Failed (status)             | 失败                     | 錯誤 (Traditional)                |
| Loading… (spinner)          | 加载中…                  | 載入中… (Taiwan)                  |
| Settings (nav)              | 设置                     | 設定 / 設置 (Traditional)         |
| Search (button)             | 搜索                     | 搜尋 (Taiwan)                     |

## Things to watch

- Don't use `你` (informal you). Always `您` if a pronoun is needed.
  Most of the time, drop the pronoun entirely.
- Don't mix Simplified and Traditional characters. Some near-
  duplicates: `编辑/編輯`, `软件/軟體`, `设置/設定`, `登录/登入`. Use
  the Simplified form throughout.
- Word order: Chinese is SVO. Translations may reorder modifiers
  (Chinese puts modifiers BEFORE the noun: `用户名` = "user-name",
  not "name-of-user").
- Preserve placeholders (`{1}`, `{{var}}`, `%s`) unchanged.
- Acronyms stay Latin: `API`, `SDK`, `CSV`, `URL`, `HTML`, `CTR`.
- Number-noun phrases use measure words: `3 个 Segment`, `5 条消息`,
  `2 位用户`. Patterns enforce this.
- Spacing: insert a single space between Chinese characters and
  Latin/numeric content (`5 个用户`, `OneSignal 应用`). This is the
  Mainland typographic standard for tech writing.
