// React-safety: mutate only Text nodes' nodeValue and a narrow allowlist of
// user-facing attributes (placeholder, title, aria-label, aria-placeholder,
// alt). Never touch innerHTML, element.textContent, event handlers, or
// structural attributes — React owns those and will clobber us or detach
// event listeners. The allowlist covers placeholders, tooltips, and the ARIA
// surfaces that screen-reader-announced error messages ride on.

(() => {
  const DEFAULT_LANG = "en";
  const SKIP_PARENT_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
  const TRANSLATABLE_ATTRS = [
    "placeholder",
    "title",
    "aria-label",
    "aria-placeholder",
    "aria-description",
    "alt",
  ];

  let dictionaries = {};
  let activeLang = DEFAULT_LANG;
  let lookup = new Map();
  let compiledPatterns = [];
  let observer = null;
  let pendingNodes = new Set();
  let rafId = 0;

  // Missed-string ledger: records English strings the translator couldn't
  // resolve (neither exact-match nor pattern). Kept locally regardless of
  // opt-in; background.js gates whether it leaves the machine.
  const missedSession = new Map();
  // Strings we successfully translated this session — don't re-log them as
  // missed when the MutationObserver fires on our own DOM writes.
  const recentTranslations = new Set();
  const MISSED_SEEN_THRESHOLD = 1;
  const MISSED_FLUSH_DEBOUNCE_MS = 5000;
  const MISSED_MIN_LEN = 3;
  const MISSED_MAX_LEN = 200;
  const MISSED_PII_RE = /@|\/\/|[0-9]{6,}|[A-Za-z0-9+/=]{32,}/;
  const MISSED_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Slash-style timestamps with optional time component: '4/28/26, 4:24:40 PM',
  // '4/28/2026, 4:24:40 PM', plus ISO 8601.
  const MISSED_TIMESTAMP_RE = /^\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d|^\d{4}-\d{2}-\d{2}T\d{2}:/;
  const MISSED_TIMEZONE_RE = /^[A-Z][a-zA-Z_]+\/[A-Z]/;
  const MISSED_COUNTRY_RE = /^[A-Z]{2}$/;
  // Snake_case / kebab customer attribute names: cupon_code, new_user, etc.
  const MISSED_ATTR_NAME_RE = /^[a-z][a-z0-9]*([_-][a-z0-9]+)+$/;
  // IPv6 addresses: 2600:1700:2990:f630:...
  const MISSED_IPV6_RE = /^[0-9a-f]{4}:[0-9a-f]{4}:/i;
  // Markdown link: [text](url)
  const MISSED_MARKDOWN_LINK_RE = /^\[.+\]\(.+\)$/;
  // OS + subscriber count: 'macOS (145)', 'Windows (147)', 'Linux x86_64 (129)'
  const MISSED_OS_COUNT_RE = /^(macOS|Windows|iOS|Android|Linux\b.*)\s*\(\d+\)$/;
  // Day-of-week-prefixed chart labels: 'Mon, Apr 7' AND 'Fri Apr 10 (UTC)'.
  const MISSED_CHART_TOOLTIP_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(,\s|\s\w+\s\d+\s\(UTC\)$)/;
  // Anything starting 'Apr 1, 2026' (full ISO-style date with year) — covers
  // bare dates, 'Apr 1, 2026 - Apr 30, 2026' ranges, 'Apr 23, 2026 1:04 PM'
  // timestamps, and 'Apr 1, 884. Total subscribed.' Highcharts data labels.
  const MISSED_CHART_DATA_RE = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d+,\s\d{2,4}/;
  const MISSED_CHART_META_RE = /^(Line chart with|The chart has \d|Created with Highcharts|Chart\. Highcharts|Toggle series visibility|End of interactive chart\.|Interactive chart$|Empty chart$|.+, line \d+ of \d+ with \d+ data points\.)/;
  const MISSED_FULL_DATE_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}$/;
  // Liquid template syntax leaking through DOM: '{{ user.external_id }}',
  // 'Hi {{ first_name | default: "there" }}', '{% if x %}'.
  const MISSED_LIQUID_RE = /\{\{|\}\}|\{%|%\}/;
  // Device names with parenthetical multi-part version: 'Simulator iPhone
  // (26.2)', 'macOS (26.2)', 'Google emulator (15.4)'. Bare 'X (N)' tab
  // counters are translated by patterns, so anything left ending in
  // '(N.M[.K])' is a UGC device label.
  const MISSED_DEVICE_VERSION_RE = /\s\(\d+(\.\d+)+\)$/;
  // External ID label with appended user-set value: 'External ID: api-jon'.
  const MISSED_EXTERNAL_ID_RE = /^External ID:\s/;
  // Embedded 3rd-party widget chrome we never own and shouldn't track.
  const MISSED_THIRD_PARTY_RE = /^(Intercom|Open Intercom Messenger|_hjSafeContext)$/;
  // Bare OneSignal brand references that show up across many pages
  // (footers, links, version strings) and aren't translatable copy.
  // Compound feature names like "OneSignal AI" / "OneSignal ID" are
  // already in the dictionary so they translate; this only filters
  // exact-match standalone brand mentions.
  const MISSED_ONESIGNAL_BRAND_RE = /^OneSignal(\.com)?$/;
  // SOH separator for composite ledger keys: no UI string will contain it.
  const MISSED_KEY_SEP = "";
  let missedFlushTimer = 0;

  // Chrome MV3 invalidates the extension context when the extension is
  // reloaded (load-unpacked refresh, version bump, browser update). The
  // content script keeps running on already-loaded pages but every chrome.*
  // call throws "Extension context invalidated". Once that happens we
  // disconnect the observer and stop scheduling work — there's no recovery
  // without a page reload.
  function isExtensionAlive() {
    try {
      return Boolean(chrome && chrome.runtime && chrome.runtime.id);
    } catch (e) {
      return false;
    }
  }

  function isContextInvalidatedError(err) {
    return (
      err &&
      typeof err.message === "string" &&
      err.message.includes("Extension context invalidated")
    );
  }

  function teardown() {
    stopObserver();
    if (missedFlushTimer) {
      clearTimeout(missedFlushTimer);
      missedFlushTimer = 0;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    pendingNodes = new Set();
    missedSession.clear();
  }

  function isInsideSkippedSvgZone(el) {
    // True if el is inside an <svg> subtree but outside the Highcharts
    // legend allowlist. Used to skip chart axis labels and per-data-point
    // aria-labels (which re-render on filter/zoom and pollute the ledger
    // with rows like "May 2025, 7. Unsubscribed.") while keeping the
    // legend ("Delivered", "Confirmed receipt", "Clicked", etc.)
    // translatable. The legend is stable — toggling series visibility
    // only changes its text-decoration style, not its text content.
    //
    // - el == <svg> itself: false (let walks descend to find the legend)
    // - el inside .highcharts-legend (or the element itself): false
    // - el inside <svg> but not in the legend: true
    // - el outside any <svg>: false
    if (!el || !el.closest) return false;
    const svg = el.closest("svg");
    if (!svg || svg === el) return false;
    return !el.closest(".highcharts-legend");
  }

  function shouldSkip(textNode) {
    const parent = textNode.parentNode;
    if (!parent || parent.nodeType !== Node.ELEMENT_NODE) return true;
    if (SKIP_PARENT_TAGS.has(parent.tagName)) return true;
    if (parent.isContentEditable) return true;
    if (isInsideSkippedSvgZone(parent)) return true;
    return false;
  }

  function applyPattern(trimmed) {
    for (const { re, template } of compiledPatterns) {
      const m = trimmed.match(re);
      if (m) return template.replace(/\{(\d+)\}/g, (_, i) => m[+i] ?? "");
    }
    return null;
  }

  // Normalize typographic quotes to ASCII before lookup. The dashboard
  // renders curly apostrophes/quotes ('what's ahead', "Hi there") in some
  // copy and straight ones elsewhere — without this, "what's" with U+2019
  // would miss "what's" with U+0027 in the dictionary even though the
  // strings are visually identical.
  function normalizeQuotes(s) {
    return s
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[“”]/g, '"');
  }

  function translateString(raw, context) {
    if (typeof raw !== "string" || !raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const key = normalizeQuotes(trimmed);
    let translated = lookup.get(key);
    if (translated === undefined) translated = applyPattern(key);
    if (translated === undefined || translated === null) {
      // Context (e.g. the source text node) lets trackMissed apply
      // DOM-aware filters — skip ledger reporting for text in the
      // Name column of a table, etc. — without affecting whether we
      // attempt translation at all. Translation is unconditional;
      // ledger reporting is opinionated.
      trackMissed(trimmed, context);
      return null;
    }
    recentTranslations.add(translated);
    const leading = raw.slice(0, raw.indexOf(trimmed));
    const trailing = raw.slice(raw.indexOf(trimmed) + trimmed.length);
    return leading + translated + trailing;
  }

  function couldBeUI(s) {
    if (s.length < MISSED_MIN_LEN || s.length > MISSED_MAX_LEN) return false;
    if (MISSED_PII_RE.test(s)) return false;
    if (MISSED_UUID_RE.test(s)) return false;
    if (MISSED_TIMESTAMP_RE.test(s)) return false;
    if (MISSED_TIMEZONE_RE.test(s)) return false;
    if (MISSED_COUNTRY_RE.test(s)) return false;
    if (MISSED_ATTR_NAME_RE.test(s)) return false;
    if (MISSED_IPV6_RE.test(s)) return false;
    if (MISSED_MARKDOWN_LINK_RE.test(s)) return false;
    if (MISSED_OS_COUNT_RE.test(s)) return false;
    if (MISSED_CHART_TOOLTIP_RE.test(s)) return false;
    if (MISSED_CHART_DATA_RE.test(s)) return false;
    if (MISSED_CHART_META_RE.test(s)) return false;
    if (MISSED_FULL_DATE_RE.test(s)) return false;
    if (MISSED_LIQUID_RE.test(s)) return false;
    if (MISSED_DEVICE_VERSION_RE.test(s)) return false;
    if (MISSED_EXTERNAL_ID_RE.test(s)) return false;
    if (MISSED_THIRD_PARTY_RE.test(s)) return false;
    if (MISSED_ONESIGNAL_BRAND_RE.test(s)) return false;
    if (recentTranslations.has(s)) return false;
    if (/^\d+$/.test(s)) return false;
    if (!/[A-Za-z]/.test(s)) return false;
    return true;
  }

  function onAppSelectorPage() {
    // /apps is the org/app selector — strings there are UGC app names.
    const p = window.location.pathname;
    return p === "/apps" || p === "/apps/";
  }

  function onSuperUserPage() {
    // /super-user/* is the OneSignal-internal admin tool. It's not a
    // customer-facing surface; every text node there is UGC (org names,
    // user emails, account metadata). Skip translation AND ledger
    // reporting entirely on these paths.
    return (window.location.pathname || "").startsWith("/super-user");
  }

  // Headers (English source + active-language translations) that
  // identify a "Name / Title / ID"-style table column whose cells
  // contain user-defined record names. Built per language change.
  // Used by isInNameColumn() to suppress ledger reporting for those
  // cells — translation is still attempted (subtext patterns like
  // "Last Session greater than 168 hours ago" still translate), only
  // the missed-string ledger is filtered.
  const NAME_HEADER_SOURCE_TERMS = ["Name", "Title", "ID", "Identifier", "Labels"];
  let nameColumnHeaders = new Set();
  function buildNameColumnHeaders() {
    const headers = new Set(NAME_HEADER_SOURCE_TERMS);
    for (const term of NAME_HEADER_SOURCE_TERMS) {
      const translated = lookup.get(term);
      if (typeof translated === "string" && translated) {
        headers.add(translated);
      }
    }
    nameColumnHeaders = headers;
  }

  // Per-table cache for "which columns are Name-style?" lookups.
  // A single table can have multiple matching columns — e.g. a Messages
  // table has both "Name" (column 0) and "Labels" (column 1), both
  // dominated by UGC. Computed from <thead> headers on first access.
  // WeakMap so entries release when React unmounts the table.
  const tableNameColumnsCache = new WeakMap();
  function findNameColumnIndices(table) {
    if (!table) return null;
    if (tableNameColumnsCache.has(table)) return tableNameColumnsCache.get(table);
    const indices = new Set();
    const headerRow = table.querySelector("thead tr") || table.querySelector("tr");
    if (headerRow) {
      const cells = headerRow.querySelectorAll("th, td");
      for (let i = 0; i < cells.length; i++) {
        const text = (cells[i].textContent || "").trim();
        if (nameColumnHeaders.has(text)) {
          indices.add(i);
        }
      }
    }
    tableNameColumnsCache.set(table, indices);
    return indices;
  }

  function isInNameColumn(textNode) {
    if (!textNode || !textNode.parentNode) return false;
    // Walk up to the nearest <td> (data cell). <th> headers don't get
    // skipped — we want column headers to translate normally.
    let el = textNode.parentNode;
    while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName !== "TD") {
      if (el.tagName === "TABLE" || el.tagName === "TH") return false;
      el = el.parentNode;
    }
    if (!el || el.tagName !== "TD") return false;
    const cellIdx = el.cellIndex;
    if (typeof cellIdx !== "number" || cellIdx < 0) return false;
    const table = el.closest("table");
    if (!table) return false;
    const indices = findNameColumnIndices(table);
    return !!(indices && indices.has(cellIdx));
  }

  // Page chrome that's overwhelmingly UGC: the breadcrumb trail at the
  // top of every page (org name → app name → section) and the app/
  // account switcher in the top-right (app name + signed-in email).
  // Both render on essentially every page-load and dominate the ledger
  // with the same dozen org/app names per install. Translation isn't
  // suppressed — these are styled-component class prefixes from the
  // OneSignal dashboard, so the closest() match is robust to per-build
  // hash suffix changes.
  const UGC_CHROME_SELECTOR = [
    "[class*='BreadcrumbTrail__']",
    "[class*='BreadcrumbItem__']",
    "[class*='CleanSidebar__AppSwitcher']",
    "[class*='AppAccountDropdown']",
  ].join(",");
  function isInUgcChrome(textNode) {
    const parent = textNode && textNode.parentNode;
    if (!parent || !parent.closest) return false;
    return !!parent.closest(UGC_CHROME_SELECTOR);
  }

  // Filter-value picker dropdowns (Label is, Tag is, etc.) show options
  // sourced from the user's account data — UGC. The dashboard renders
  // them with react-select, and when the menu opens it portals away from
  // the popover, so we can't reach the popover via closest(). We use the
  // shared instance number `N` to walk back: the listbox `react-select-N
  // -listbox` and the input `react-select-N-input` share `N`, even when
  // portaled. From the input we walk up looking for a <label>, then check
  // its text against an explicit allowlist of UGC-picker label patterns.
  // Operator / match-mode / identifier / status filters don't have these
  // labels, so they keep reporting normally.
  //
  // To extend: add new patterns when new UGC-picker labels surface in the
  // ledger ("Tag is", "Country is", "Labels (0/10)" etc.).
  const UGC_VALUE_PICKER_LABEL_SOURCES = [
    /^Label is$/,
    /^Labels \(\d+\/\d+\)$/,
  ];
  // Source-text strings for which we'll also include the active-language
  // translations (so the rule works when the dashboard label is rendered
  // in Korean / Chinese / etc.).
  const UGC_VALUE_PICKER_LABEL_TRANSLATABLE_SOURCES = [
    { kind: "exact", source: "Label is" },
    // For "Labels (N/M)", the "Labels" word translates; the (N/M) suffix
    // stays the same. Build the regex at language-change time using
    // the active-language translation of "Labels".
    { kind: "counter-prefix", source: "Labels" },
  ];
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  let ugcValuePickerLabelPatterns = [];
  function buildUgcValuePickerLabelPatterns() {
    const patterns = UGC_VALUE_PICKER_LABEL_SOURCES.slice();
    for (const entry of UGC_VALUE_PICKER_LABEL_TRANSLATABLE_SOURCES) {
      const translated = lookup.get(entry.source);
      if (typeof translated !== "string" || !translated) continue;
      if (entry.kind === "exact") {
        patterns.push(new RegExp("^" + escapeRegex(translated) + "$"));
      } else if (entry.kind === "counter-prefix") {
        patterns.push(
          new RegExp("^" + escapeRegex(translated) + " \\(\\d+/\\d+\\)$"),
        );
      }
    }
    ugcValuePickerLabelPatterns = patterns;
  }
  function isInUgcValuePicker(textNode) {
    const parent = textNode && textNode.parentNode;
    if (!parent || !parent.closest) return false;
    const listbox = parent.closest(
      "[id^='react-select-'][id$='-listbox']",
    );
    if (!listbox) return false;
    const m = listbox.id.match(/^react-select-(\d+)-listbox$/);
    if (!m) return false;
    const input = document.getElementById("react-select-" + m[1] + "-input");
    if (!input) return false;
    let el = input.parentElement;
    for (let i = 0; i < 6 && el; i++) {
      const label = el.querySelector("label");
      if (label) {
        const text = (label.textContent || "").trim();
        return ugcValuePickerLabelPatterns.some((re) => re.test(text));
      }
      el = el.parentElement;
    }
    return false;
  }

  function pathKey() {
    // Collapse long hex/uuid-shaped segments to ":id" so we never send a
    // full app ID or resource ID to the ledger. Pathname only — no query,
    // no hash, no host.
    return (window.location.pathname || "/").replace(
      /\/[A-Za-z0-9_-]{16,}/g,
      "/:id",
    );
  }

  function trackMissed(s, context) {
    if (onAppSelectorPage()) return;
    if (onSuperUserPage()) return;
    if (!couldBeUI(s)) return;
    // Skip ledger reporting (but not translation) for cells in the
    // "Name / Title / ID / Label"-style identifier column of any
    // table — those cells are dominated by user-generated record
    // names. Subtext patterns like "User Tag X is activated" still
    // translate because translation is gated separately upstream.
    if (context && context.textNode && isInNameColumn(context.textNode)) return;
    // Skip ledger reporting for the breadcrumb trail and app/account
    // switcher chrome — both render on every page-load and surface
    // org/app names + emails over and over.
    if (context && context.textNode && isInUgcChrome(context.textNode)) return;
    // Skip ledger reporting for options inside filter-value picker
    // dropdowns ("Label is", "Labels (0/5)", etc.) — those show
    // user-defined values from the account.
    if (context && context.textNode && isInUgcValuePicker(context.textNode)) return;
    const next = (missedSession.get(s) || 0) + 1;
    missedSession.set(s, next);
    if (next < MISSED_SEEN_THRESHOLD) return;
    if (!missedFlushTimer) {
      missedFlushTimer = setTimeout(flushMissed, MISSED_FLUSH_DEBOUNCE_MS);
    }
  }

  function flushMissed() {
    missedFlushTimer = 0;
    if (!isExtensionAlive()) return teardown();
    const promote = [];
    for (const [s, count] of missedSession.entries()) {
      if (count >= MISSED_SEEN_THRESHOLD) promote.push([s, count]);
    }
    if (promote.length === 0) return;
    const path = pathKey();
    try {
      chrome.storage.local.get({ ledger: {} }, (out) => {
        if (!isExtensionAlive()) return teardown();
        const ledger = out.ledger || {};
        for (const [s, count] of promote) {
          const key = [activeLang, path, s].join(MISSED_KEY_SEP);
          ledger[key] = (ledger[key] || 0) + count;
          missedSession.delete(s);
        }
        try {
          chrome.storage.local.set({ ledger });
        } catch (err) {
          if (isContextInvalidatedError(err)) return teardown();
          throw err;
        }
      });
    } catch (err) {
      if (isContextInvalidatedError(err)) return teardown();
      throw err;
    }
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    if (onSuperUserPage()) return;
    // Skip SVG-attribute translation outside the highcharts-legend zone.
    // Per-data-point aria-labels are accessibility metadata, not real UI.
    if (isInsideSkippedSvgZone(el)) return;
    for (const attr of TRANSLATABLE_ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const next = translateString(el.getAttribute(attr));
      if (next !== null && el.getAttribute(attr) !== next) {
        el.setAttribute(attr, next);
      }
    }
  }

  function walkAttributes(root) {
    if (!root) return;
    if (onSuperUserPage()) return;
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    // One querySelectorAll per subtree is cheaper than a TreeWalker for
    // element-only traversal, and React's updates are usually shallow.
    const selector = TRANSLATABLE_ATTRS.map((a) => `[${a}]`).join(",");
    const els = root.querySelectorAll(selector);
    for (const el of els) translateAttributes(el);
  }

  function translateTextNode(node) {
    if (shouldSkip(node)) return;
    const next = translateString(node.nodeValue, { textNode: node });
    if (next !== null && node.nodeValue !== next) node.nodeValue = next;
  }

  function walk(root) {
    if (!root) return;
    if (onSuperUserPage()) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    // Skip subtrees rooted inside an <svg> but outside the legend.
    // The <svg> element itself is allowed through so we descend into it
    // looking for the legend group; the TreeWalker's shouldSkip filter
    // will reject the non-legend text nodes leaf-by-leaf.
    if (root.nodeType === Node.ELEMENT_NODE && isInsideSkippedSvgZone(root)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (shouldSkip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    let n;
    while ((n = walker.nextNode())) translateTextNode(n);
    walkAttributes(root);
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
    compiledPatterns = [];
    const translations = (dictionaries && dictionaries.translations) || {};
    // Shape: { "<English term>": { "<lang code>": "<translated>" } }
    // Missing codes fall through silently — that term stays in English.
    for (const [englishTerm, perLang] of Object.entries(translations)) {
      if (!perLang || typeof perLang !== "object") continue;
      const translated = perLang[activeLang];
      if (typeof translated === "string" && translated) {
        lookup.set(englishTerm, translated);
      }
    }
    const patterns = (dictionaries && dictionaries.patterns) || [];
    for (const p of patterns) {
      if (!p || typeof p.match !== "string") continue;
      const template = p.translations && p.translations[activeLang];
      if (typeof template !== "string" || !template) continue;
      try {
        compiledPatterns.push({ re: new RegExp(p.match), template });
      } catch (err) {
        console.warn("[OS Translate] bad pattern:", p.match, err);
      }
    }
  }

  function startObserver() {
    if (observer) observer.disconnect();
    if (lookup.size === 0 && compiledPatterns.length === 0) return; // English / empty dictionary: do nothing.
    observer = new MutationObserver((mutations) => {
      if (!isExtensionAlive()) return teardown();
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => schedule(n));
        } else if (m.type === "characterData") {
          schedule(m.target);
        } else if (m.type === "attributes") {
          // React re-rendered an element with a fresh placeholder/title/etc.
          // Re-translate just this element; don't re-walk the whole subtree.
          if (m.target && m.target.nodeType === Node.ELEMENT_NODE) {
            translateAttributes(m.target);
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRS,
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
    buildNameColumnHeaders();
    buildUgcValuePickerLabelPatterns();
    if (lookup.size === 0 && compiledPatterns.length === 0) {
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
    const data = await res.json();
    if (!data || typeof data.translations !== "object") {
      throw new Error("languages.json missing translations object");
    }
    dictionaries = data;
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
      console.warn("[OS Translate] init failed:", err);
    }
  })();
})();
