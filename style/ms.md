# Malay (ms) Style Addendum

## Variant

- **Standard Bahasa Melayu** (Dewan Bahasa dan Pustaka / DBP
  orthography). Latin script, no diacritics.
- The dashboard targets Malaysian-speaking marketers and product
  teams. Malay is also spoken in Brunei and Singapore — those
  variants share the orthography and are mutually intelligible with
  Malaysian standard. We ship under bare `ms` (not `ms_MY`) for
  broadest coverage.
- Malay and Indonesian are mutually intelligible to a degree but
  the vocabulary, phrasing, and local usage differ — treat them as
  fully separate translations. Where the natural Malay word
  diverges from Indonesian, use the Malay form (e.g. `Padam` for
  Delete in `ms`, vs `Hapus` in `id`).

## Register and address

- **Anda** (formal you, always capitalized) for direct address.
  Same as Indonesian — Malaysian B2B SaaS default, used by Maybank,
  Grab, Shopee MY, AirAsia, and major Malaysian enterprise
  platforms.
- Never use `kau` or `engkau` (informal/literary) or drop the
  pronoun in instructional copy.
- Verb conjugation is invariant by person in Malay (same as id),
  so register is carried by the pronoun choice.
- Imperative form for CTAs: bare verb (`Cipta`, `Simpan`, `Hantar`)
  or `Klik`-style direct command. Same shape as English's bare-verb
  buttons.

## Buttons: bare verb form

- Buttons use the bare verb (`Cipta`, `Simpan`, `Padam`, `Hantar`,
  `Sunting`). This matches the Malaysian SaaS convention.
- Same form whether the source is `Save` or `Save changes` — the
  Malay button reads as the verb only.
- Status badges use past/perfective forms (`Dihantar` = Sent,
  `Berjaya` = Succeeded, `Gagal` = Failed).

## Punctuation

- Standard Latin punctuation. No special opening marks.
- Use ASCII straight quotes (`'` and `"`) in translation values.
- Sentence endings match the English source — period if source has
  period, no terminal punctuation if source has none.
- Malay decimal separator is `.` and thousands separator is `,` in
  formal Malaysian contexts (`RM 1,000,000.00`) — opposite of
  Indonesian. For numbers in UI labels, follow whatever the source
  uses — usually Western format.

## Capitalization

- Days of the week are **capitalized** in Malay: `Isnin, Selasa,
  Rabu, Khamis, Jumaat, Sabtu, Ahad`.
- Months are **capitalized**: `Januari, Februari, Mac, April, Mei,
  Jun, Julai, Ogos, September, Oktober, November, Disember`.
- Headings use Sentence case (only first word capitalized) unless
  the source uses Title Case for a brand-style heading — in which
  case mirror it.
- Status labels: Sentence case (`Aktif`, `Tidak aktif`, `Berjaya`).

## Vocabulary — key divergences from Indonesian

The biggest single source of ms-vs-id translation errors is reaching
for the Indonesian word. The table below catalogs the most common
divergences in dashboard UI:

| English        | Malay (ms)       | Indonesian (id) — don't use |
| -------------- | ---------------- | --------------------------- |
| Save           | Simpan           | Simpan (same)               |
| Delete         | Padam            | Hapus                       |
| Settings       | Tetapan          | Pengaturan                  |
| Search         | Cari             | Cari (same)                 |
| Send           | Hantar           | Kirim                       |
| Edit           | Sunting / Edit   | Edit                        |
| Create         | Cipta / Buat     | Buat                        |
| File           | Fail             | Berkas                      |
| Add            | Tambah           | Tambah (same)               |
| Cancel         | Batal            | Batal (same)                |
| View           | Lihat            | Lihat (same)                |
| Update         | Kemas kini       | Perbarui                    |
| Done/Finished  | Selesai          | Selesai (same)              |
| Continue       | Teruskan         | Lanjutkan                   |
| Back           | Kembali          | Kembali (same)              |
| Refresh        | Muat semula      | Muat ulang                  |
| Reload         | Muatkan semula   | Muat ulang                  |
| Yes / No       | Ya / Tidak       | Ya / Tidak (same)           |
| User           | Pengguna         | Pengguna (same)             |
| Application    | Aplikasi         | Aplikasi (same)             |
| Filter         | Penapis / Filter | Filter                      |
| Click          | Klik             | Klik (same)                 |
| Subscribe (vb) | Melanggan        | Berlangganan                |
| Queue          | Baris gilir      | Antrean                     |
| Tip / Hint     | Petua            | Tip                         |
| Issue          | Isu / Masalah    | Masalah                     |
| Report (vb)    | Laporkan         | Laporkan (same)             |
| Loading        | Memuatkan        | Memuat                      |

