// Service worker: registers a context-menu item on the OneSignal dashboard
// so users can right-click any translated string and open a pre-filled
// email suggesting a better translation. Also handles the popup's generic
// "Report a translation issue" button via chrome.tabs.create. Plus: daily
// crowdsourced-ledger batch upload (see LEDGER_ENDPOINT below).

// TODO: set this to the address that should receive translation feedback.
// Keep it in sync with FEEDBACK_EMAIL in popup.js.
const FEEDBACK_EMAIL = "bd@onesignal.com";

// Google Apps Script Web App URL that receives the daily ledger batch.
// Empty string = no network activity (ledger stays local). Set this to
// your deployed "/macros/s/.../exec" URL to start collecting.
const LEDGER_ENDPOINT = "https://script.google.com/macros/s/AKfycbw8iSkey37fK-WAszOZ99_52dJuAbdE11JbuE-xOLVod2vgHQxEgVphDWv7JyQhfmAnsA/exec";

const MENU_ID = "suggest-translation";
const DEFAULT_LANG = "ja";
const LEDGER_ALARM = "ledger-flush";
const LEDGER_PERIOD_MINUTES = 60 * 24;
const LEDGER_KEY_SEP = "\x01";

function buildMailtoUrl({ subject, body }) {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  // URLSearchParams encodes spaces as '+', which is wrong for mailto body.
  // Replace with %20 so line breaks and spacing render correctly in mail
  // clients.
  const qs = params.toString().replace(/\+/g, "%20");
  return `mailto:${FEEDBACK_EMAIL}?${qs}`;
}

function selectionEmailBody({ language, pageUrl, selected }) {
  return [
    `Language: ${language}`,
    `Page: ${pageUrl || "(not captured)"}`,
    "",
    "Original English string (if known):",
    "  (leave blank if unsure)",
    "",
    "Currently translated as:",
    `  ${selected}`,
    "",
    "Suggested translation:",
    "  (your suggestion here)",
    "",
    "Notes / context:",
    "  (screenshot, where on the dashboard, tone, etc.)",
  ].join("\n");
}

chrome.runtime.onInstalled.addListener(() => {
  // onInstalled fires on every reload/update too, not just fresh installs —
  // wipe first so re-creating doesn't trip "Cannot create item with
  // duplicate id".
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Suggest a better translation for "%s"',
      contexts: ["selection"],
      documentUrlPatterns: ["https://dashboard.onesignal.com/*"],
    });
  });
  chrome.alarms.create(LEDGER_ALARM, { periodInMinutes: LEDGER_PERIOD_MINUTES });
});

chrome.runtime.onStartup.addListener(() => {
  // Service workers can be killed between launches; re-register the alarm
  // in case it was cleared.
  chrome.alarms.create(LEDGER_ALARM, { periodInMinutes: LEDGER_PERIOD_MINUTES });
});

function parseLedger(ledger) {
  const entries = [];
  for (const [key, count] of Object.entries(ledger || {})) {
    const parts = key.split(LEDGER_KEY_SEP);
    if (parts.length !== 3) continue;
    const [lang, path, string] = parts;
    if (!lang || !string || typeof count !== "number") continue;
    entries.push({ lang, path, string, count });
  }
  return entries;
}

async function flushLedger() {
  if (!LEDGER_ENDPOINT) return; // Unconfigured: never touch the network.
  const { ledgerOptIn = true } = await chrome.storage.sync.get({ ledgerOptIn: true });
  if (!ledgerOptIn) return;
  const { ledger = {} } = await chrome.storage.local.get({ ledger: {} });
  const entries = parseLedger(ledger);
  if (entries.length === 0) return;
  let ok = false;
  try {
    const res = await fetch(LEDGER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: 1, entries }),
    });
    ok = res.ok;
  } catch (err) {
    console.warn("[OneSignal Translator] ledger flush failed:", err);
  }
  if (ok) {
    // Only clear entries we just sent. New misses that arrived during the
    // POST stay in the ledger for next time.
    const { ledger: after = {} } = await chrome.storage.local.get({ ledger: {} });
    for (const key of Object.keys(ledger)) {
      if (after[key] === ledger[key]) delete after[key];
      else if (typeof after[key] === "number") after[key] -= ledger[key];
    }
    await chrome.storage.local.set({ ledger: after });
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === LEDGER_ALARM) flushLedger();
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "flush-ledger-now") {
    flushLedger().then(() => sendResponse({ ok: true }));
    return true; // keep sendResponse alive
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const selected = (info.selectionText || "").trim().slice(0, 200);
  if (!selected) return;
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const subject = `[${language}] Translation suggestion: "${selected.slice(0, 60)}"`;
  const body = selectionEmailBody({
    language,
    pageUrl: info.pageUrl || (tab && tab.url) || "",
    selected,
  });
  chrome.tabs.create({ url: buildMailtoUrl({ subject, body }) });
});
