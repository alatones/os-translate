const DEFAULT_LANG = "ja";
const DASHBOARD_HOST = "dashboard.onesignal.com";

// Pre-filled Google Form URL. Keep these in sync with the same constants
// in background.js. See the README for setup instructions.
const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdjpa5SWFW4M3nNOzNrJEZBUU_kCceYul-k5Xo3fo6qlv7yUw/viewform";
const FORM_ENTRY = {
  language: "entry.883413776",
  selected: "entry.1755271323",
};
const FORM_LANG_LABEL = {
  es: "Spanish",
  pt: "Portuguese (BR)",
  "zh-CN": "Simplified Chinese",
  ja: "Japanese",
  tr: "Turkish",
  ko: "Korean",
  fr: "French",
};

// Flag emojis for the language picker. Skipped for `en` (off mode).
// Note: these render as gray letter-pairs ("JP") on Windows 10, which
// has no native color-emoji font. macOS / Win11 / ChromeOS / Linux
// (with Noto fonts) render them in color.
const LANG_FLAGS = {
  es: "🇪🇸",
  pt: "🇧🇷",
  "zh-CN": "🇨🇳",
  ja: "🇯🇵",
  tr: "🇹🇷",
  ko: "🇰🇷",
  fr: "🇫🇷",
};

const select = document.getElementById("lang");
const status = document.getElementById("status");
const feedbackBtn = document.getElementById("feedback");
const optinBox = document.getElementById("ledger-optin");
const queueLink = document.getElementById("queue-link");
const disclosure = document.getElementById("disclosure");
const disclosureDismiss = document.getElementById("disclosure-dismiss");

function setStatus(msg) {
  status.textContent = msg;
}

async function populateLanguageOptions() {
  // Load the language registry from languages.json so adding a new language
  // requires zero JS changes — just an entry in the "languages" map.
  try {
    const res = await fetch(chrome.runtime.getURL("languages.json"));
    const data = await res.json();
    const langs = (data && data.languages) || {};
    for (const [code, label] of Object.entries(langs)) {
      const opt = document.createElement("option");
      opt.value = code;
      const flag = LANG_FLAGS[code];
      opt.textContent = flag ? `${flag} ${label}` : label;
      select.appendChild(opt);
    }
  } catch (err) {
    console.warn("[OneSignal Translator] failed to load language list:", err);
  }
  const { language } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  select.value = language;
}

populateLanguageOptions();

select.addEventListener("change", async () => {
  const next = select.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const onDashboard = tab && tab.url && tab.url.includes(DASHBOARD_HOST);

  // Warn before reloading — the user may have unsaved edits in a draft
  // message, segment builder, etc. Confirming here is cheap; losing work
  // is not.
  const ok = onDashboard
    ? confirm(
        "Switching language will reload the OneSignal dashboard tab. " +
          "Any unsaved changes (drafts, open editors) will be lost.\n\n" +
          "Reload now?"
      )
    : true;

  if (!ok) {
    // Restore the dropdown to whatever was saved — don't persist the change.
    chrome.storage.sync.get({ language: DEFAULT_LANG }, ({ language }) => {
      select.value = language;
    });
    setStatus("Cancelled.");
    return;
  }

  chrome.storage.sync.set({ language: next }, () => {
    setStatus("Saved. Reloading…");
    if (onDashboard) chrome.tabs.reload(tab.id);
  });
});

chrome.storage.sync.get(
  { ledgerOptIn: true, ledgerDisclosureSeen: false },
  ({ ledgerOptIn, ledgerDisclosureSeen }) => {
    optinBox.checked = !!ledgerOptIn;
    if (!ledgerDisclosureSeen) disclosure.style.display = "block";
  },
);

optinBox.addEventListener("change", () => {
  chrome.storage.sync.set({ ledgerOptIn: optinBox.checked });
});

disclosureDismiss.addEventListener("click", () => {
  disclosure.style.display = "none";
  chrome.storage.sync.set({ ledgerDisclosureSeen: true });
});

queueLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: chrome.runtime.getURL("queue.html") });
});

feedbackBtn.addEventListener("click", async () => {
  if (!FEEDBACK_FORM_URL) {
    setStatus("Feedback form not configured — see README.");
    return;
  }
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const params = new URLSearchParams({ usp: "pp_url" });
  const langLabel = FORM_LANG_LABEL[language];
  if (langLabel) params.set(FORM_ENTRY.language, langLabel);
  chrome.tabs.create({ url: `${FEEDBACK_FORM_URL}?${params.toString()}` });
});
