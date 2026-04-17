// Service worker: registers a context-menu item on the OneSignal dashboard
// so users can right-click any translated string and open a pre-filled
// GitHub issue suggesting a better translation. Also handles the popup's
// generic "Report a translation issue" button via chrome.tabs.create.

const REPO = "alatones/translate-os";
const ISSUE_BASE = `https://github.com/${REPO}/issues/new`;
const MENU_ID = "suggest-translation";
const DEFAULT_LANG = "ja";

function buildIssueUrl({ title, body, labels = ["translation"] }) {
  const params = new URLSearchParams();
  params.set("title", title);
  params.set("body", body);
  params.set("labels", labels.join(","));
  return `${ISSUE_BASE}?${params.toString()}`;
}

function selectionIssueBody({ language, pageUrl, selected }) {
  return [
    `**Language:** \`${language}\``,
    `**Page:** ${pageUrl || "(not captured)"}`,
    "",
    "**Original English string (if known):**",
    "",
    "> _leave blank if unsure_",
    "",
    "**Currently translated as:**",
    "",
    `> ${selected}`,
    "",
    "**Suggested translation:**",
    "",
    "> _your suggestion here_",
    "",
    "**Notes / context:**",
    "",
    "_screenshot, where on the dashboard, tone, etc._",
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
  const title = `[${language}] Translation suggestion: "${selected.slice(0, 60)}"`;
  const body = selectionIssueBody({
    language,
    pageUrl: info.pageUrl || (tab && tab.url) || "",
    selected,
  });
  chrome.tabs.create({ url: buildIssueUrl({ title, body }) });
});
