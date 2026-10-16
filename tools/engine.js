// Loads the real translation engine out of content.js so tooling exercises
// exactly the code that ships — no browser, no copy of the logic to drift.
//
// Pulls the lookup/normalization/pattern/filter functions and every
// MISSED_* filter constant straight from content.js source, then runs them
// against languages.json. If content.js grows a new dependency these
// functions rely on, loading fails loudly with a ReferenceError — update
// the harness below rather than working around it.
//
// Not simulated: DOM-context ledger filters (Name-column cells, UGC
// chrome, SVG zones, live regions). Those only affect ledger reporting,
// never whether a string translates.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LANGS = ["ja", "es", "pt", "ko", "fr", "tr", "zh-CN", "zh-TW", "id", "ms"];
const FUNCTIONS = [
  "applyPattern",
  "normalizeQuotes",
  "normalizeKey",
  "isCaseFoldable",
  "translateString",
  "couldBeUI",
  "buildLookup",
];

function grabFunction(src, name) {
  const re = new RegExp(`  function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n  \\}\\n`);
  const m = src.match(re);
  if (!m) throw new Error(`content.js: function ${name}() not found`);
  return m[0];
}

function loadEngine(root = ROOT) {
  const src = fs.readFileSync(path.join(root, "content.js"), "utf8");
  const dicts = JSON.parse(fs.readFileSync(path.join(root, "languages.json"), "utf8"));
  const consts = [...src.matchAll(/  const (MISSED_[A-Z0-9_]+) = (.+);\n/g)]
    .map((m) => `const ${m[1]} = ${m[2]};`)
    .join("\n");
  const body = `
    ${consts}
    let dictionaries = DICTS;
    let activeLang = "en";
    let lookup = new Map();
    let lookupCaseFolded = new Map();
    let compiledPatterns = [];
    const recentTranslations = new Set();
    const missed = [];
    function trackMissed(s) { if (couldBeUI(s)) missed.push(s); }
    ${FUNCTIONS.map((f) => grabFunction(src, f)).join("\n")}
    return {
      setLang(lang) { activeLang = lang; buildLookup(); },
      translate(s) {
        missed.length = 0;
        const result = translateString(s);
        return { result, logged: missed.length > 0 };
      },
      couldBeUI,
    };`;
  const engine = new Function("DICTS", body)(dicts);
  return { ...engine, dicts, LANGS };
}

module.exports = { loadEngine, LANGS, ROOT };
