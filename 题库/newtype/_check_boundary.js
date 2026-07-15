var f = require('fs').readFileSync('E:/website/题库/newtype/js/data/transcripts.js', 'utf8');
var idx = f.indexOf('noise2-core-encrypt');
console.log('=== around noise2-core-encrypt ===');
console.log(f.substring(idx - 100, idx + 400));
console.log('\n=== boundary trans-02/trans-03 ===');
var t3 = f.indexOf('"trans-03"');
console.log(f.substring(t3 - 200, t3 + 100));
