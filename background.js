// Service worker: registers a context-menu item on the OneSignal dashboard
// so users can right-click any translated string and open a pre-filled
// Google Form suggesting a better translation. Also handles the popup's
// generic "Report a translation issue" button via chrome.tabs.create.
// Plus: daily crowdsourced-ledger batch upload (see LEDGER_ENDPOINT below).

// Pre-filled Google Form URL (no query string). The form lives at
// /viewform; pre-fill values are appended as ?usp=pp_url&entry.NNN=...
// Empty string disables the feedback flow entirely. Keep in sync with
// the same constants in popup.js.
const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdjpa5SWFW4M3nNOzNrJEZBUU_kCceYul-k5Xo3fo6qlv7yUw/viewform";

// Google Form field IDs, captured from the form's "Get pre-filled link"
// output. Only the two fields we pre-fill are listed here; other
// questions on the form (suggested replacement, notes, etc.) are left
// blank for the user to fill in.
const FORM_ENTRY = {
  language: "entry.883413776", // multiple-choice; value must match an option label
  selected: "entry.1755271323", // paragraph; "Current Translation"
};

// Language-code → form option label. The "Which language?" question is
// multiple choice, so pre-filling requires the human-readable label,
// not the ISO code we store internally.
const FORM_LANG_LABEL = {
  es: "Spanish",
  pt: "Portuguese (BR)",
  "zh-CN": "Simplified Chinese",
  ja: "Japanese",
  tr: "Turkish",
  ko: "Korean",
  fr: "French",
};

// Google Apps Script Web App URL that receives the daily ledger batch.
// Empty string = no network activity (ledger stays local). Set this to
// your deployed "/macros/s/.../exec" URL to start collecting.
const LEDGER_ENDPOINT = "https://script.google.com/macros/s/AKfycbw8iSkey37fK-WAszOZ99_52dJuAbdE11JbuE-xOLVod2vgHQxEgVphDWv7JyQhfmAnsA/exec";

const MENU_ID = "suggest-translation";
const DEFAULT_LANG = "en";
const LEDGER_ALARM = "ledger-flush";
const LEDGER_PERIOD_MINUTES = 60 * 24;
const LEDGER_KEY_SEP = "\x01";

// Right-click menu CTA, one per supported language. `%s` is replaced
// by Chrome with the user's current text selection. Fallback is `en`.
const MENU_TITLES = {
  en: 'Suggest a better translation for "%s"',
  ja: "「%s」のより良い翻訳を提案",
  es: 'Sugerir una mejor traducción para "%s"',
  pt: 'Sugerir uma tradução melhor para "%s"',
  ko: '"%s" 번역 개선 제안',
  fr: 'Suggérer une meilleure traduction pour "%s"',
  tr: '"%s" için daha iyi bir çeviri öner',
  "zh-CN": '为 "%s" 推荐更好的翻译',
};

function buildFormUrl({ language, selected }) {
  if (!FEEDBACK_FORM_URL) return null;
  // `usp=pp_url` is the Google-Forms convention for "pre-filled URL"
  // links. It's optional but matches what the form editor generates.
  const params = new URLSearchParams({ usp: "pp_url" });
  const langLabel = FORM_LANG_LABEL[language];
  if (langLabel) params.set(FORM_ENTRY.language, langLabel);
  if (selected) params.set(FORM_ENTRY.selected, selected);
  return `${FEEDBACK_FORM_URL}?${params.toString()}`;
}

async function recreateMenu() {
  // Read current language fresh so the menu title reflects whatever
  // the popup last saved. Called on install/startup AND whenever the
  // language storage key changes.
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const title = MENU_TITLES[language] || MENU_TITLES.en;
  return new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create(
        {
          id: MENU_ID,
          title,
          contexts: ["selection"],
          documentUrlPatterns: ["https://dashboard.onesignal.com/*"],
        },
        resolve,
      );
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  // onInstalled fires on every reload/update too, not just fresh installs.
  // recreateMenu() handles the removeAll + create dance so re-registering
  // doesn't trip "Cannot create item with duplicate id".
  recreateMenu();
  chrome.alarms.create(LEDGER_ALARM, { periodInMinutes: LEDGER_PERIOD_MINUTES });
});

chrome.runtime.onStartup.addListener(() => {
  // Service workers can be killed between launches; re-register the menu
  // and alarm in case they were cleared.
  recreateMenu();
  chrome.alarms.create(LEDGER_ALARM, { periodInMinutes: LEDGER_PERIOD_MINUTES });
});

// Refresh the menu title whenever the user picks a new language in the
// popup, so the right-click CTA always matches the current target.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.language) recreateMenu();
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

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;
  const selected = (info.selectionText || "").trim().slice(0, 200);
  if (!selected) return;
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const url = buildFormUrl({ language, selected });
  if (!url) {
    console.warn(
      "[OneSignal Translator] FEEDBACK_FORM_URL not configured — see README.",
    );
    return;
  }
  chrome.tabs.create({ url });
});
