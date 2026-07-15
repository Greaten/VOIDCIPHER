/**
 * ALTER — 精神科电子病历系统
 * app.js — UI 渲染 + 高亮/钉选交互 + 状态管理
 */

// ═══════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════
const STATE = {
  assessor: '...',
  loginTime: null,
  unlockedContradictions: [],  // ['P1','P2',...]
  readFiles: [],               // 已读文件 ID
  pinA: null,                  // { fileId, text, source }
  pinB: null,
  currentDoc: null,
  submitted: false,
  ending: null,
};

// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Auth check
  if (!localStorage.getItem('alter_auth')) {
    window.location.href = 'index.html';
    return;
  }

  // Restore state
  STATE.assessor = localStorage.getItem('alter_assessor') || '未知';
  STATE.loginTime = localStorage.getItem('alter_login_time') || new Date().toISOString();
  const saved = localStorage.getItem('alter_state');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      STATE.unlockedContradictions = s.unlockedContradictions || [];
      STATE.readFiles = s.readFiles || [];
      STATE.submitted = s.submitted || false;
      STATE.ending = s.ending || null;
    } catch(e) { /* ignore corrupt state */ }
  }

  document.getElementById('assessorBadge').textContent = `评估员: ${STATE.assessor}`;

  // If already submitted, show ending
  if (STATE.submitted && STATE.ending) {
    showEnding(STATE.ending);
  }

  // Build UI
  buildFileTree();
  updateProgress();
  updateEvidenceChain();
  renderGraph();
  updateSubmitButton();
  updatePinDisplay(true);
  updatePinDisplay(false);

  // Handle clicking on document text (event delegation)
  document.getElementById('readerContent').addEventListener('click', (e) => {
    const hl = e.target.closest('.highlightable');
    if (!hl) return;

    // Toggle selection
    if (hl.classList.contains('selected')) {
      hl.classList.remove('selected');
    } else {
      // Deselect all others in reader
      document.querySelectorAll('.highlightable.selected').forEach(el => el.classList.remove('selected'));
      hl.classList.add('selected');
    }
  });

  // Save state before unload
  window.addEventListener('beforeunload', () => saveState());
});

function saveState() {
  localStorage.setItem('alter_state', JSON.stringify({
    unlockedContradictions: STATE.unlockedContradictions,
    readFiles: STATE.readFiles,
    submitted: STATE.submitted,
    ending: STATE.ending,
  }));
}

// ═══════════════════════════════════════
//  FILE TREE
// ═══════════════════════════════════════
function buildFileTree() {
  const tree = document.getElementById('fileTree');
  tree.innerHTML = '';

  // Section: 人格档案
  const persSection = createTreeSection('人格档案', 'personality', true);
  const persNames = [
    'P01 · CORE', 'P02 · THE PROTECTOR', 'P03 · THE SOLDIER',
    'P04 · THE CHILD', 'P05 · THE WITNESS', 'P06 · THE GHOST',
    'P07 · THE SILENT ONE', 'P08 · HOST', 'P09 · THE JOURNALIST',
    'P10 · THE CRITIC', 'P11 · THE ARTIST', 'P12 · THE WHISPER',
    'P13 · THE ANALYST', 'P14 · THE SLEEPER'
  ];
  persNames.forEach((name, i) => {
    const id = `pers-${String(i+1).padStart(2,'0')}`;
    persSection.items.push({ id, label: name, icon: '🧠' });
  });
  persSection.add();
  tree.appendChild(persSection.el);

  // Section: 治疗转录
  const transSection = createTreeSection('治疗转录', 'transcript', true);
  for (let i = 1; i <= 23; i++) {
    transSection.items.push({
      id: `trans-${String(i).padStart(2,'0')}`,
      label: `第 ${i} 次会话`,
      icon: '📝'
    });
  }
  transSection.add();
  tree.appendChild(transSection.el);

  // Section: 外部证据
  const extSection = createTreeSection('外部证据', 'external', false);
  const externalFiles = [
    { id: 'ext-fire', label: '火灾调查报告', icon: '🔥' },
    { id: 'ext-surveillance', label: '物业监控记录', icon: '📹' },
    { id: 'ext-autopsy', label: '苏景州尸检报告', icon: '⚰️' },
    { id: 'ext-drug', label: '国家药监数据查询', icon: '💊' },
    { id: 'ext-news', label: '辰星制药新闻汇集', icon: '📰' },
    { id: 'ext-personnel', label: '三院人事档案', icon: '👤' },
    { id: 'ext-police', label: '警方现场报告', icon: '🚔' },
    { id: 'ext-timeline', label: '事件时间线', icon: '⏱' },
  ];
  externalFiles.forEach(f => extSection.items.push(f));
  extSection.add();
  tree.appendChild(extSection.el);

  // Section: 医疗记录
  const medSection = createTreeSection('医疗记录', 'medical', false);
  const medFiles = [
    { id: 'med-drug-log', label: '给药日志 2024.01-07', icon: '💉' },
    { id: 'med-nursing', label: '护理记录', icon: '📋' },
    { id: 'med-schedule', label: '护理排班表', icon: '🗓' },
    { id: 'med-transfer', label: '转科记录 2021.09', icon: '🔄' },
    { id: 'med-shen-note', label: '沈若楠离职便签', icon: '🔒' },
  ];
  medFiles.forEach(f => medSection.items.push(f));
  medSection.add();
  tree.appendChild(medSection.el);
}

