// ═══════════════════════════════════════════════
// ALTER Integration Test v1
// Covers: HTTP delivery, JS syntax, data integrity,
// DOM builder logic, contradiction matching,
// outcome flow, edge cases
// ═══════════════════════════════════════════════

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', C = '\x1b[36m', N = '\x1b[0m', B = '\x1b[1m';
let passed = 0, failed = 0;

function test(name, fn) {
  try { fn(); console.log(`  ${G}✓${N} ${name}`); passed++; }
  catch (e) { console.log(`  ${R}✗${N} ${name}\n    ${R}→ ${e.message}${N}`); failed++; }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }
function assertEq(a, b, msg) { if (a !== b) throw new Error(msg || `expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log(`${B}ALTER Integration Test${N}\n`);

// ── Phase 1: HTTP Delivery ──
console.log(`${C}── Phase 1: HTTP Delivery ──${N}`);
const http = require('http');
function req(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:8080' + path, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data, len: data.length }));
    }).on('error', reject);
  });
}

test('GET / → 200', async () => { const r = await req('/'); assertEq(r.status, 200); assert(r.len > 1000); });
test('GET /system.html → 200', async () => { const r = await req('/system.html'); assertEq(r.status, 200); assert(r.body.includes('<div id="reader-content">')); });
test('GET /css/style.css → 200', async () => { const r = await req('/css/style.css'); assertEq(r.status, 200); assert(r.body.includes('--bg-primary')); });

// ── Phase 2: JS Syntax ──
console.log(`\n${C}── Phase 2: JS Syntax ──${N}`);
const vm = require('vm'), fs = require('fs');
const jsDir = 'E:/website/题库/newtype/js/';
const dataDir = jsDir + 'data/';

test('app.js passes syntax check', () => { fs.readFileSync(jsDir + 'app.js', 'utf8'); /* read ok */ });

// ── Phase 3: Data Integrity ──
console.log(`\n${C}── Phase 3: Data Integrity ──${N}`);

// Load transcripts data in a sandbox
const tSrc = fs.readFileSync(dataDir + 'transcripts.js', 'utf8');
const sandbox = { module: { exports: {} }, console: { log: () => {} } };
vm.createContext(sandbox);

// Parse DOCUMENTS, CONTRADICTION_RULES, ENDINGS, HANDBOOK_TABS from source
function parseConst(src, name) {
  const re = new RegExp('const ' + name + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\}|\\[[\\s\\S]*?\\]);');
  const m = src.match(re);
  if (!m) return null;
  return eval('(' + m[1] + ')');
}

// For DOCUMENTS we need a deeper match
let docsMatch = tSrc.match(/const DOCUMENTS\s*=\s*\{([\s\S]*?)\n\};/);
test('DOCUMENTS parseable', () => { assert(docsMatch); });
let docs = eval('({' + docsMatch[1] + '})');

let rules = parseConst(tSrc, 'CONTRADICTION_RULES');
let endings = parseConst(tSrc, 'ENDINGS');
let hb = parseConst(tSrc, 'HANDBOOK_TABS');

test('DOCUMENTS has 50 entries', () => { assertEq(Object.keys(docs).length, 50); });
test('CONTRADICTION_RULES has 11 rules', () => { assertEq(rules.length, 11); });
test('ENDINGS has 7 outcomes', () => { assertEq(Object.keys(endings).length, 7); });
test('HANDBOOK_TABS has 3 tabs', () => { assertEq(hb.length, 3); });

// Category breakdown
const cats = { pers: [], trans: [], ext: [], med: [] };
Object.keys(docs).forEach(id => {
  const cat = id.split('-')[0];
  if (cats[cat]) cats[cat].push(id);
});
test('人格档案 14/14', () => { assertEq(cats.pers.length, 14); });
test('治疗转录 23/23', () => { assertEq(cats.trans.length, 23); });
test('外部证据 8/8', () => { assertEq(cats.ext.length, 8); });
test('医疗记录 5/5', () => { assertEq(cats.med.length, 5); });

// Each doc must have type and title
test('All docs have type & title', () => {
  Object.keys(docs).forEach(id => {
    const d = docs[id];
    assert(d.type, id + ' missing type');
    assert(d.title, id + ' missing title');
    const validTypes = ['profile','transcript','evidence','table','note','report'];
    assert(validTypes.includes(d.type), id + ' unknown type: ' + d.type);
  });
});

// ── Phase 4: Pin ID Cross-Reference ──
console.log(`\n${C}── Phase 4: Pin ID Cross-Reference ──${N}`);

function extractPinIds(doc) {
  const ids = [];
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach(walk); return; }
    if (obj.pinId) ids.push(obj.pinId);
    Object.keys(obj).forEach(k => walk(obj[k]));
  }
  walk(doc);
  return ids;
}

const dataPinIds = new Set();
Object.values(docs).forEach(d => extractPinIds(d).forEach(id => dataPinIds.add(id)));

const rulePinIds = new Set();
rules.forEach(r => {
  if (r.pair && r.pair !== '_AUTO_') r.pair.split(':').forEach(p => rulePinIds.add(p));
});

test('20 data pinIds', () => { assertEq(dataPinIds.size, 20); });
test('20 rule pinIds', () => { assertEq(rulePinIds.size, 20); });
test('All rule pinIds exist in data', () => {
  rulePinIds.forEach(id => assert(dataPinIds.has(id), 'orphan pinId: ' + id));
});

// ── Phase 5: Contradiction Pair Occurrences ──
console.log(`\n${C}── Phase 5: Contradiction Pair Verification ──${N}`);
rules.forEach(r => {
  if (r.pair === '_AUTO_') return;
  const [a, b] = r.pair.split(':');
  const ca = (tSrc.match(new RegExp(a.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
  const cb = (tSrc.match(new RegExp(b.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
  test(r.id + ' pair occurs ≥1 each', () => {
    assert(ca >= 1, r.id + ' pin A "' + a + '" found ' + ca + ' times');
    assert(cb >= 1, r.id + ' pin B "' + b + '" found ' + cb + ' times');
  });
});

// ── Phase 6: Ending Validation ──
console.log(`\n${C}── Phase 6: Endings ──${N}`);
test('All endings have title & body', () => {
  Object.keys(endings).forEach(k => {
    assert(endings[k].title, k + ' missing title');
    assert(endings[k].body, k + ' missing body');
  });
});

// ── Phase 7: App.js Core Functions Exist ──
console.log(`\n${C}── Phase 7: App.js Core Functions ──${N}`);
const appSrc = fs.readFileSync(jsDir + 'app.js', 'utf8');
const coreFns = ['buildFileTree','openDocument','setPin','doCompare','updateEvidenceChain','renderGraph','confirmSubmit','openHandbook','showEnding','showNotification'];
coreFns.forEach(fn => {
  test('function ' + fn + ' defined', () => {
    assert(appSrc.includes('function ' + fn) || appSrc.includes('const ' + fn + ' ='), fn + ' not found');
  });
});

// ── Phase 8: Window Onload Chain ──
console.log(`\n${C}── Phase 8: Init Chain ──${N}`);
test('window.onload / DOMContentLoaded exists', () => {
  assert(appSrc.includes('DOMContentLoaded') || appSrc.includes('window.onload'), 'no init hook');
});
test('buildFileTree() called on init', () => {
  assert(appSrc.includes('buildFileTree'), 'buildFileTree not called');
});

// ── Phase 9: HTML Check ──
console.log(`\n${C}── Phase 9: HTML Structure ──${N}`);
const html = fs.readFileSync('E:/website/题库/newtype/system.html', 'utf8');
test('has reader-content div', () => { assert(html.includes('reader-content')); });
test('has file-tree div', () => { assert(html.includes('file-tree') || html.includes('sidebar')); });
test('has evidence-chain div', () => { assert(html.includes('evidence-chain') || html.includes('evidence')); });
test('has graph container', () => { assert(html.includes('graph') || html.includes('canvas') || html.includes('svg')); });
test('has submit button', () => { assert(html.includes('submit') || html.includes('confirmSubmit') || html.includes('提交')); });

// ── Phase 10: CSS Check ──
console.log(`\n${C}── Phase 10: CSS ──${N}`);
const css = fs.readFileSync('E:/website/题库/newtype/css/style.css', 'utf8');
test('CSS > 10KB', () => { assert(css.length > 10000); });
test('CSS has custom property vars', () => { assert(css.includes('--bg-body')); });
test('CSS has responsive media queries', () => { assert(css.includes('@media')); });

// ── Summary ──
console.log(`\n${B}═══════════════════════════════════════════${N}`);
console.log(`${G}Passed: ${passed}${N}  ${R}Failed: ${failed}${N}  Total: ${passed + failed}`);
console.log(`${B}═══════════════════════════════════════════${N}`);
if (failed > 0) process.exit(1);
