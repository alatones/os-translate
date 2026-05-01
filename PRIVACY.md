# Privacy Policy — OneSignal Dashboard Translator

**Effective date:** 2026-04-30

The OneSignal Dashboard Translator is a Chrome/Edge browser extension
that translates the OneSignal admin dashboard
(`https://dashboard.onesignal.com`) into your chosen language. This
page describes exactly what data the extension reads, stores, and
transmits — and what it does not.

## Short version

- The extension only runs on `https://dashboard.onesignal.com`. It
  does not touch any other site.
- Your campaign data, customer records, audience segments, message
  bodies, journey configurations, integrations, analytics, and any
  other dashboard content stay on your machine. None of it is
  transmitted anywhere by this extension.
- The extension stores your chosen target language locally and syncs
  it to your Chrome account so the choice persists across devices.
- **Optionally** (toggle on by default, off in one click), the
  extension shares a list of *English UI strings the dictionary
  hasn't translated yet* — never user data, never URLs containing
  real IDs, never customer information — so we can expand coverage.
  You can review the queue, opt out, or clear it from the popup at
  any time.

## What the extension stores locally

These items live on your device only and are never transmitted:

- **Selected target language** (e.g. `ja`, `fr`) in
  `chrome.storage.sync` so your preference syncs across your own
  Chrome profiles.
- **Opt-in preference** for the optional improvement program (a
  boolean flag) in `chrome.storage.sync`.
- **Local missed-string queue** in `chrome.storage.local`: a list of
  English UI strings the bundled dictionary couldn't yet translate,
  with the dashboard page type they appeared on (e.g.
  `/apps/:id/journeys`). The queue is reviewable from the popup
  ("View what's queued") and clearable.

## What the extension transmits — only when you opt in

When the **"Help improve translations"** checkbox in the popup is
enabled — it is on by default but disable-able in one click — the
extension batches the local missed-string queue and sends it once
every 24 hours to a Google Apps Script endpoint operated by the
maintainer. The endpoint writes the batch to a Google Sheet the
maintainer reviews to expand the translation dictionary.

The transmitted payload contains, per missed string:

- The English source text exactly as it appeared on the dashboard.
- The dashboard page path with real identifiers replaced by `:id`
  (e.g. `/apps/:id/journeys`, never `/apps/abc-123-real-app-id/...`).
- A count of how many times the string was seen on the user's
  dashboard.
- The target language the user has selected (e.g. `ja`).

The payload contains **no** user identifiers, **no** session tokens,
**no** customer records, **no** message bodies, **no** URLs with real
IDs, **no** data from outside the OneSignal dashboard.

### Filters that prevent unwanted strings from being queued

Before any string is added to the local queue, the extension applies a
filter (`couldBeUI` in `content.js`) that rejects strings matching any
of: `@` (catches email addresses), `//` (catches URLs), 6-or-more
consecutive digits (catches IDs), UUIDs, timestamps in any common
format, IPv6 addresses, markdown link syntax, snake/kebab attribute
names (catches user-defined tag keys), and several other patterns.

These filters reduce — but do not guarantee elimination of — the
chance that a stray fragment could land in the queue. The queue
viewer in the popup lets you inspect every string before any batch
leaves your device.

## What the extension does not collect

- **Personally identifiable information.** Names, addresses, email
  addresses, phone numbers, age, identification numbers — never
  read, stored, or transmitted.
- **Health, financial, authentication, or location data.** None of
  these categories are touched.
- **Browsing history.** The extension operates only on
  `dashboard.onesignal.com` and records nothing about other sites
  you visit.
- **Behavioral data.** No click tracking, no scroll position
  monitoring, no mouse movement or keystroke logging. The
  extension's `MutationObserver` watches React DOM updates so newly
  rendered UI text can be translated — that's structural, not
  behavioral.
- **Customer or campaign data.** Your audiences, segments, message
  contents, push notifications, email templates, SMS templates,
  in-app messages, journey configurations, integrations, and
  analytics are never read by this extension. The content script
  reads only top-level UI labels (like "Settings", "Send", "Active
  subscribers") to translate them, then walks the DOM looking only
  for short text nodes that match the bundled dictionary.

## Third parties

This extension does not sell, rent, or transfer data to advertisers
or data brokers.

The opt-in missed-string batch (described above) is transmitted to a
Google Apps Script endpoint owned by the maintainer. The endpoint and
the destination Google Sheet are part of the maintainer's Google
Workspace account. Google's own Terms of Service and Privacy Policy
apply to the data while it is held in Google's systems.

## How to opt out

- Open the extension popup → uncheck **"Help improve translations"**.
  No further batches leave your device.
- The local queue keeps recording for your own inspection, but
  nothing is transmitted.
- To clear the local queue: open the **View what's queued** page
  from the popup → use the **Clear** button. Or simply uninstall
  the extension — `chrome.storage.local` is wiped automatically.

## Children

This extension is not directed at children under 13. It is a B2B
SaaS productivity tool aimed at marketing, product, and operations
professionals.

## Changes to this policy

If the data this extension collects changes materially, this document
will be updated and the **Effective date** at the top will be
bumped. Material changes will also appear in
[`CHANGELOG.md`](./CHANGELOG.md).

## Contact

For questions about this policy or to report a privacy concern,
contact the maintainer at
[GITHUB_ISSUES_OR_EMAIL_PLACEHOLDER]. Please replace this placeholder
with your preferred contact channel before publishing.
