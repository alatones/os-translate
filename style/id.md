# Indonesian (id) Style Addendum

## Variant

- **Standard Bahasa Indonesia** (Ejaan Bahasa Indonesia / EBI).
  Latin script, no diacritics.
- The dashboard targets Indonesian-speaking marketers and product
  teams. Indonesian and Malay are mutually intelligible to a degree
  but the vocabulary, phrasing, and local usage differ — treat them
  as fully separate translations. Where the natural Indonesian word
  diverges from Malay, use the Indonesian form (e.g. `Hapus` for
  Delete in `id`, vs `Padam` in `ms`).

## Register and address

- **Anda** (formal you, always capitalized) for direct address. This
  is the Indonesian B2B SaaS default — used by Tokopedia, Gojek,
  Bukalapak, Mekari, and the major Indonesian enterprise platforms.
  Never use `kamu` (informal you) or drop the pronoun.
- Verb conjugation is invariant by person in Indonesian, so register
  is carried by the pronoun choice.
- Imperative form for CTAs: bare verb (`Buat`, `Simpan`, `Kirim`)
  or `Klik`-style direct command. Same as English's bare-verb buttons.

## Buttons: bare verb form

- Buttons use the bare verb (`Buat`, `Simpan`, `Hapus`, `Kirim`,
  `Edit`). This matches the Indonesian SaaS convention.
- Same form whether the source is `Save` or `Save changes` — the
  Indonesian button reads as the verb only.
- Status badges use past/perfective forms (`Terkirim` = Sent,
  `Berhasil` = Succeeded, `Gagal` = Failed).

## Punctuation

- Standard Latin punctuation. No special opening marks like Spanish
  inverted question marks.
- Use ASCII straight quotes (`'` and `"`) in translation values.
- Sentence endings match the English source — period if source has
  period, no terminal punctuation if source has none.
- Indonesian decimal separator is `,` and thousands separator is
  `.` in formal contexts (`Rp 1.000.000,00`). For numbers in UI
  labels, follow whatever the source uses — usually Western format.

## Capitalization

- Days of the week are **capitalized** in Indonesian: `Senin,
  Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu`.
- Months are **capitalized**: `Januari, Februari, Maret, April, Mei,
  Juni, Juli, Agustus, September, Oktober, November, Desember`.
- Headings use Sentence case (only first word capitalized) unless
  the source uses Title Case for a brand-style heading — in which
  case mirror it.
- Status labels: Sentence case (`Aktif`, `Tidak aktif`, `Berhasil`).

## Vocabulary

- "Save" → `Simpan`. Never `Menyimpan` (the noun form) in a button.
- "Delete" → `Hapus`. Never `Buang` (means throw away).
- "Settings" → `Pengaturan`. Never `Setelan` (regional/informal) or
  the English loanword in formal UI.
- "Search" → `Cari` (verb) / `Pencarian` (noun).
- "Filter" → `Filter` (loanword, widely used in SaaS).
- "Edit" → `Edit` (loanword, widely used) or `Sunting` (more formal).
  Prefer `Edit` for buttons to match brevity.
- "Create" → `Buat`. Never `Ciptakan` (too literary).
- "Add" → `Tambahkan` (verb form) or `Tambah` (shorter, common in
  buttons).
- "Cancel" → `Batal` (button) / `Batalkan` (verb form mid-phrase).
- "Send" → `Kirim`. Status: `Terkirim`.
- "View" → `Lihat`. `Lihat detail` for "View details".
- "Done" / "Finished" → `Selesai`.
- "Continue" → `Lanjutkan`.
- "Back" → `Kembali`.
- "Yes / No" → `Ya / Tidak`.
- Rate metrics: `Tingkat ...` prefix. `Tingkat klik` (Click-through
  Rate), `Tingkat keterkiriman` (Delivery rate), `Tingkat pembukaan`
  (Open rate).
- "User" → `Pengguna`. `Pelanggan` if context is customer/subscriber.

## Brand and feature names

- Latin script always (Indonesian uses Latin alphabet, so this is
  natural).
