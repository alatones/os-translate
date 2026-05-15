# Traditional Chinese (zh-TW) Style Addendum

## Variant

- **Traditional Chinese, HK-leaning lexicon** (locale code `zh-TW`,
  language label 繁體中文).
- We ship under Chrome's `zh_TW` locale code (it's the one the Web
  Store recognizes) but the underlying vocabulary in this file is
  **HK-flavoured Traditional Chinese**, as reviewed by Jessie Koh.
  HK and TW share the same Traditional character set but differ in
  lexicon and idiom — where they conflict, we use the HK form. Most
  TC readers (HK, TW, overseas) understand both; the HK form is
  what was reviewed and signed off.
- **Distinct from** both Simplified Chinese (zh-CN, mainland China)
  and pure Taiwan TC where the lexicon diverges.
- **Register: 書面語 (formal written Chinese), not 粵語白話文
  (colloquial Cantonese).** B2B SaaS dashboards in HK use formal written
  Chinese — same syntax as standard Mandarin, written in Traditional
  characters with HK lexicon. Colloquial Cantonese particles
  (`嘅 / 喺 / 咗 / 嗰 / 唔 / 係`) are inappropriate here. Reserve those
  for consumer/social products where casual tone fits.

## Register and address

- **Drop pronouns when possible.** Chinese is pro-drop — most B2B SaaS
  UI labels and prose work fine without "you/your" stated.
- When a pronoun is required, use **您** (formal you), never **你**
  (informal). Same convention as zh-CN — Microsoft HK, Apple HK,
  Stripe 繁中 all use 您 in their interfaces.
- Imperative form: bare verb, no pronoun. `儲存`, `刪除`, `發送`,
  `建立`.
- For instructional prose: `請...` (please) is acceptable but optional;
  most HK SaaS dashboards use bare imperative.

## Buttons: bare verb form

- Buttons use the bare verb: `儲存` (Save), `發送` (Send), `刪除`
  (Delete), `建立` (Create). 2-character verb is the Chinese SaaS
  norm.
- Status badges use perfective `已 + verb` form: `已發送` (Sent),
  `已送達` (Delivered), `已點擊` (Clicked).

## Punctuation

- **Use full-width Chinese punctuation (`。 ， ：`) for prose ending
  in Chinese characters.** Standard CJK typography.
- Use **ASCII straight quotes** (`'` and `"`) in translation values.
  Chinese guillemets `「」` `『』` are typographically correct but
  fiddly in software UIs and inconsistent across the source.
- For form labels and short button text: no terminal punctuation
  (matches source).
- When source has a colon, use full-width `：` not ASCII `:` if the
  text is otherwise Chinese.
- Numbers stay Arabic (`123`), not Chinese numerals (`一二三`).
  Decimal point: `.` (not `。`).
- Percent: `%` after the number (`50%`).

## Brand and feature names

- Latin script for brands and acronyms: `OneSignal`, `Apple`, `Twilio`,
  `HubSpot`, `Mixpanel`, `Amplitude`, `Segment`, `Snowflake`, `BigQuery`,
  `Webhook`, `Push`, `SMS`, `RCS`, `In-App`, `Live Activity`, `Journey`,
  `Journeys`. HK readers are accustomed to inline Latin in tech
  contexts.
- `Email` stays Latin (with `電郵` and `電子郵件` as alts). `電郵` is
  the natural HK shorthand; `電子郵件` is more formal.
- `App` stays Latin or `應用` (loanword). Both widely used in HK.
- Acronyms always Latin: `API`, `SDK`, `CSV`, `URL`, `HTML`, `CTR`.

## Nav-bar labels: match the page title

Menu bar items should read the same as the page they open. Per HK
reviewer (Jessie Koh) feedback, terse one-word menu labels like
`推送` (Push) or `應用內` (In-App) felt unsynced with their
descriptive page titles. Use the fuller forms in standalone nav
contexts:

| Source           | Use (zh-TW)   | Don't use   |
| ---------------- | ------------- | ----------- |
| `Push`           | `推送通知`     | `推送`       |
| `In-App`         | `應用內訊息`   | `應用內`     |
| `New In-App`     | `新應用內訊息` | `新應用內`   |
| `Users`          | `用戶記錄`     | `用戶`       |
| `Subscriptions`  | `訂閱記錄`     | `訂閱`       |
| `Test Subscriptions` | `測試訂閱記錄` | `測試訂閱` |

These changes are on the standalone source keys only — compound
phrases that reuse "Push" / "In-App" / etc. keep their own
translations and aren't affected.

## Product feature terms

- `Data Feed` / `Data Feeds` → `資料串流` (data stream), not
  `資料來源` (data source). Per HK reviewer: `資料來源` reads as a
  generic descriptor and doesn't identify the product feature.
  `資料來源` is still correct when literally referring to upstream
  data sources (SDKs, integrations, etc.) — not the OneSignal Data
  Feed feature.

## Length

- Button labels: target ≤ 6 characters. Soft cap 8.
- Status badges: target ≤ 5 characters.
- Traditional Chinese is roughly the same length as Simplified — much
  shorter than English. UIs designed for English have plenty of room.

## HK-vs-CN-vs-TW vocabulary

