# Spanish (es) Style Addendum

## Variant

- **Neutral / LATAM-leaning Spanish.** Avoid Spain-only forms
  (vosotros, computational vocabulary like "ordenador").
- Avoid voseo (vos / Argentinian). Use tú forms when address is
  needed.
- The dashboard is read by Spanish-speaking marketers globally;
  prefer the lexicon that doesn't sound Madrid-specific or
  Buenos Aires-specific.

## Register and address

- **Tú** as second-person, never usted, never vos.
- Prefer subject-pronoun drop. `Crea un segmento`, not `Tú crea
  un segmento`.

## Buttons: infinitive form

- Buttons use infinitive (`Enviar`, `Guardar`, `Eliminar`,
  `Crear`), not imperative (`Envía`, `Guarda`).
- This matches Spanish web/SaaS convention and stays consistent
  across the dashboard.
- Status badges and labels: same — noun phrases.

## Punctuation

- Open questions with `¿`. Open exclamations with `¡`. Both are
  required.
- No spaces around punctuation (Spanish standard, not French).
- Sentence endings: period (.). For UI labels with no terminal
  punctuation in source, no terminal punctuation in target.

## Gender

- Default masculine for adjectives describing neutral subjects:
  `Activo`, `Inactivo`, `Pausado`, `Completado`, `Archivado`.
- Don't add @/x neutralization markers.
- For nouns referring to people (`Suscriptor`, `Remitente`,
  `Miembro`), use the form already established in glossary.

## Brand and feature names

- Latin script always. No translation of company names.
- "Email", "Push", "Webhook", "SMS", "RCS" stay Latin (per glossary).
- "Segment" — when it's the OneSignal feature, locked as `Segmento`.
  When it's the Twilio company, stays Latin `Segment`.
- Product feature names and KPI labels stay Latin: `Journey`,
  `Journeys`, `Live Activity`, `Data Feed`. Marketers reach for the
  English forms by default — translating them produces awkward
  Spanish that no practitioner uses.
- Delivery-stem terms follow the same rule **as feature/KPI labels**:
  `Delivery Rate`, `Intelligent Delivery`, `Delivery time`,
  `Delivery Schedule` stay Latin. Native Spanish reviewer (Chilean)
  feedback: `Tasa de entrega` / `Entrega inteligente` read as
  awkward when used as KPI or product-feature labels on a dashboard,
  even though they're literally correct.
- **Scope guard for Delivery-stem:** the verb "to deliver" and the
  general-purpose noun "delivery" still translate in body copy.
  Only locked product/KPI/feature labels go Latin. Same test applies
  to any future feature-name candidate: if it could be a column
  header or feature-card title, lock it Latin; if it's running prose,
  translate it.

## Status & event labels: prefer "Envío/Enviado" over "Entrega/Entregado"

Per Italo (Chilean reviewer): in Spanish-language marketing, the
"Envío/Enviado" family is the standard for delivery-related KPIs and
status labels; "Entrega/Entregado" reads as a literal translation
that practitioners don't reach for. Use:

| English source              | Spanish (use)                  |
| --------------------------- | ------------------------------ |
| Delivered                   | Enviado                        |
| Confirmed Delivered         | Envío confirmado               |
| Delivered Events            | Eventos enviados               |
| Show Delivered              | Mostrar enviados               |
| Total Delivered             | Total enviados                 |
| Deliveries by platform      | Envíos por plataforma          |
| Message Event Delivery      | Envío de eventos de mensajes   |
| Close Delivery menu         | Cerrar menú de Envío           |

**Known collision:** `Sent` also translates to `Enviado` and `Total
Sent` to `Total enviados`. In a dashboard view that shows both
`Sent` and `Delivered` columns side by side, they will render
identically in Spanish. This is intentional per the reviewer —
Spanish marketing KPIs don't distinguish the two — but worth
remembering when adding new translations: don't try to "fix" it by
back-translating one side to `Entregado`.

**Body copy stays distinct.** When a sentence enumerates both ("sends,
deliveries, and clicks"), keep `entregas` so the list doesn't read
"envíos, envíos, y clics". The Envío/Enviado rule applies to status
labels and standalone KPI nouns, not to running prose that pairs
both concepts.

## Length

- Button labels: target ≤ 18 characters. Soft cap 24.
- Status badges: target ≤ 14 characters.

## Conventions

- "Set up" / "Setup" → `Configurar` (verb) / `Configuración` (noun).
- "Save" → `Guardar`, never `Salvar` (that's pt).
- Use neutral lexicon: `Buscar` not `Encontrar`, `Eliminar` not
  `Borrar`.

## Examples

| English (role)              | ✓ Right                        | ✗ Wrong                         |
| --------------------------- | ------------------------------ | ------------------------------- |
| Send (button)               | Enviar                         | Envía (imperative)              |
| Save changes (button)       | Guardar cambios                | Guarde los cambios (usted form) |
| Create Segment (button)     | Crear segmento                 | Crea un segmento                |
| Are you sure? (dialog)      | ¿Estás seguro?                 | Estás seguro? (missing ¿)       |
| Sent (status)               | Enviado                        | Enviada (gender)                |
| Failed (status)             | Fallido                        | Falló (verb past tense)         |
| Loading… (spinner)          | Cargando…                      | Cargando... (ASCII ellipsis OK if source uses it) |
| Settings (nav)              | Ajustes                        | Configuración (locked)          |

## Things to watch

- Don't drop articles where Spanish requires them: `el segmento`,
  `los usuarios`. But buttons typically omit articles for brevity:
  `Crear segmento`, not `Crear el segmento`.
- "Tasa de" prefix for rate metrics (`Tasa de apertura`, `Tasa de
  clics`).