function createTreeSection(title, sectionClass, startOpen) {
  const el = document.createElement('div');
  el.className = 'tree-section';

  const header = document.createElement('div');
  header.className = 'tree-section-header';
  header.innerHTML = `<span class="arrow${startOpen ? ' open' : ''}">▶</span> ${title}`;
  header.onclick = function() {
    const arrow = this.querySelector('.arrow');
    const items = this.nextElementSibling;
    arrow.classList.toggle('open');
    items.classList.toggle('open');
  };

  const items = document.createElement('div');
  items.className = 'tree-items' + (startOpen ? ' open' : '');

  el.appendChild(header);
  el.appendChild(items);

  const sectionItems = [];
  return {
    el,
    items: sectionItems,
    add: function() {
      items.innerHTML = '';
      sectionItems.forEach(si => {
        const div = document.createElement('div');
        div.className = 'tree-item';
        div.dataset.fileId = si.id;
        if (STATE.readFiles.includes(si.id)) div.classList.add('read');
        if (STATE.currentDoc === si.id) div.classList.add('active');
        div.innerHTML = `<span class="item-icon">${si.icon}</span><span class="item-label">${si.label}</span>`;
        div.onclick = () => openDocument(si.id, si.label);
        items.appendChild(div);
      });
    }
  };
}

// Re-render tree after data update
function refreshTree() {
  document.querySelectorAll('.tree-item').forEach(el => {
    const id = el.dataset.fileId;
    if (id) {
      if (STATE.readFiles.includes(id)) el.classList.add('read');
      if (STATE.currentDoc === id) el.classList.add('active');
      else el.classList.remove('active');
    }
  });
}