Although we ship under the locale code `zh-TW`, the lexicon below is
HK-leaning per Jessie's review. HK and TW share Traditional characters
but differ in lexicon and idiom; HK lexicon also often overlaps with
CN (mainland) where TW diverges. Pick HK conventions wherever they
exist, falling back to widely-understood Traditional Chinese. Columns
labeled "TW (don't use)" reference *Taiwan-specific* TC variants —
the things to avoid because they sound too regional.

| English        | Use (HK form)  | zh-CN (don't use)  | TW-only (don't use) |
| -------------- | -------------- | ------------------ | ------------------- |
| Save           | 儲存           | 保存               | 儲存                |
| Settings       | 設定           | 设置               | 設定                |
| Search         | 搜尋           | 搜索               | 搜尋                |
| Send           | 發送           | 发送               | 傳送                |
| Edit           | 編輯           | 编辑               | 編輯                |
| User           | 用戶           | 用户               | 使用者              |
| Create         | 建立           | 创建               | 建立                |
| Add            | 新增           | 添加               | 新增                |
| Login          | 登入           | 登录               | 登入                |
| Default        | 預設           | 默认               | 預設                |
| File           | 檔案           | 文件               | 檔案                |
| Software       | 軟件           | 软件               | 軟體                |
| Data           | 資料           | 数据               | 資料                |
| Database       | 資料庫         | 数据库             | 資料庫              |
| Folder         | 資料夾         | 文件夹             | 資料夾              |
| Email          | 電郵 / Email   | 邮件 / Email       | 電子郵件 / E-mail   |
| Import         | 匯入           | 导入               | 匯入                |
| Export         | 匯出           | 导出               | 匯出                |
| Click          | 點擊           | 点击               | 點擊                |
| Open Rate      | 開啟率         | 打开率             | 開啟率              |
| Audience       | 受眾           | 受众               | 受眾                |
| Loading…       | 載入中…        | 加载中…            | 載入中…             |

## Conventions

- "Save" → `儲存`. Never `保存` (CN form).
- "Delete" → `刪除` (Traditional). Never `删除` (Simplified).
- "Edit" → `編輯` (Traditional). Never `编辑` (Simplified).
- "Settings" → `設定`. Never `設置` (TW alt) or `设置` (CN).
- "Search" → `搜尋`. Never `搜索` (CN).
- "Send" → `發送`. Never `传送` (CN simplified) or `傳送` (TW
  preferred). HK usage allows both 發送 and 傳送; pick 發送 for the
  message-dispatch sense.
- "Filter" → `篩選` (verb) / `篩選條件` (the filter condition itself).
- "Manage" → `管理`.
- "User" → `用戶` (Traditional). Never `用户` (Simplified) or
  `使用者` (TW).
- "Login" → `登入`. Never `登录` (CN).
- "Notification" → `通知`.
- "Subscriber" → `訂閱者`.
- "Audience" → `受眾`.
- "Campaign" → `營銷活動` (HK marketing term) or `活動` in compounds.
- Rate metrics use `率` suffix: `開啟率` (open rate), `點擊率`
  (click rate), `送達率` (delivery rate), `轉換率` (conversion rate).

## No pluralization

- Chinese nouns don't pluralize. `5 messages` → `5 條訊息` (with
  measure word `條`). For UI dictionary entries where the same
  source says "Subscribers" plural, the translation is just `訂閱者`
  — no plural marker.
- Measure words (`條 個 項 位`) appear in patterns where a quantity
  is given.

## Examples

| English (role)              | ✓ Right                  | ✗ Wrong                          |
| --------------------------- | ------------------------ | -------------------------------- |
| Send (button)               | 發送                     | 发送 (Simplified)                |
| Save changes (button)       | 儲存變更                 | 保存更改 (CN); 儲存變更 OK       |
| Create Segment (button)     | 建立 Segment             | 创建 Segment (Simplified)        |
| Are you sure? (dialog)      | 確定要繼續嗎？           | 你確定嗎？ (informal pronoun)    |
| Sent (status)               | 已發送                   | 發送 (no perfective marker)      |
| Failed (status)             | 失敗                     | 失败 (Simplified)                |
| Loading… (spinner)          | 載入中…                  | 加載中… (CN)                     |
| Settings (nav)              | 設定                     | 设置 / 設置                      |
| Search (button)             | 搜尋                     | 搜索 (CN)                        |

## Things to watch

- Don't use `你` (informal you). Always `您` if a pronoun is needed.
  Most of the time, drop the pronoun entirely.
- Don't mix Simplified and Traditional characters. Some near-
  duplicates that trip people up: `編輯/编辑`, `軟件/软件`,
  `設定/设置`, `登入/登录`, `刪除/删除`. Use the Traditional form
  throughout.
- Don't use Cantonese colloquial particles (`嘅 喺 咗 嗰 唔 係`)
  unless the source is genuinely casual consumer copy. This dashboard
  is B2B and uses 書面語.
- Word order: same as Mandarin/zh-CN — SVO with modifiers BEFORE
  the noun.
- Preserve placeholders (`{1}`, `{{var}}`, `%s`) unchanged.
- Acronyms stay Latin: `API`, `SDK`, `CSV`, `URL`, `HTML`, `CTR`.
- Number-noun phrases use measure words: `3 個 Segment`, `5 條訊息`,
  `2 位用戶`. Patterns enforce this.
- Spacing: insert a single space between Chinese characters and
  Latin/numeric content (`5 個用戶`, `OneSignal 應用`). Standard
  typographic convention for tech writing.