- `OneSignal`, `Apple`, `Twilio`, `HubSpot`, `Mixpanel`, `Amplitude`,
  `Segment`, `Snowflake`, `BigQuery`, `Webhook`, `Email`, `Push`,
  `SMS`, `RCS` — all stay Latin.
- `Email` — `Email` is widely used; the formal Indonesian `surel`
  exists but reads as government/legacy. Lock as `Email`.
- `Tag` — stays Latin (`Tag`), not `Tanda` or `Label`. SaaS convention.
- `Segment` (OneSignal feature) → `Segment` (Latin — Indonesian SaaS
  uses the English form). `Segment` (Twilio company) → also Latin.
- Product feature names stay Latin: `Journey`, `Journeys`,
  `Live Activity`, `Live Activities`, `Custom Events`, `Custom Event`,
  `Event Stream`, `Event Streams`, `Data Feed`, `Data Feeds`,
  `Template`, `Templates`. Mirrors the the es (Spanish) / pt (Portuguese) reviewer
  pattern — Indonesian SaaS marketers reach for the English form by
  default.
- Delivery-stem KPI/feature labels stay Latin per the same pattern:
  `Delivery Rate`, `Intelligent Delivery`, `Delivery time`,
  `Delivery Schedule`. The verb "deliver" / body-copy noun "delivery"
  still translates naturally (`mengirim`, `pengiriman`).

## Stays Latin (per Indonesian reviewer)

Additions from Santi (Indonesian reviewer) on the first-pass id review.
These were initially translated; Santi flagged each as unnatural or
semantically wrong, and recommended keeping the English form which is
familiar to Indonesian product/analytics users:

- `Overview` — stays Latin. `Ikhtisar` is rare in everyday Indonesian
  product or analytics contexts.
- `Engagement` — stays Latin. `Keterlibatan` reads literally
  (= "involvement") and doesn't carry the marketing/analytics sense.
  `Interaksi` was offered as a fallback but the Latin form is more
  familiar to dashboard users.
- `Subscription` / `Subscriptions` / `Subscriber` / `Subscribers` —
  stay Latin. `Berlangganan` / `Pelanggan` read as "opted-in to a
  service" or "customer," which doesn't match the OneSignal noun
  (a record representing a way to reach a user — push device, email
  address, phone number). The Latin form preserves the technical
  meaning.
- `drag-and-drop` / `Drag & drop` / `Drag and drop` — stay Latin.
  `seret-dan-lepas` is a literal calque but `drag-and-drop` is the
  common UI-convention loanword in Indonesian product copy. Note:
  inflected verb forms `menyeret` / `diseret` in a11y instruction
  prose ("press space bar to drag…") still translate naturally —
  the lock applies to the noun-compound form only.

## Length

- Button labels: target ≤ 16 characters. Soft cap 22.
- Status badges: target ≤ 12 characters.
- Indonesian is roughly 10-15% longer than English due to multi-
  syllable Malayo-Polynesian roots. Plan layout accordingly.

## Conventions

- Use the active voice. Indonesian prefers active constructions
  (`Membuat segmen baru`) over passive (`Segmen baru dibuat`).
- Verb prefixes:
  - `me-` for active transitive (`mengirim`, `membuat`)
  - `di-` for passive (`dikirim`, `dibuat`) — used in status badges
  - `ter-` for accidental/completed-state (`terkirim`, `terhapus`)
- For button labels, drop the `me-` prefix — use the bare root
  (`Kirim` not `Mengirim`, `Simpan` not `Menyimpan`).

## Common pitfalls

- Don't translate brand names into Indonesian even when a direct
  translation exists (`Apple` stays `Apple`, not `Apel`).
- Don't use `kau` or `kamu` — those are informal/literary in B2B
  context.
- Don't use Malay-specific vocabulary even if it might be understood
  (`Padam` for delete, `Cari` is shared but `Mengarah` style
  constructions diverge — keep Indonesian-native forms).
- `Anda` is always capitalized mid-sentence per Indonesian
  orthography rules.
