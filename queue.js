const KEY_SEP = "\x01";

const entriesEl = document.getElementById("entries");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("send-now");
const clearBtn = document.getElementById("clear");

function setStatus(msg) {
  statusEl.textContent = msg;
}

// Ledger storage entries are either bare numbers (pre-1.6) or
// { count, role, classChain } objects (1.6+). Normalize for display.
function ledgerEntryParts(value) {
  if (typeof value === "number") return { count: value, role: "", classChain: "" };
  if (value && typeof value === "object") {
    return {
      count: typeof value.count === "number" ? value.count : 0,
      role: value.role || "",
      classChain: value.classChain || "",
    };
  }
  return { count: 0, role: "", classChain: "" };
}

function groupByLangPath(ledger) {
  const groups = new Map();
  for (const [key, value] of Object.entries(ledger || {})) {
    const parts = key.split(KEY_SEP);
    if (parts.length !== 3) continue;
    const [lang, path, string] = parts;
    const { count, role, classChain } = ledgerEntryParts(value);
    if (count <= 0) continue;
    const groupKey = `${lang} — ${path || "/"}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push({ string, count, role, classChain });
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
