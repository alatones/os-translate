# Korean (ko) Style Addendum

## Register

- **합쇼체** (~합니다 / ~하십시오) for tooltips, descriptions, full
  sentences, dialog copy, and any explanatory text.
- **명사형** (noun-form) or **명령형** (imperative) for buttons,
  status badges, table headers, navigation. Concise.
- **Never use 해요체** (~해요 / ~하세요) — too casual for B2B SaaS.
- Never use plain form (~한다, ~다).

## Buttons: noun-form preferred

- Prefer noun-form over verb-form for buttons:
  - `발송` (right) over `발송하기` (verb form, longer)
  - `저장` (right) over `저장하기`
  - `삭제` (right) over `삭제하기`
- Verb-form is acceptable when noun-form is ambiguous or awkward.

## Punctuation

- Standard Korean punctuation. Period (.), comma (,), question
  mark (?), exclamation mark (!).
- No space before punctuation. Space after.
- 「」 only when quoting text instructionally; not for emphasis.
- No exclamation marks unless source has one.
- ellipsis: use `…` (single character) when source does, `...`
  (three dots) when source does — match.

## Spacing

- Korean spacing rules: words separated by spaces. e.g.
  `세그먼트 생성` (correct) not `세그먼트생성`.
- No space between a stem and 조사 (particles): `메시지를` (right),
  not `메시지 를`.
- One space between modifier and modified word.

## Brand and feature names

- Latin: OneSignal, Apple, Twilio, HubSpot, Mixpanel, Amplitude,
  Snowflake, BigQuery, Segment, AWS, Google, Microsoft, Apache.
- 한글 transliteration only when established (per glossary):
  웹훅 (Webhook), 저니 (Journey), 푸시 (Push), 인앱 (In-App),
  세그먼트 (Segment), 캐러셀 (Carousel), 템플릿 (Template).
- "Segment" — when OneSignal feature, locked as `세그먼트`.
  When Twilio company, stays Latin `Segment`.

## Length

- Button labels: target ≤ 6 characters. Soft cap 10.
- Status badges: target ≤ 5 characters.
- Korean is information-dense; short usually works.

## Conventions

- "Save" → `저장`. "Save changes" → `변경사항 저장` (not `변경사항을 저장`
  for buttons — drop the particle for compactness).
- "Delete" → `삭제`. "Remove" → `제거`. (Both `삭제`-flavored, but
  "Remove" implies removing from a list/group; `제거` is the
  natural choice.)
- "Settings" → `설정`. "Configuration" → `구성`.
- "Filter" → `필터`. "Apply" → `적용`.
- "Automated" → `자동화` (bare nominal). Avoid `자동화됨` (passive
  marker); SaaS UI prefers nominal noun form for status/category
  labels. The `~됨` form belongs on event-style status badges
  (`발송됨`, `실패됨`, `완료됨`), not on category labels like
  Automated/Manual.
- "Integration" / "Integrations" → `연동` (technical integration with
  external systems — webhooks, APIs, third-party tools). Avoid `통합`
  in this sense; `통합` reads as "unified / consolidated" and is
  imprecise for the SaaS-integration meaning. `통합 보고서` (unified
  report) is fine; `HubSpot 통합` is wrong (use `HubSpot 연동`).
- Rate metrics: `~율` suffix. `클릭률`, `열람률`, `전달률`.

## Examples

| English (role)              | ✓ Right                | ✗ Wrong                          |
| --------------------------- | ---------------------- | -------------------------------- |
| Send (button)               | 발송                    | 발송하기 (verb form, too long)    |
| Save changes (button)       | 변경사항 저장           | 변경사항을 저장합니다 (too long)   |
| Create Segment (button)     | 세그먼트 만들기         | 세그먼트를 만드세요 (too formal)  |
| Are you sure? (dialog)      | 정말 하시겠습니까?      | 정말 할거에요? (해요체)           |
| Sent (status)               | 발송됨                  | 보내짐 (passive form)             |
| Failed (status)             | 실패됨                  | 실패했어요 (해요체)               |
| Loading… (spinner)          | 로딩 중…                | 로딩중... (missing space)         |
| Settings (nav)              | 설정                    | 환경설정 (alt term, locked to 설정) |
| Automated (label)           | 자동화                   | 자동화됨 (passive form on category) |
| Integrations (nav)          | 연동                     | 통합 (means "unified", not technical) |
| HubSpot Integration (label) | HubSpot 연동             | HubSpot 통합 (wrong sense)         |

## Things to watch

- Don't conflate ~합니다 with ~한다. The former is 합쇼체 (correct);
  the latter is plain form (wrong).
- Korean has no grammatical plural marker — `세그먼트` covers
  both "Segment" and "Segments".
- 의 (possessive particle) often dropped in compounds:
  `세그먼트 이름` not `세그먼트의 이름` for "Segment Name".
- Don't translate placeholders or Latin brand names by accident.
