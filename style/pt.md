# Portuguese (pt) Style Addendum

## Variant

- **pt-BR (Brazilian Portuguese).** Not pt-PT.
- Lexicon, spelling, and idiom follow Brazilian convention.
  `Cancelar`, `Excluir`, `Salvar`, `Você` are correct;
  `Apagar`, `Gravar`, `Tu` are wrong (the latter is European
  Portuguese).

## Register and address

- **Você** for second-person address. Never `tu`. Never explicit
  `o senhor / a senhora`.
- Prefer subject-pronoun drop where natural: `Crie um segmento`,
  not `Você crie um segmento`.

## Buttons: infinitive form

- Buttons use infinitive (`Enviar`, `Salvar`, `Excluir`, `Criar`),
  matching Brazilian SaaS convention.
- Same for primary CTAs across the dashboard.
- Status badges and labels: noun phrases.

## Punctuation

- Standard Latin punctuation. No special opening marks (no `¿`,
  no `¡` — those are Spanish).
- Sentence endings: period (.). Match source for terminal
  punctuation on UI labels.
- Em-dash (—) and en-dash (–) usage matches source.

## Gender

- Default masculine for adjectives describing neutral subjects:
  `Ativo`, `Inativo`, `Pausado`, `Concluído`, `Arquivado`.
- Don't add neutralization markers (e.g. @, e, x).
- Nouns referring to people use the form already in glossary
  (`Assinante`, `Remetente`, `Membro`).

## Brand and feature names

- Latin always. No translation of vendor names.
- `Email`, `Push`, `SMS`, `RCS`, `Webhook`, `Tag` (locked Latin
  in pt) stay Latin.
- "Segment" (OneSignal feature) → `Segmento`.
  "Segment" (Twilio company) → `Segment` (Latin).
- `Template` / `Templates` → `Template` / `Templates` (Latin).
  Per Ana (BR reviewer): `Modelo` / `Modelos` reads as a literal
  translation; Brazilian marketers reach for `Template` in SaaS
  contexts. Glossary-locked. Case preserved: `Template` (Title)
  in standalone labels and section headings, `template` (lowercase)
  mid-phrase per Portuguese sentence convention.

## Length

- Button labels: target ≤ 18 characters. Soft cap 24.
- Status badges: target ≤ 14 characters.

## Conventions

- "Save" → `Salvar`. Always. Never `Guardar` (that's es).
- "Delete" → `Excluir`. Never `Apagar` or `Deletar`.
- "Settings" → `Configurações`. Never `Ajustes` (that's es).
- "Search" → `Pesquisar`. Never `Procurar` (less natural in
  SaaS UI).
- "Filter" → `Filtrar` (verb) / `Filtro` (noun).
- Rate metrics: `Taxa de` prefix. `Taxa de abertura`, `Taxa de
  cliques`, `Taxa de entrega`.

## Examples

| English (role)              | ✓ Right                        | ✗ Wrong                          |
| --------------------------- | ------------------------------ | -------------------------------- |
| Send (button)               | Enviar                         | Envie (imperative)               |
| Save changes (button)       | Salvar alterações              | Guardar alterações (es)          |
| Create Segment (button)     | Criar segmento                 | Crie um segmento                 |
| Are you sure? (dialog)      | Tem certeza?                   | Você está seguro? (mistranslation)|
| Sent (status)               | Enviado                        | Enviada (gender)                 |
| Failed (status)             | Com falha                      | Falhou (verb past tense)         |
| Loading… (spinner)          | Carregando…                    | Carregando... (preserve source's ellipsis style) |
| Settings (nav)              | Configurações                  | Ajustes (es)                     |

## Things to watch

- Don't drop articles where Portuguese requires them in flowing
  sentences. Buttons typically omit articles: `Criar segmento`,
  not `Criar o segmento`.
- Plurals: noun + plural ending (`segmentos`, `usuários`,
  `cliques`). Match source's number.
- "Você" is sometimes implicit; don't add it where it's not
  needed.
