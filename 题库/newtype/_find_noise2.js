var f = require('fs').readFileSync('E:/website/题库/newtype/js/data/transcripts.js', 'utf8');
var idx = f.indexOf('"trans-02"');
console.log(f.substring(idx, idx + 900));