Some of these (Subscribe, Filter) interact with glossary locks —
see "Stays Latin" below.

## Brand and feature names

- Latin script always (Malay uses Latin alphabet, so this is
  natural).
- `OneSignal`, `Apple`, `Twilio`, `HubSpot`, `Mixpanel`, `Amplitude`,
  `Segment`, `Snowflake`, `BigQuery`, `Webhook`, `Email`, `Push`,
  `SMS`, `RCS` — all stay Latin.
- `Email` — `Email` is widely used in Malaysian SaaS; `e-mel` exists
  but reads as government/legacy. Lock as `Email`.
- `Tag` — stays Latin (`Tag`), not `Tanda` or `Label`.
- `Segment` (OneSignal feature) → `Segment` (Latin). `Segment`
  (Twilio company) → also Latin.
- Product feature names stay Latin: `Journey`, `Journeys`,
  `Live Activity`, `Live Activities`, `Custom Events`, `Custom Event`,
  `Event Stream`, `Event Streams`, `Data Feed`, `Data Feeds`,
  `Template`, `Templates`. Mirrors the es/pt/id pattern — Malaysian
  SaaS marketers reach for the English form by default.
- Delivery-stem KPI/feature labels stay Latin per the same pattern:
  `Delivery Rate`, `Intelligent Delivery`, `Delivery time`,
  `Delivery Schedule`. The verb "deliver" / body-copy noun
  "delivery" still translates naturally (`menghantar`,
  `penghantaran`).

## Stays Latin (inherited from Indonesian reviewer feedback)

Following the precedent set by the Indonesian reviewer (Santi),
these terms also stay Latin in Malay — same product/analytics
loanword logic applies:

- `Overview` — stays Latin. Direct translations (`Ikhtisar`,
  `Tinjauan keseluruhan`) don't read as natural in product UI.
- `Engagement` — stays Latin. Direct translations
  (`Penglibatan`, `Interaksi`) don't carry the marketing/analytics
  sense familiar to Malaysian SaaS users.
- `Subscription` / `Subscriptions` / `Subscriber` / `Subscribers`
  — stay Latin. `Langganan` / `Pelanggan` carry the
  customer/subscribed-to-a-service connotation, which doesn't match
  the OneSignal noun (a record representing a way to reach a user).
- `drag-and-drop` / `Drag & drop` / `Drag and drop` — stay Latin.
  Common UI loanword in Malaysian product copy. Inflected verb
  forms in a11y instruction prose still translate naturally.

This list will likely grow with the first native review pass.

## Length

- Button labels: target ≤ 16 characters. Soft cap 22.
- Status badges: target ≤ 12 characters.
- Malay is roughly 10-15% longer than English due to multi-syllable
  Malayo-Polynesian roots. Plan layout accordingly.

## Conventions

- Use the active voice where it reads naturally; Malay also accepts
  passive constructions in formal SaaS copy more readily than
  Indonesian.
- Verb prefixes (same shape as Indonesian):
  - `me-` for active transitive (`menghantar`, `mencipta`)
  - `di-` for passive (`dihantar`, `dicipta`) — used in status badges
  - `ter-` for accidental/completed-state (`terhantar`, `terpadam`)
- For button labels, drop the `me-` prefix — use the bare root
  (`Hantar` not `Menghantar`, `Simpan` not `Menyimpan`).

## Common pitfalls

- Don't reach for the Indonesian word when the Malay form differs
  (`Hapus`/`Pengaturan`/`Kirim`/`Perbarui` are id-only). Use the
  ms-vs-id table above as a quick reference.
- Don't translate brand names into Malay even when a direct
  translation exists (`Apple` stays `Apple`, not `Epal`).
- Don't use Indonesian-specific spellings (`-i-` and `-e-`
  vowel choices sometimes diverge — e.g. id `kebijakan`, ms
  `dasar` for "policy").
- `Anda` is always capitalized mid-sentence per Malay orthography.
- Avoid heavy use of Arabic-origin formal terms (`merangkumi`,
  `menyebabkan`) in button copy — keep buttons short and direct.
