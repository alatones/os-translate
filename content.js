// React-safety: only mutate Text nodes' nodeValue. Never touch innerHTML,
// element.textContent, or attributes — React owns those and will clobber us
// or detach event listeners.

(() => {
  const DEFAULT_LANG = "jp";
  const SKIP_PARENT_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"]);

  let dictionaries = {};
  let activeLang = DEFAULT_LANG;
  let lookup = new Map();
  let observer = null;
  let pendingNodes = new Set();
  let rafId = 0;

  function shouldSkip(textNode) {
    const parent = textNode.parentNode;
    if (!parent || parent.nodeType !== Node.ELEMENT_NODE) return true;
    if (SKIP_PARENT_TAGS.has(parent.tagName)) return true;
    if (parent.isContentEditable) return true;
    return false;
  }

  function translateTextNode(node) {
    if (shouldSkip(node)) return;
    const raw = node.nodeValue;
    if (!raw) return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const hit = lookup.get(trimmed);
    if (hit === undefined) return;
    // Preserve leading/trailing whitespace so React-inserted spacing survives.
    const leading = raw.slice(0, raw.indexOf(trimmed));
    const trailing = raw.slice(raw.indexOf(trimmed) + trimmed.length);
    const next = leading + hit + trailing;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (shouldSkip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    let n;
    while ((n = walker.nextNode())) translateTextNode(n);
  }

  function flushPending() {
    rafId = 0;
    const nodes = pendingNodes;
    pendingNodes = new Set();
    nodes.forEach(walk);
  }

  function schedule(node) {
    pendingNodes.add(node);
    if (!rafId) rafId = requestAnimationFrame(flushPending);
  }

  function buildLookup() {
    lookup = new Map();
    const dict = dictionaries[activeLang] || {};
    // Skip sentinel keys used for placeholder language entries.
    for (const [k, v] of Object.entries(dict)) {
      if (k.startsWith("_")) continue;
      if (typeof v !== "string" || !v) continue;
      lookup.set(k, v);
    }
  }

  function startObserver() {
    if (observer) observer.disconnect();
    if (lookup.size === 0) return; // English / empty dictionary: do nothing.
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => schedule(n));
        } else if (m.type === "characterData") {
          schedule(m.target);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function applyLanguage(lang) {
    activeLang = lang || DEFAULT_LANG;
    buildLookup();
    if (lookup.size === 0) {
      // Passthrough mode (English/none). Leave the DOM alone — a full page
      // reload from the popup restores original copy.
      stopObserver();
      return;
    }
    walk(document.body);
    startObserver();
  }

  async function loadDictionaries() {
    const url = chrome.runtime.getURL("languages.json");
    const res = await fetch(url);
    dictionaries = await res.json();
  }

  function readLang() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ language: DEFAULT_LANG }, (out) => resolve(out.language));
    });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes.language) return;
    applyLanguage(changes.language.newValue);
  });

  (async () => {
    try {
      await loadDictionaries();
      const lang = await readLang();
      applyLanguage(lang);
    } catch (err) {
      console.warn("[OneSignal Translator] init failed:", err);
    }
  })();
})();
