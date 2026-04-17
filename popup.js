const DEFAULT_LANG = "jp";
const DASHBOARD_HOST = "dashboard.onesignal.com";

const select = document.getElementById("lang");
const status = document.getElementById("status");

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
