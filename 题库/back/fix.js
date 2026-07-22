const fs = require('fs');
let h = fs.readFileSync('E:/back/index.html', 'utf-8');

// Fix 1: 被跟踪 in chat - try different anchor text
const c5start = h.indexOf('case005:');
const c5end = h.indexOf('}; // end CASES', c5start);
let c5 = h.substring(c5start, c5end);

// Find the chat section
const chatIdx = c5.indexOf('chat() { return `');
const chatStart = chatIdx + 'chat() { return `'.length;
let chatEnd = chatStart;
for (let i = chatStart; i < c5.length; i++) {
  if (c5[i] === '`' && c5[i-1] !== '\\' && c5.substring(i+1, i+4) === '; }') {
    chatEnd = i; break;
  }
}
let chatTpl = c5.substring(chatStart, chatEnd);

// Insert 被跟踪 conversation after the 7月15日 section
const anchor = '张工</span><span class="c-time">10:45</span></div><div class="c-body">……你确定要继续查下去吗？</div>';
if (chatTpl.includes(anchor)) {
  const insert = `</div>
<div class="chat-section-label" style="margin-top: 16px;">7月18日</div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">李卫国</span><span class="c-time">19:30</span></div><div class="c-body">@张工 有个事。这两天回家路上总感觉有辆车跟着我。白色面包车，连续两天了。可能是我想多了</div></div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">张工</span><span class="c-time">19:32</span></div><div class="c-body">你确定？什么牌子的车？车牌号记得吗？</div></div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">李卫国</span><span class="c-time">19:33</span></div><div class="c-body">没看清车牌。不过\${C('r11','被跟踪')}的感觉确实不太好。我明天换条路走</div></div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">张工</span><span class="c-time">19:35</span></div><div class="c-body">要不要我陪你走几天？或者直接报保卫处</div></div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">李卫国</span><span class="c-time">19:36</span></div><div class="c-body">暂时不用。应该没事。可能就是普通车辆巧合</div></div>
<div class="chat-msg"><div class="c-header"><span class="c-sender">张工</span><span class="c-time">10:45</span></div><div class="c-body">……你确定要继续查下去吗？</div>`;
  chatTpl = chatTpl.replace(anchor, insert);
  console.log('✓ Added 被跟踪 to chat');
} else {
  console.log('✗ Chat anchor not found');
  // Try simpler anchor
  if (chatTpl.includes('10:45')) {
    console.log('  Found 10:45 at index', chatTpl.indexOf('10:45'));
  }
}

// Fix 2: 增额保险+竞业协议 in HR
const hrIdx = c5.indexOf('hr() { return `');
const hrStart = hrIdx + 'hr() { return `'.length;
let hrEnd = hrStart;
for (let i = hrStart; i < c5.length; i++) {
  if (c5[i] === '`' && c5[i-1] !== '\\' && c5.substring(i+1, i+4) === '; }') {
    hrEnd = i; break;
  }
}
let hrTpl = c5.substring(hrStart, hrEnd);

const hrAnchor = '离职申请';
if (hrTpl.includes(hrAnchor)) {
  const hrInsert = `离职申请</span></div><div class="hr-row"><span>保险</span><span class="hr-val" style="color:var(--accent);">\${C('r8','增额保险')}200万 · 3月生效 · 受益人妻子</span></div><div class="hr-row"><span>法律</span><span class="hr-val" style="color:var(--accent);">\${C('r12','竞业协议')}纠纷 · 前雇主曾发律师函`;
  // Find the exact pattern: ${C('r4','离职申请')}方向
  const pattern = "\\${C('r4','离职申请')}方向";
  if (hrTpl.includes(pattern)) {
    hrTpl = hrTpl.replace(pattern, pattern + hrInsert);
    console.log('✓ Added 增额保险+竞业协议 to HR');
  } else {
    // Try the raw text
    const rawPat = "${C('r4','离职申请')}方向";
    if (hrTpl.includes(rawPat)) {
      hrTpl = hrTpl.replace(rawPat, rawPat + hrInsert);
      console.log('✓ Added 增额保险+竞业协议 to HR (raw)');
    } else {
      console.log('✗ Exact pattern not found in HR');
    }
  }
} else {
  console.log('✗ HR anchor not found');
}

// Reconstruct case005
c5 = c5.substring(0, chatStart) + chatTpl + c5.substring(chatEnd);
// Re-find HR after chat modification shifted positions
const hrIdx2 = c5.indexOf('hr() { return `');
const hrStart2 = hrIdx2 + 'hr() { return `'.length;
let hrEnd2 = hrStart2;
for (let i = hrStart2; i < c5.length; i++) {
  if (c5[i] === '`' && c5[i-1] !== '\\' && c5.substring(i+1, i+4) === '; }') {
    hrEnd2 = i; break;
  }
}
c5 = c5.substring(0, hrStart2) + hrTpl + c5.substring(hrEnd2);

h = h.substring(0, c5start) + c5 + h.substring(c5end);
fs.writeFileSync('E:/back/index.html', h);
console.log('Final size:', h.length);