// ═══════════════════════════════════════
//  DOCUMENT VIEWER
// ═══════════════════════════════════════
function openDocument(fileId, label) {
  STATE.currentDoc = fileId;
  markRead(fileId);

  const titleEl = document.getElementById('docTitle');
  const metaEl = document.getElementById('docMeta');
  const contentEl = document.getElementById('readerContent');

  const doc = getDocumentContent(fileId);
  if (!doc) {
    contentEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#57606a;flex-direction:column;gap:16px;">
      <div style="font-size:40px;opacity:0.6;">📭</div>
      <div style="font-size:14px;font-weight:500;">这份档案不在了</div>
      <div style="font-size:11px;color:#8b949e;max-width:280px;text-align:center;line-height:1.7;">
        ${getMissingDocHint(fileId)}
      </div>
    </div>`;
    titleEl.textContent = label;
    metaEl.textContent = '';
    refreshTree();
    return;
  }

  titleEl.textContent = doc.title || label;
  metaEl.textContent = doc.meta || '';

  // Render document with highlightable spans
  let html = '';
  if (doc.type === 'transcript') {
    // 治疗转录格式
    html += `<h2>${doc.title}</h2>`;
    html += `<div class="meta-line">${doc.meta || ''}</div>`;
    doc.lines.forEach(line => {
      html += `<div class="transcript-line">`;
      html += `<span class="speaker ${line.speaker === 'patient' ? 'patient' : 'doctor'}">${line.label}</span>`;
      html += `<span class="content">`;
      line.segments.forEach(seg => {
        if (seg.highlightable) {
          html += `<span class="highlightable" data-pin-id="${seg.pinId || ''}" data-pin-source="${seg.pinSource || ''}" data-pin-text="${escapeHtml(seg.text)}">${seg.text}</span>`;
        } else {
          html += escapeHtml(seg.text);
        }
      });
      html += `</span></div>`;
    });
  } else if (doc.type === 'profile') {
    // 人格档案格式
    html += `<h2>${doc.title}</h2>`;
    html += `<div class="meta-line">${doc.meta || ''}</div>`;
    doc.sections.forEach(sec => {
      html += `<h3>${sec.heading}</h3>`;
      sec.paragraphs.forEach(p => {
        html += `<p>`;
        p.segments.forEach(seg => {
          if (seg.highlightable) {
            html += `<span class="highlightable" data-pin-id="${seg.pinId || ''}" data-pin-source="${seg.pinSource || ''}" data-pin-text="${escapeHtml(seg.text)}">${seg.text}</span>`;
          } else {
            html += escapeHtml(seg.text);
          }
        });
        html += `</p>`;
      });
    });
  } else if (doc.type === 'evidence') {
    // 外部证据格式
    html += `<h2>${doc.title}</h2>`;
    html += `<div class="meta-line">${doc.meta || ''}</div>`;
    doc.sections.forEach(sec => {
      html += `<h3>${sec.heading}</h3>`;
      sec.paragraphs.forEach(p => {
        html += `<p>`;
        p.segments.forEach(seg => {
          if (seg.highlightable) {
            html += `<span class="highlightable" data-pin-id="${seg.pinId || ''}" data-pin-source="${seg.pinSource || ''}" data-pin-text="${escapeHtml(seg.text)}">${seg.text}</span>`;
          } else {
            html += escapeHtml(seg.text);
          }
        });
        html += `</p>`;
      });
    });
  } else if (doc.type === 'table') {
    // 表格类文档
    html += `<h2>${doc.title}</h2>`;
    html += `<div class="meta-line">${doc.meta || ''}</div>`;
    html += `<table class="evidence-table"><thead><tr>`;
    doc.headers.forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;
    doc.rows.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => {
        html += `<td>`;
        if (typeof cell === 'object' && cell.segments) {
          cell.segments.forEach(seg => {
            if (seg.highlightable) {
              html += `<span class="highlightable" data-pin-id="${seg.pinId || ''}" data-pin-source="${seg.pinSource || ''}" data-pin-text="${escapeHtml(seg.text)}">${seg.text}</span>`;
            } else {
              html += escapeHtml(seg.text);
            }
          });
        } else {
          html += escapeHtml(String(cell));
        }
        html += `</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  }

  contentEl.innerHTML = html;
  contentEl.scrollTop = 0;
  refreshTree();
}

function getMissingDocHint(fileId) {
  const hints = {
    'pers': '这份人格档案的内容已从系统中移除。沈若楠在离职前删除了部分原始记录——她说"留下的够了，删掉的是多余的噪音。"',
    'trans': '这次会话的录音转录未能恢复。可能是磁带老化，也可能是有人手动删过。系统日志里有一条 2024.07.14 凌晨的删除记录。',
    'ext': '这份外部证据未被上传到系统。沈若楠的备注："原件在档案室 3 号柜。如果你进得去的话。"',
    'med': '这条医疗记录的电子档案已被锁定。权限不足——需要主任级别以上的密钥。'
  };
  for (var prefix in hints) {
    if (fileId.startsWith(prefix)) return hints[prefix];
  }
  return '这份档案无法读取。也许它本来就不该在这里。';
}

