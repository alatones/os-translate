const DEFAULT_LANG = "ja";
const DASHBOARD_HOST = "dashboard.onesignal.com";

// TODO: set this to the address that should receive translation feedback.
// Keep it in sync with FEEDBACK_EMAIL in background.js.
const FEEDBACK_EMAIL = "translations@example.com";

const select = document.getElementById("lang");
const status = document.getElementById("status");
const feedbackBtn = document.getElementById("feedback");

function setStatus(msg) {
  status.textContent = msg;
}

chrome.storage.sync.get({ language: DEFAULT_LANG }, ({ language }) => {
  select.value = language;
});

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

feedbackBtn.addEventListener("click", async () => {
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const pageUrl = tab && tab.url && tab.url.includes(DASHBOARD_HOST) ? tab.url : "";

  const subject = `[${language}] Translation feedback`;
  const body = [
    `Language: ${language}`,
    `Page: ${pageUrl || "(not on dashboard)"}`,
    "",
    "What's wrong?",
    "  (e.g. missing translation, wrong nuance, awkward wording, overflow in UI)",
    "",
    "Where on the dashboard?",
    "  (which screen / button / field)",
    "",
    "Suggested fix:",
    "  (your suggestion here)",
  ].join("\n");

  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  // URLSearchParams encodes spaces as '+'. Mail clients need %20 in bodies
  // so line breaks and spacing survive.
  const qs = params.toString().replace(/\+/g, "%20");
  chrome.tabs.create({ url: `mailto:${FEEDBACK_EMAIL}?${qs}` });
});
