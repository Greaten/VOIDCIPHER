var f = require('fs').readFileSync('E:/website/题库/newtype/js/data/transcripts.js', 'utf8');

// The faulty region: after noise2-core-encrypt segment, we have
//         }
//   ]
// },
//   "trans-03": {
// 
// Should be:
//         }
//       ]
//     },
//     { 沈若楠 备注 segment }
//   ]
// },

var bad = `"pinId": "noise2-core-encrypt",
          "pinSource": "P01 · CORE · 第2次会话"
        }
  ]
},
  "trans-03": {`;

var fixed = `"pinId": "noise2-core-encrypt",
          "pinSource": "P01 · CORE · 第2次会话"
        }
      ]
    },
    {
      "label": "[沈若楠 · 备注]",
      "speaker": "doctor",
      "segments": [
        {
          "text": "\\"他能从我的笔迹反推我的情绪状态。不是读心——是分析。这种精度的观察力需要一个完全没有情绪干扰的大脑。CORE不是-没有情绪-——他是把情绪关在了另一个隔间里。\\""
        }
      ]
    }
  ]
},
  "trans-03": {`;

if (f.indexOf(bad) === -1) {
  console.log('Cannot find exact bad block. Dumping region...');
  var idx2 = f.indexOf('noise2-core-encrypt');
  console.log(f.substring(idx2, idx2 + 300));
  process.exit(1);
}

f = f.replace(bad, fixed);
require('fs').writeFileSync('E:/website/题库/newtype/js/data/transcripts.js', f, 'utf8');
console.log('Fixed.');