function markRead(fileId) {
  if (!STATE.readFiles.includes(fileId)) {
    STATE.readFiles.push(fileId);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════
//  PIN SYSTEM
// ═══════════════════════════════════════
document.addEventListener('dblclick', (e) => {
  const hl = e.target.closest('.highlightable');
  if (!hl) return;

  const pinId = hl.dataset.pinId;
  const pinSource = hl.dataset.pinSource;
  const pinText = hl.dataset.pinText;
  if (!pinId || !pinText) return;

  // Determine which slot to fill
  if (!STATE.pinA || STATE.pinA === null) {
    setPin('A', { fileId: STATE.currentDoc, text: pinText, source: pinSource, pinId });
    showNotification(`已钉选到槽 A · ${pinSource}`);
  } else if (!STATE.pinB || STATE.pinB === null) {
    setPin('B', { fileId: STATE.currentDoc, text: pinText, source: pinSource, pinId });
    showNotification(`已钉选到槽 B · ${pinSource}`);
  } else {
    // Both full — overwrite A (least recent)
    setPin('A', { fileId: STATE.currentDoc, text: pinText, source: pinSource, pinId });
    showNotification(`已替换槽 A · ${pinSource}`);
  }

  // Visual highlight on the pinned text
  hl.style.outline = '2px solid var(--accent)';
  hl.style.outlineOffset = '2px';
  setTimeout(() => { hl.style.outline = ''; }, 1500);
});

function setPin(slot, data) {
  if (slot === 'A') STATE.pinA = data;
  else STATE.pinB = data;
  updatePinDisplay(slot === 'A');
  updateCompareButton();
}

function clearSlot(slot) {
  if (slot === 'A') {
    if (STATE.pinA) {
      STATE.pinA = null;
      updatePinDisplay(true);
      updateCompareButton();
    }
  } else {
    if (STATE.pinB) {
      STATE.pinB = null;
      updatePinDisplay(false);
      updateCompareButton();
    }
  }
}

function updatePinDisplay(isA) {
  const slot = document.getElementById(isA ? 'pinSlotA' : 'pinSlotB');
  const text = document.getElementById(isA ? 'slotAText' : 'slotBText');
  const data = isA ? STATE.pinA : STATE.pinB;

  if (data) {
    slot.classList.add('filled');
    text.innerHTML = `<span class="slot-source">${data.source}</span> <span class="slot-text">${escapeHtml(data.text.length > 50 ? data.text.slice(0,50)+'...' : data.text)}</span>`;
    // Add remove button
    if (!slot.querySelector('.slot-remove')) {
      const btn = document.createElement('span');
      btn.className = 'slot-remove';
      btn.textContent = '×';
      btn.onclick = (e) => { e.stopPropagation(); clearSlot(isA ? 'A' : 'B'); };
      slot.appendChild(btn);
    }
  } else {
    slot.classList.remove('filled');
    text.innerHTML = `<span style="color:var(--text-muted)">${isA ? '从文档中选择一段文字' : '从另一份文档中选择文字'}</span>`;
    const btn = slot.querySelector('.slot-remove');
    if (btn) btn.remove();
  }
}

function updateCompareButton() {
  const btn = document.getElementById('btnCompare');
  btn.disabled = !(STATE.pinA && STATE.pinB);
}

// ═══════════════════════════════════════
//  COMPARE ENGINE
// ═══════════════════════════════════════
function doCompare() {
  if (!STATE.pinA || !STATE.pinB) return;

  const pair = [STATE.pinA.pinId, STATE.pinB.pinId].sort().join(':');

  // Check against known contradictions
  const match = CONTRADICTION_RULES.find(r => r.pair === pair);

  const resultEl = document.getElementById('compareResult');

  if (match) {
    // Check if already unlocked
    if (STATE.unlockedContradictions.includes(match.id)) {
      resultEl.innerHTML = `<div class="contradiction-card" style="opacity:0.6">
        <div class="cc-label">矛盾已发现</div>
        <div class="cc-title">${match.id} · ${match.title}</div>
        <div class="cc-detail">此矛盾已解锁。查看证据链了解更多。</div>
      </div>`;
      return;
    }

    // Unlock!
    STATE.unlockedContradictions.push(match.id);

    // P8 auto-unlock: if P1-P7 are all unlocked, auto-trigger P8
    const p1to7 = ['P1','P2','P3','P4','P5','P6','P7'];
    if (p1to7.every(p => STATE.unlockedContradictions.includes(p)) && !STATE.unlockedContradictions.includes('P8')) {
      STATE.unlockedContradictions.push('P8');
      const p8 = CONTRADICTION_RULES.find(r => r.id === 'P8');
      if (p8) {
        // Inject a P8 card below
        const p8card = document.createElement('div');
        p8card.className = 'contradiction-card';
        p8card.style.marginTop = '8px';
        p8card.innerHTML = `<div class="cc-label">🔓 原初觉醒</div><div class="cc-title">${p8.id} · ${p8.title}</div><div class="cc-detail">${p8.detail}</div>`;
        document.getElementById('compareResult').appendChild(p8card);
        showNotification('🔓 P8 · 原初的碎片 — 所有矛盾已解锁');
      }
    }

    saveState();

    resultEl.innerHTML = `<div class="contradiction-card">
      <div class="cc-label">🔓 新矛盾已解锁</div>
      <div class="cc-title">${match.id} · ${match.title}</div>
      <div class="cc-detail">${match.detail}</div>
    </div>`;

    // Play sound effect? Not yet.
    updateProgress();
    updateEvidenceChain();
    renderGraph();
    updateSubmitButton();

    // Clear pins
    STATE.pinA = null;
    STATE.pinB = null;
    updatePinDisplay(true);
    updatePinDisplay(false);
    updateCompareButton();

    showNotification(`🔓 ${match.id} — ${match.title}`);

  } else {
    // No match — subtle narrative hint
    resultEl.innerHTML = `<div style="padding:10px;background:#f6f8fa;border-radius:4px;margin-top:8px;font-size:11px;color:var(--text-muted);text-align:center;">这两段对不上。试试别的。</div>`;

    // Auto-clear after 2 seconds
    setTimeout(() => { if (resultEl.children.length > 0 && resultEl.querySelector(':not(.contradiction-card)')) resultEl.innerHTML = ''; }, 2500);
  }
}

// ═══════════════════════════════════════
//  PROGRESS & EVIDENCE CHAIN
// ═══════════════════════════════════════
function updateProgress() {
  const count = STATE.unlockedContradictions.length;
  const pct = Math.round((count / 8) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = count + '/8';
}

function updateEvidenceChain() {
  for (let i = 1; i <= 8; i++) {
    const node = document.getElementById('ecP' + i);
    if (!node) continue;
    if (STATE.unlockedContradictions.includes('P' + i)) {
      node.classList.add('unlocked');
      node.title = CONTRADICTION_RULES.find(r => r.id === 'P'+i)?.title || node.title;
    }
  }
  // Arrows between unlocked
  document.querySelectorAll('.ec-arrow').forEach((arrow, idx) => {
    // Simple: if both adjacent nodes in a row are unlocked, activate arrow
    const row = arrow.closest('.evidence-chain-row');
    if (!row) return;
    const nodes = row.querySelectorAll('.ec-node');
    const arrows = row.querySelectorAll('.ec-arrow');
    arrows.forEach((a, ai) => {
      const prev = nodes[ai];
      const next = nodes[ai + 1];
      if (prev && next && prev.classList.contains('unlocked') && next.classList.contains('unlocked')) {
        a.classList.add('active');
      }
    });
  });
}

// ═══════════════════════════════════════
//  GRAPH (Simple SVG version)
// ═══════════════════════════════════════
function renderGraph() {
  const svg = document.getElementById('graphSvg');
  const placeholder = document.getElementById('graphPlaceholder');

  const unlocked = STATE.unlockedContradictions.length;
  if (unlocked === 0) {
    placeholder.style.display = 'flex';
    svg.style.display = 'none';
    return;
  }

  placeholder.style.display = 'none';
  svg.style.display = 'block';

  // Simple circle layout — 14 nodes in a ring
  const cx = 170, cy = 100, r = 75;
  const nodeR = 9;
  const names = [
    'CORE','PROT','SOLD','CHILD','WITN','GHOST','SILNT',
    'HOST','JOURN','CRIT','ARTIST','WHISP','ANALY','SLEEP'
  ];

  let html = '';

  // Draw connections based on unlocked contradictions
  const connections = getGraphConnections();
  connections.forEach(conn => {
    const a = conn[0], b = conn[1];
    const angleA = (a / 14) * Math.PI * 2 - Math.PI / 2;
    const angleB = (b / 14) * Math.PI * 2 - Math.PI / 2;
    const ax = cx + r * Math.cos(angleA);
    const ay = cy + r * Math.sin(angleA);
    const bx = cx + r * Math.cos(angleB);
    const by = cy + r * Math.sin(angleB);
    html += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${conn[2] || '#d97706'}" stroke-width="1.5" stroke-dasharray="${conn[3] || 'none'}" opacity="0.7"/>`;
  });

  // Draw center node if P8 unlocked
  if (STATE.unlockedContradictions.includes('P8')) {
    html += `<circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#b45309" stroke-width="2"/>`;
    html += `<text x="${cx}" y="${cy}" text-anchor="middle" dy="0.35em" font-size="8" fill="#b45309" font-weight="700">陆时砚</text>`;
  }

  // Draw nodes
  names.forEach((name, i) => {
    const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const isActive = isNodeActive(i);
    const fill = isActive ? '#d97706' : '#d0d7de';
    html += `<circle cx="${x}" cy="${y}" r="${nodeR}" fill="${fill}" stroke="#fff" stroke-width="1.5"/>`;
    html += `<text x="${x}" y="${y - 12}" text-anchor="middle" font-size="7" fill="#57606a" font-weight="${isActive ? '700' : '400'}">${name}</text>`;
  });

  svg.innerHTML = html;
}

function getGraphConnections() {
  const conns = [];
  if (STATE.unlockedContradictions.includes('P1')) {
    conns.push([0, 7, '#d97706', '4']);  // CORE-HOST
    conns.push([0, 8, '#d97706', '4']);  // CORE-JOURNALIST
    conns.push([7, 8, '#d97706', '4']);  // HOST-JOURNALIST
  }
  if (STATE.unlockedContradictions.includes('P2')) {
    conns.push([3, 5, '#c0392b', '4']);  // CHILD-GHOST
    conns.push([3, 6, '#c0392b', '4']);  // CHILD-SILNT
  }
  if (STATE.unlockedContradictions.includes('P3')) {
    conns.push([9, 12, '#92400e', 'none']);  // CRIT-ANALYST
  }
  if (STATE.unlockedContradictions.includes('P4')) {
    conns.push([5, 6, '#1a7f4b', 'none']);  // GHOST-SILNT
  }
  if (STATE.unlockedContradictions.includes('P5')) {
    conns.push([1, 0, '#c0392b', 'none']);  // PROT-CORE
    conns.push([1, 4, '#c0392b', 'none']);  // PROT-WITN
    conns.push([0, 4, '#92400e', 'none']);  // CORE-WITN
  }
  if (STATE.unlockedContradictions.includes('P6')) {
    conns.push([10, 13, '#3b6b8a', 'none']); // ARTIST-SLEEP
  }
  if (STATE.unlockedContradictions.includes('P7')) {
    conns.push([11, 12, '#92400e', 'none']); // WHISP-ANALYST
  }
  return conns;
}

function isNodeActive(idx) {
  // Determine if a personality node should be highlighted based on unlocked contradictions
  const activeNodes = new Set();
  const u = STATE.unlockedContradictions;
  if (u.includes('P1')) { activeNodes.add(0); activeNodes.add(7); activeNodes.add(8); }
  if (u.includes('P2')) { activeNodes.add(3); activeNodes.add(5); activeNodes.add(6); }
  if (u.includes('P3')) { activeNodes.add(9); activeNodes.add(12); }
  if (u.includes('P4')) { activeNodes.add(5); activeNodes.add(6); }
  if (u.includes('P5')) { activeNodes.add(1); activeNodes.add(0); activeNodes.add(4); }
  if (u.includes('P6')) { activeNodes.add(10); activeNodes.add(13); }
  if (u.includes('P7')) { activeNodes.add(11); activeNodes.add(12); }
  if (u.includes('P8')) { for (let i = 0; i < 14; i++) activeNodes.add(i); }
  return activeNodes.has(idx);
}

// ═══════════════════════════════════════
//  SUBMIT SYSTEM
// ═══════════════════════════════════════
function updateSubmitButton() {
  const btn = document.getElementById('btnSubmit');
  btn.disabled = STATE.submitted;
  if (STATE.submitted) {
    btn.textContent = '评估报告已提交';
  }
}

function openSubmitModal() {
  if (STATE.submitted) return;
  const modal = document.getElementById('submitModal');
  const ecStatus = document.getElementById('submitEcStatus');
  const sel = document.getElementById('submitConclusion');

  const unlocked = STATE.unlockedContradictions;
  ecStatus.innerHTML = unlocked.length > 0
    ? unlocked.map(p => `<span style="background:#fef3c7;padding:2px 8px;border-radius:4px;margin:2px;display:inline-block;font-size:11px;">✅ ${p}</span>`).join(' ')
    : '⚠ 尚未解锁任何矛盾。提交无证据的报告将导致"归档"结局。';

  // Show/hide option E
  const hasP7 = unlocked.includes('P7');
  sel.options[5].style.display = hasP7 ? '' : 'none';

  modal.style.display = 'flex';
}

function closeSubmitModal() {
  document.getElementById('submitModal').style.display = 'none';
}

function confirmSubmit() {
  const sel = document.getElementById('submitConclusion');
  const conclusion = sel.value;
  if (!conclusion) { showNotification('请先选择评估结论'); return; }

  const unlocked = STATE.unlockedContradictions;
  let ending;

  // Ending logic (simplified — mirrors GDD)
  if (conclusion === 'A') {
    ending = 'A';
  } else if (conclusion === 'B') {
    ending = unlocked.includes('P7') ? 'B' : 'B';
  } else if (conclusion === 'C') {
    ending = 'C';
  } else if (conclusion === 'D') {
    ending = unlocked.includes('P8') ? 'D' : 'C';
  } else if (conclusion === 'E') {
    ending = unlocked.includes('P7') ? 'E' : 'A';
  } else if (conclusion === 'F') {
    ending = 'F';
  } else {
    ending = 'A';
  }

  STATE.submitted = true;
  STATE.ending = ending;
  saveState();

  document.getElementById('submitModal').style.display = 'none';
  showEnding(ending);
  updateSubmitButton();
}

function showEnding(ending) {
  const endings = ENDINGS[ending] || ENDINGS['A'];
  document.getElementById('endingTitle').textContent = endings.title;
  document.getElementById('endingBody').innerHTML = endings.body;
  document.getElementById('endingModal').style.display = 'flex';
}

// ═══════════════════════════════════════
//  HANDBOOK
// ═══════════════════════════════════════
function openHandbook() {
  document.getElementById('handbookOverlay').style.display = 'flex';
  switchHandbookTab(0);
}
function switchHandbookTab(idx) {
  document.querySelectorAll('.handbook-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  document.getElementById('handbookBody').innerHTML = HANDBOOK_TABS[idx] || '内容待录入';
}

// ═══════════════════════════════════════
//  NOTIFICATION
// ═══════════════════════════════════════
function showNotification(msg) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s';
    setTimeout(() => { el.style.display = 'none'; el.style.transition = ''; }, 500);
  }, 2500);
}

// ═══════════════════════════════════════
//  LOGOUT
// ═══════════════════════════════════════
function handleLogout() {
  saveState();
  localStorage.removeItem('alter_auth');
  window.location.href = 'index.html';
}
