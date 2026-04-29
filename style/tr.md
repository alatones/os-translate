# Turkish (tr) Style Addendum

## Variant

- **Standard Turkish** (Istanbul Turkish / Türkiye Türkçesi).
- The dashboard targets Turkish-speaking marketers in Türkiye and
  the diaspora. No Cypriot or other regional variants needed.

## Register and address

- **Siz** (formal you) for direct address. Always. Never sen.
  This is the Turkish B2B SaaS default — Stripe TR localizations,
  Trendyol, Hepsiburada, Iyzico, and all major Turkish enterprise
  software use siz.
- Verb conjugation follows: `Yapabilirsiniz`, `Lütfen ... tıklayın`.
- Imperative form: `Tıklayın` (formal plural), not `Tıkla` (informal).

## Buttons: 2nd-person imperative form

- Buttons use the bare verb root, which is also the 2nd-person
  singular imperative in Turkish (`Kaydet`, `Gönder`, `Sil`,
  `Oluştur`). This is standard Turkish SaaS button convention —
  matches what Trendyol, Iyzico, Marketing Suite all use.
- Same for primary CTAs across the dashboard.
- Status badges use past-tense passive (`Gönderildi`, `Teslim
  edildi`).
- For longer button phrases with formal address (sentence-level
  CTAs), use formal imperative: `Lütfen tıklayın`, `Devam edin`.

## Punctuation

- Standard Latin punctuation. No special opening marks like
  Spanish or NBSP rules like French.
- Use ASCII straight quotes (`'` and `"`) in translation values.
  Turkish guillemets «...» are rare; only when source uses them.
- Sentence endings match source: period when source has period,
  no terminal punctuation when source has none.

## Turkish-specific characters

- Use the correct dotted/dotless i: `i / İ` (dotted) vs
  `ı / I` (dotless). These are different letters with different
  meanings.
- Other Turkish characters: `ç`, `ğ`, `ö`, `ş`, `ü`. Use them
  where standard Turkish requires.
- `İstanbul` (capital İ), `iyzico` (lowercase i — proper noun stays).

## Capitalization

- Days of the week are **lowercase**: pazartesi, salı, çarşamba,
  perşembe, cuma, cumartesi, pazar. This is Turkish typographic
  standard.
- Months are **lowercase**: ocak, şubat, mart, nisan, mayıs,
  haziran, temmuz, ağustos, eylül, ekim, kasım, aralık.
- Language names are **lowercase**: türkçe, ingilizce, fransızca.
- Proper nouns and brand names keep their original casing.
- First letter of UI labels capitalized (English convention works
  for Turkish too in product context).

## Vowel harmony and suffix attachment

- Turkish is agglutinative — suffixes attach to noun and verb
  roots. The glossary locks the root form; conjugated forms
  substring-match the root automatically (no alts needed for
  most cases).
  - `bildirim` (notification) matches `bildirimler`,
    `bildirimini`, `bildirimleriniz`, etc.
  - `gönder` (send) matches `gönderildi`, `gönderir`,
    `göndermek`, etc.
- Where the root mutates (consonant softening: p→b, t→d, k→ğ),
  add explicit alts. Rare in our terminology.

## Brand and feature names

- Latin script always (Turkish uses Latin alphabet, so this is
  natural).
- `OneSignal`, `Apple`, `Twilio`, `HubSpot`, `Mixpanel`, `Amplitude`,
  `Segment`, `Snowflake`, `BigQuery`, `Webhook`, `Email`, `Push`,
  `SMS`, `RCS` — all stay Latin.
- "Segment" — when OneSignal feature, locked as `Segment` (cognate
  in Turkish marketing tech). When Twilio company, also Latin.
- `Email` — `E-posta` is the formal Turkish but `Email` is widely
  used in Turkish SaaS tech. Lock as `Email` with `E-posta` alt.
- `Webhook` stays Latin.

## Length

- Button labels: target ≤ 14 characters. Soft cap 18.
- Status badges: target ≤ 12 characters.
- Turkish is roughly the same length as English (slightly longer
  due to suffix piling). Plan layout accordingly.

## Conventions

- "Save" → `Kaydet` (verb root / 2nd-sing imperative). Never
  `Saklamak` (means hide/keep).
- "Delete" → `Sil`. Never `Yok et` (means destroy).
- "Settings" → `Ayarlar`. Never `Konfigürasyon` (technically
  correct but reads borrowed; `Ayarlar` is universal in Turkish
  UI).
- "Search" → `Ara` (verb) / `Arama` (noun).
- "Filter" → `Filtrele` (verb) / `Filtre` (noun).
- "Send" → `Gönder`. Never `Yolla` (informal).
- "Manage" → `Yönet` (verb) / `Yönetim` (noun).
- Rate metrics: `oranı` suffix (`Açılma oranı` open rate,
  `Tıklama oranı` click rate, `Teslim oranı` delivery rate).
- Compound nouns use possessive structure: `Mesajın gönderim
  zamanı` (the message's send time), not `Mesaj gönderim zamanı`.
- Plurals use `-lar / -ler` (vowel harmony): segmentler,
  abonelikler, mesajlar.

## Examples

| English (role)              | ✓ Right                       | ✗ Wrong                            |
| --------------------------- | ----------------------------- | ---------------------------------- |
| Send (button)               | Gönder                        | Yolla (informal); Göndermek (infinitive) |
| Save changes (button)       | Değişiklikleri kaydet         | Kaydetmek değişiklikleri (word order) |
| Create Segment (button)     | Segment oluştur               | Segmenti oluştur (def. article)    |
| Are you sure? (dialog)      | Emin misiniz?                 | Emin misin? (informal sen form)    |
| Sent (status)               | Gönderildi                    | Gönderdi (active past, wrong sense) |
| Failed (status)             | Başarısız                     | Hatalı (errored, narrower meaning) |
| Loading… (spinner)          | Yükleniyor…                   | Yüklüyor (transitive, wrong)       |
| Settings (nav)              | Ayarlar                       | Konfigürasyon (loanword)           |
| Search (button)             | Ara                           | Aramak (infinitive)                |

## Things to watch

- Don't use `sen` (informal you). Always `siz` for B2B SaaS.
- Don't conflate `i / ı` — they're different letters. `Ayarlar`
  not `Ayarlır`, `bildirim` not `bıldırım`.
- Word order: Turkish is SOV (subject-object-verb). Translations
  may reorder compared to English/French/Spanish.
- Plural agreement: when a number is given, the noun stays
  singular: `5 mesaj` (5 messages), not `5 mesajlar`. Turkish
  doesn't pluralize after numerals.
- Preserve placeholders (`{1}`, `{{var}}`, `%s`) unchanged.
- Acronyms stay Latin: `API`, `SDK`, `CSV`, `URL`, `HTML`, `CTR`.
