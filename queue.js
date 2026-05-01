const KEY_SEP = "\x01";

const entriesEl = document.getElementById("entries");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("send-now");
const clearBtn = document.getElementById("clear");

function setStatus(msg) {
  statusEl.textContent = msg;
}

function groupByLangPath(ledger) {
  const groups = new Map();
  for (const [key, count] of Object.entries(ledger || {})) {
    const parts = key.split(KEY_SEP);
    if (parts.length !== 3) continue;
    const [lang, path, string] = parts;
    const groupKey = `${lang} — ${path || "/"}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push({ string, count });
  }
  for (const arr of groups.values()) arr.sort((a, b) => b.count - a.count);
  return groups;
}

function render(ledger) {
  while (entriesEl.firstChild) entriesEl.removeChild(entriesEl.firstChild);
  const groups = groupByLangPath(ledger);
  if (groups.size === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Nothing queued yet.";
    entriesEl.appendChild(empty);
    return;
  }
  const sortedGroups = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [label, items] of sortedGroups) {
    const group = document.createElement("div");
    group.className = "group";
    const h2 = document.createElement("h2");
    h2.textContent = label;
    group.appendChild(h2);
    for (const { string, count } of items) {
      const row = document.createElement("div");
      row.className = "row";
      const left = document.createElement("div");
      left.textContent = string;
      const right = document.createElement("div");
      right.className = "count";
      right.textContent = String(count);
      row.appendChild(left);
      row.appendChild(right);
      group.appendChild(row);
    }
    entriesEl.appendChild(group);
  }
}

function refresh() {
  chrome.storage.local.get({ ledger: {} }, ({ ledger }) => render(ledger));
}

sendBtn.addEventListener("click", () => {
  setStatus("Sending…");
  chrome.runtime.sendMessage({ type: "flush-ledger-now" }, (resp) => {
    if (chrome.runtime.lastError) {
      setStatus("Couldn't reach the service worker — check extension reload.");
      return;
    }
    setStatus(resp && resp.ok ? "Sent." : "Send attempted (see console).");
    refresh();
  });
});

clearBtn.addEventListener("click", () => {
  if (!confirm("Clear the local queue? Anything not yet sent will be lost.")) return;
  chrome.storage.local.set({ ledger: {} }, () => {
    setStatus("Queue cleared.");
    refresh();
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.ledger) render(changes.ledger.newValue || {});
});

refresh();
