// Service worker: registers a context-menu item on the OneSignal dashboard
// so users can right-click any translated string and open a pre-filled
// email suggesting a better translation. Also handles the popup's generic
// "Report a translation issue" button via chrome.tabs.create.

// TODO: set this to the address that should receive translation feedback.
// Keep it in sync with FEEDBACK_EMAIL in popup.js.
const FEEDBACK_EMAIL = "translations@example.com";

const MENU_ID = "suggest-translation";
const DEFAULT_LANG = "ja";

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
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Suggest a better translation for "%s"',
    contexts: ["selection"],
    documentUrlPatterns: ["https://dashboard.onesignal.com/*"],
  });
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
