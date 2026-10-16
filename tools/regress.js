#!/usr/bin/env node
// Regression check: every dictionary key, in every language, must still
// resolve to its own translation through the real engine (tools/engine.js).
// Catches engine changes that make one entry shadow another, and keys that
// silently stop matching.
//
// Usage: node tools/regress.js       (exit 1 on any mismatch)

const { loadEngine, LANGS } = require("./engine");

const engine = loadEngine();
const translations = engine.dicts.translations;
let checked = 0;
const mismatches = [];
for (const lang of LANGS) {
  engine.setLang(lang);
  for (const [key, perLang] of Object.entries(translations)) {
    const value = perLang && perLang[lang];
    if (!value || !key.trim()) continue;
    checked++;
    const { result } = engine.translate(key);
    // translateString keeps the source's surrounding whitespace.
    const expected = key.replace(key.trim(), value);
    if (result !== expected) mismatches.push({ lang, key, result, expected });
  }
}

for (const m of mismatches.slice(0, 20)) {
  console.log(`MISMATCH ${m.lang} ${JSON.stringify(m.key)} -> ${JSON.stringify(m.result)} (expected ${JSON.stringify(m.expected)})`);
}
if (mismatches.length > 20) console.log(`... and ${mismatches.length - 20} more`);
console.log(`Regression: ${checked} key/language pairs checked, ${mismatches.length} mismatch(es).`);
process.exit(mismatches.length ? 1 : 0);
