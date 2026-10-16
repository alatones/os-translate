#!/usr/bin/env node
// Triage the missed-string ledger rollup against the CURRENT code.
//
// Usage:
//   node tools/triage.js <rollup> [--min-installs N] [--version X.Y.Z]
//
// <rollup> is the ledger_rollup pivot, either as the JSON a Sheets
// values.get call returns ({"values": [[...], ...]}, or the bare array) or
// as TSV with the pivot's header row. Columns are found by header name:
//   extensionVersion | string | SUM of count | COUNTUNIQUE of installId |
//   COUNTUNIQUE of path | MAX of timestamp
// Blank extensionVersion cells inherit the row above (pivot layout), and the
// "Grand Total" row is ignored. Defaults: latest version present, 2+ installs.
//
// Every string is run through the real engine (tools/engine.js) in all
// languages, so rows the current code already handles are separated out.
// That includes backlog rows. Before 1.13.3 the extension stamped a batch
// with the version installed when it was SENT, so the first batch after an
// update could carry strings the previous version missed. 1.13.3+ records
// the version that saw each string.

const fs = require("fs");
const { loadEngine, LANGS } = require("./engine");

function parseArgs(argv) {
  const opts = { minInstalls: 2, version: null, file: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--min-installs") opts.minInstalls = Number(argv[++i]);
    else if (argv[i] === "--version") opts.version = argv[++i];
    else opts.file = argv[i];
  }
  if (!opts.file) {
    console.error("usage: node tools/triage.js <rollup.json|rollup.tsv> [--min-installs N] [--version X.Y.Z]");
    process.exit(2);
  }
  return opts;
}

function readRows(file) {
  const text = fs.readFileSync(file, "utf8");
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.values;
  }
  return trimmed.split("\n").map((line) => line.split("\t"));
}

function toRecords(rows) {
  const header = rows[0].map((h) => String(h).trim());
  const col = (name) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`rollup is missing the "${name}" column`);
    return i;
  };
  const c = {
    version: col("extensionVersion"),
    string: col("string"),
    count: col("SUM of count"),
    installs: col("COUNTUNIQUE of installId"),
    paths: col("COUNTUNIQUE of path"),
    last: col("MAX of timestamp"),
  };
  const records = [];
  let version = "";
  for (const row of rows.slice(1)) {
    const v = String(row[c.version] || "").trim();
    if (v === "Grand Total") continue;
    if (v) version = v;
    const string = String(row[c.string] || "");
    if (!string.trim()) continue;
    records.push({
      version,
      string,
      count: Number(row[c.count]) || 0,
      installs: Number(row[c.installs]) || 0,
      paths: Number(row[c.paths]) || 0,
      last: row[c.last] || "",
    });
  }
  return records;
}

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

// Light hints for the reviewer. They never decide anything on their own.
function hintFor(s, dictKeysLower) {
  const hints = [];
  if (/^[a-z]/.test(s)) {
    const cap = s[0].toUpperCase() + s.slice(1);
    if (dictKeysLower.has(cap.toLowerCase())) hints.push(`lowercase twin of "${dictKeysLower.get(cap.toLowerCase())}"`);
    else hints.push("lowercase start: fragment?");
  }
  if (/\b(PRD|PROD|QA|DSV|STG|DEV|EXCLUIR)\b/i.test(s)) hints.push("looks like an app/env name (UGC)");
  if (/^(.+) (settings|Apps)$/.test(s) && !dictKeysLower.has(s.toLowerCase())) hints.push("org heading: '<org name> settings/Apps' (UGC)");
  if (/\d/.test(s)) hints.push("has digits: pattern?");
  if (/, [A-Z][a-z]+$/.test(s)) hints.push("ends in a name: pattern?");
  return hints.join("; ");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const records = toRecords(readRows(opts.file));
  if (!records.length) {
    console.log("Ledger rollup is empty: nothing to review.");
    return;
  }
  const versions = [...new Set(records.map((r) => r.version))].sort(compareVersions);
  const version = opts.version || versions[versions.length - 1];
  const inVersion = records.filter((r) => r.version === version);
  const candidates = inVersion
    .filter((r) => r.installs >= opts.minInstalls)
    .sort((a, b) => b.installs - a.installs || b.paths - a.paths || b.count - a.count);

  const engine = loadEngine();
  const dictKeysLower = new Map(Object.keys(engine.dicts.translations).map((k) => [k.toLowerCase(), k]));
  const handled = [];
  const open = [];
  for (const r of candidates) {
    const translatedIn = [];
    let logged = false;
    for (const lang of LANGS) {
      engine.setLang(lang);
      const out = engine.translate(r.string);
      if (out.result !== null) translatedIn.push(lang);
      else if (out.logged) logged = true;
    }
    if (translatedIn.length === LANGS.length) handled.push({ ...r, how: "translated" });
    else if (translatedIn.length > 0) open.push({ ...r, status: `PARTIAL (missing ${LANGS.filter((l) => !translatedIn.includes(l)).join(",")})` });
    else if (!logged) handled.push({ ...r, how: "filtered" });
    else open.push({ ...r, status: "OPEN", hint: hintFor(r.string, dictKeysLower) });
  }

  const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  console.log(`# Ledger triage: version ${version}`);
  console.log("");
  console.log(`- Versions in sheet: ${versions.join(", ")}`);
  console.log(`- Strings in ${version}: ${inVersion.length}. With ${opts.minInstalls}+ installs: ${candidates.length}.`);
  console.log(`- Already handled by current code: ${handled.length}. Needs a decision: ${open.length}.`);
  console.log("");
  console.log("## Needs a decision");
  console.log("");
  if (!open.length) console.log("_None._");
  else {
    console.log("| Installs | Paths | Count | Last seen | String | Status | Hint |");
    console.log("|---:|---:|---:|---|---|---|---|");
    for (const r of open) {
      console.log(`| ${r.installs} | ${r.paths} | ${r.count} | ${r.last} | ${cell(r.string)} | ${r.status} | ${cell(r.hint || "")} |`);
    }
  }
  console.log("");
  console.log("## Already handled by current code (backlog or fixed since)");
  console.log("");
  if (!handled.length) console.log("_None._");
  else for (const r of handled) console.log(`- ${cell(r.string)} (${r.installs} installs, ${r.how})`);
}

main();
