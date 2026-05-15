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
  "zh-TW": "Traditional Chinese",
  ja: "Japanese",
  tr: "Turkish",
  ko: "Korean",
  fr: "French",
};

// Google Apps Script Web App URL that receives the daily ledger batch.
// Stored as base64 to avoid a plaintext string in the packaged extension.
// This is obfuscation, not encryption — the value is recoverable by
// anyone with source access. For abuse prevention, LEDGER_TOKEN is sent
// in the POST body; add a matching check in your Apps Script doPost().
// Empty string = no network activity (ledger stays local).
const LEDGER_ENDPOINT = atob(
  "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3OGlTa2V5MzdmSy" +
  "1XQXN6T1o5OV81MmRKdUFiZEUxMUpidUUteE9MVm9kMnZnSFF4RWdWcGhEV3Y3SnlRaGZt" +
  "QW5zQS9leGVj"
);
// Shared secret sent with every ledger POST. Apps Script checks this and
// rejects requests without it. Rotate here + in your Apps Script if leaked.
const LEDGER_TOKEN = "dff44052ef228c28c3051b5749a65de51d1997ce";

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
  "zh-TW": '為「%s」建議更好的翻譯',
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

// recreateMenu() can fire from three triggers (onInstalled, onStartup,
// storage.onChanged) plus user-driven language changes. If two fire close
// together — or a service-worker termination interleaves a pending
// removeAll → create dance — the second create() can land while an item
// with our id still exists, producing "Cannot create item with duplicate
// id suggest-translation" in chrome://extensions. Serialize through a
// Promise chain so only one menu op runs at a time, acknowledge any
// lastError in the create callback (otherwise Chrome flags it as
// "Unchecked"), and fall back to contextMenus.update() on the unlikely
// duplicate-id case so the title still reflects the current language.
let menuOpQueue = Promise.resolve();

function recreateMenu() {
  menuOpQueue = menuOpQueue
    .then(doRecreateMenu)
    .catch((err) => {
      // Swallow so a single failure doesn't poison the queue for future calls.
      console.debug("[OS Translate] recreateMenu failed:", err);
    });
  return menuOpQueue;
}

async function doRecreateMenu() {
  // Read current language fresh so the menu title reflects whatever
  // the popup last saved.
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const title = MENU_TITLES[language] || MENU_TITLES.en;
  await new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      // Acknowledge any lastError so it isn't logged as "Unchecked".
      void chrome.runtime.lastError;
      resolve();
    });
  });
  await new Promise((resolve) => {
    chrome.contextMenus.create(
      {
        id: MENU_ID,
        title,
        contexts: ["selection"],
        documentUrlPatterns: ["https://dashboard.onesignal.com/*"],
      },
      () => {
        const err = chrome.runtime.lastError;
        if (err && /duplicate id/i.test(err.message || "")) {
          // Item already exists from a previous create that survived a
          // race — just update its title in place.
          chrome.contextMenus.update(MENU_ID, { title }, () => {
            void chrome.runtime.lastError;
            resolve();
          });
          return;
        }
        if (err) console.debug("[OS Translate] menu create:", err.message);
        resolve();
      },
    );
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
  // and alarm in case they were cleared. chrome.alarms.create() is
  // idempotent — silently succeeds if the alarm already exists, so
  // version upgrades that don't change the alarm name are safe.
  recreateMenu();
  chrome.alarms.create(LEDGER_ALARM, { periodInMinutes: LEDGER_PERIOD_MINUTES });
});

// Refresh the menu title whenever the user picks a new language in the
// popup, so the right-click CTA always matches the current target.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.language) recreateMenu();
});

// Ledger storage entries can be either:
//   - number (pre-1.6, count only — still in the wild after upgrade)
//   - { count, role, classChain } (1.6+)
// This helper normalizes both shapes to a uniform read.
function ledgerCount(v) {
  if (typeof v === "number") return v;
  if (v && typeof v.count === "number") return v.count;
  return 0;
}

function parseLedger(ledger) {
  const entries = [];
  for (const [key, value] of Object.entries(ledger || {})) {
    const parts = key.split(LEDGER_KEY_SEP);
    if (parts.length !== 3) continue;
    const [lang, path, string] = parts;
    if (!lang || !string) continue;
    const count = ledgerCount(value);
    if (count <= 0) continue;
    const role = value && typeof value === "object" && value.role ? value.role : "other";
    const classChain =
      value && typeof value === "object" && value.classChain ? value.classChain : "";
    entries.push({ lang, path, string, count, role, classChain });
  }
  return entries;
}

// Per-install random ID, generated lazily on first ledger flush. Sent
// with each flush payload so the Apps Script can count distinct
// installs that hit an untranslated string (rather than just summing
// total instance counts, which one busy browser could dominate). The
// ID lives in chrome.storage.local (deliberately not .sync — we want
// one install = one ID, never shared across profiles or devices). It
// contains no information about the user and is never used for
// anything else. See PRIVACY.md.
async function getOrCreateInstallId() {
  const { installId } = await chrome.storage.local.get({ installId: null });
  if (typeof installId === "string" && installId) return installId;
  const fresh = (crypto && crypto.randomUUID) ? crypto.randomUUID() : null;
  if (!fresh) return null;
  await chrome.storage.local.set({ installId: fresh });
  return fresh;
}

async function flushLedger() {
  if (!LEDGER_ENDPOINT) return; // Unconfigured: never touch the network.
  const { ledgerOptIn = true } = await chrome.storage.sync.get({ ledgerOptIn: true });
  if (!ledgerOptIn) return;
  const { ledger = {} } = await chrome.storage.local.get({ ledger: {} });
  const entries = parseLedger(ledger);
  if (entries.length === 0) return;
  const installId = await getOrCreateInstallId();
  let ok = false;
  try {
    const res = await fetch(LEDGER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: 2,
        token: LEDGER_TOKEN,
        installId,
        entries,
      }),
    });
    ok = res.ok;
  } catch (err) {
    console.warn("[OS Translate] ledger flush failed:", err);
  }
  if (ok) {
    // Only clear entries we just sent. New misses that arrived during the
    // POST stay in the ledger for next time. Handle both old (number)
    // and new ({count,...}) value shapes.
    const { ledger: after = {} } = await chrome.storage.local.get({ ledger: {} });
    for (const key of Object.keys(ledger)) {
      const sentCount = ledgerCount(ledger[key]);
      const currentCount = ledgerCount(after[key]);
      if (currentCount <= sentCount) {
        delete after[key];
        continue;
      }
      // Some misses landed between flush start and end — decrement and keep.
      if (typeof after[key] === "object" && after[key]) {
        after[key].count = currentCount - sentCount;
      } else {
        after[key] = currentCount - sentCount;
      }
    }
    await chrome.storage.local.set({ ledger: after });
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === LEDGER_ALARM) flushLedger();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
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
      "[OS Translate] FEEDBACK_FORM_URL not configured — see README.",
    );
    return;
  }
  chrome.tabs.create({ url });
});
