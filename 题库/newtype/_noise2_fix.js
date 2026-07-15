var f = require('fs').readFileSync('E:/website/题库/newtype/js/data/transcripts.js', 'utf8');

// Find trans-02 and add noise2-core-encrypt pinId to CORE's line about labeling
// Target: CORE says "我不擅长隐瞒。在脑子里把东西加密——那才是我的工作。"
// Actually let me find the right spot first
var idx = f.indexOf('"trans-02"');
console.log('trans-02 at:', idx);

// Let me extract just the trans-02 block
var block = f.substring(idx, idx + 1500);
console.log(block);
