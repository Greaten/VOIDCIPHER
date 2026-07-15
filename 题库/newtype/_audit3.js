var f = require('fs').readFileSync('E:/website/题库/newtype/js/data/transcripts.js', 'utf8');

// Parse DOCUMENTS keys via regex
var docsMatch = f.match(/const DOCUMENTS\s*=\s*\{([\s\S]*?)\n\};/);
if (!docsMatch) { console.log('FAIL: cannot parse DOCUMENTS'); process.exit(1); }
var docsBody = docsMatch[1];

var allDocIds = [];
var keyRe = /"([^"]+)":\s*\{/g;
var m;
while ((m = keyRe.exec(docsBody)) !== null) {
  allDocIds.push(m[1]);
}

console.log('=== DOCUMENTS ===');
console.log('Total documents:', allDocIds.length);

var persIds = allDocIds.filter(function(id) { return id.startsWith('pers-'); });
var transIds = allDocIds.filter(function(id) { return id.startsWith('trans-'); });
var extIds = allDocIds.filter(function(id) { return id.startsWith('ext-'); });
var medIds = allDocIds.filter(function(id) { return id.startsWith('med-'); });
console.log('  人格档案:', persIds.length, '/ 14');
console.log('  治疗转录:', transIds.length, '/ 23');
console.log('  外部证据:', extIds.length, '/ 8');
console.log('  医疗记录:', medIds.length, '/ 5');

// Check trans coverage
console.log('\n=== 转录覆盖 ===');
var missingTrans = [];
for (var i = 1; i <= 23; i++) {
  var id = 'trans-' + String(i).padStart(2, '0');
  if (!transIds.includes(id)) missingTrans.push(id);
}
if (missingTrans.length === 0) console.log('  全部 23 次配齐 ✅');
else console.log('  MISSING:', missingTrans.join(', '));

// Check ext
var expectedExt = ['ext-fire','ext-surveillance','ext-autopsy','ext-drug','ext-news','ext-personnel','ext-police','ext-timeline'];
var missingExt = expectedExt.filter(function(id) { return !extIds.includes(id); });
if (missingExt.length === 0) console.log('  外部证据 8/8 ✅');
else console.log('  MISSING ext:', missingExt.join(', '));

// Check pers
var missingPers = [];
for (var i = 1; i <= 14; i++) {
  var id = 'pers-' + String(i).padStart(2, '0');
  if (!persIds.includes(id)) missingPers.push(id);
}
if (missingPers.length === 0) console.log('  人格档案 14/14 ✅');
else console.log('  MISSING pers:', missingPers.join(', '));

// Parse CONTRADICTION_RULES
var crMatch = f.match(/const CONTRADICTION_RULES\s*=\s*(\[[\s\S]*?\]);/);
if (crMatch) {
  var rules = eval(crMatch[1]);
  console.log('\n=== pinId 交叉验证 ===');
  
  // Extract pinIds from DOCUMENTS
  var pinIdRe = /"pinId"\s*:\s*"([^"]+)"/g;
  var dataPinIds = [];
  while ((m = pinIdRe.exec(docsBody)) !== null) {
    if (!dataPinIds.includes(m[1])) dataPinIds.push(m[1]);
  }
  console.log('pinIds in DOCUMENTS:', dataPinIds.length);
  
  var rulePinIds = [];
  rules.forEach(function(r) {
    if (r.pair && r.pair !== '_AUTO_') {
      r.pair.split(':').forEach(function(p) { if (!rulePinIds.includes(p)) rulePinIds.push(p); });
    }
  });
  console.log('pinIds in rules:', rulePinIds.length);
  
  var orphans = rulePinIds.filter(function(id) { return !dataPinIds.includes(id); });
  if (orphans.length > 0) console.log('⚠ ORPHANS:', orphans.join(', '));
  else console.log('  全部 pinId 交叉引用有效 ✅');

  // Pair match counts
  console.log('\n=== 矛盾对出现的次数 ===');
  rules.forEach(function(r) {
    if (r.pair === '_AUTO_') { console.log('  ' + r.id + ' [AUTO]'); return; }
    var parts = r.pair.split(':');
    var ca = (f.match(new RegExp(parts[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
    var cb = (f.match(new RegExp(parts[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
    var status = (ca >= 1 && cb >= 1) ? 'ok' : 'FAIL';
    console.log('  ' + r.id + ' ' + status + '  ' + parts[0] + '(' + ca + ') ↔ ' + parts[1] + '(' + cb + ')');
  });
}

// Parse ENDINGS
var em = f.match(/const ENDINGS\s*=\s*(\{[\s\S]*?\n\});/);
if (em) {
  var endings = eval('(' + em[1] + ')');
  console.log('\n=== 结局 ===');
  console.log(Object.keys(endings).length + ' endings: ' + Object.keys(endings).join(', '));
}

// Parse HANDBOOK
var hm = f.match(/const HANDBOOK_TABS\s*=\s*(\[[\s\S]*?\]);/);
if (hm) {
  var hb = eval(hm[1]);
  console.log('Handbook tabs:', hb.length);
}

// Check specific docs have valid type
console.log('\n=== 文档类型抽样 ===');
var typeCheck = ['pers-01','trans-01','trans-15','ext-autopsy','med-drug-log'];
typeCheck.forEach(function(id) {
  var re = new RegExp('"' + id + '"[\\s\\S]*?"type"\\s*:\\s*"([^"]+)"');
  var m = f.match(re);
  if (m) console.log('  ' + id + ': ' + m[1] + ' ✅');
  else console.log('  ' + id + ': NOT FOUND ❌');
});
