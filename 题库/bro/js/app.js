/**
 * 「写给你的信」— 主逻辑
 * 功能机解密游戏
 */

// ========== 全局状态 ==========
const STATE = {
  unlocked: false,
  currentApp: null,
  currentView: null,
  solvedPasswords: {},
  readMessages: new Set(),
  openedPhotos: new Set(),
  openedMemos: new Set(),
  openedFiles: new Set(),
  endingTriggered: false
};

// 锁屏密码：孩子生日 0915
const LOCK_PASSWORD = '0915';

// ========== DOM 元素 ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c这不是你的手机。', 'color:#cc3333;font-size:14px;font-weight:bold;');
  console.log('%c「写给你的信」· 网页解密游戏', 'color:#aaa;font-style:italic;');
  
  loadState();
  initLockScreen();
  updateLockTime();
  setInterval(updateLockTime, 1000);
});

// ========== 状态持久化 ==========
function saveState() {
  const save = {
    unlocked: STATE.unlocked,
    solvedPasswords: STATE.solvedPasswords,
    readMessages: [...STATE.readMessages],
    openedPhotos: [...STATE.openedPhotos],
    openedMemos: [...STATE.openedMemos],
    openedFiles: [...STATE.openedFiles],
    endingTriggered: STATE.endingTriggered
  };
  try { localStorage.setItem('bro_save', JSON.stringify(save)); } catch(e) {}
}

function loadState() {
  try {
    const save = JSON.parse(localStorage.getItem('bro_save'));
    if (!save) return;
    STATE.unlocked = save.unlocked || false;
    STATE.solvedPasswords = save.solvedPasswords || {};
    STATE.readMessages = new Set(save.readMessages || []);
    STATE.openedPhotos = new Set(save.openedPhotos || []);
    STATE.openedMemos = new Set(save.openedMemos || []);
    STATE.openedFiles = new Set(save.openedFiles || []);
    STATE.endingTriggered = save.endingTriggered || false;
  } catch(e) {}
}

// ========== 锁屏弹窗 ==========
function showLockSmsDetail() {
  showLockPopup('未读短信 · 遥遥', '爸，父亲节快乐。给你买的茶叶到了没？\n\n——发送时间：2024年6月15日 19:32');
}

function showLockEventDetail() {
  showLockPopup('日历提醒 · 9月15日', '遥遥生日\n\n备注：记得发红包');
}

function showLockPopup(title, text) {
  // 先移除已有弹窗
  closeLockPopup();
  
  const popup = document.createElement('div');
  popup.className = 'lock-popup fade-in';
  popup.id = 'lockPopup';
  popup.innerHTML = `
    <div class="popup-title">${title}</div>
    <div class="popup-text">${text}</div>
    <button class="popup-close" onclick="closeLockPopup()">关闭</button>
  `;
  
  const lockScreen = $('#lockScreen');
  lockScreen.appendChild(popup);
}

function closeLockPopup() {
  const existing = $('#lockPopup');
  if (existing) existing.remove();
}

// ========== 锁屏 ==========
function initLockScreen() {
  const lockScreen = $('#lockScreen');
  const homeScreen = $('#homeScreen');
  
  if (STATE.unlocked) {
    lockScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    initHomeScreen();
    return;
  }

  // 锁屏时间
  updateLockTime();
  
  // 键盘输入
  let inputBuffer = '';
  const lockInput = $('#lockInput');
  const lockError = $('#lockError');
  
  $$('.lock-keypad button').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.key;
      if (val === 'del') {
        inputBuffer = inputBuffer.slice(0, -1);
      } else if (val === 'ok') {
        if (inputBuffer === LOCK_PASSWORD) {
          STATE.unlocked = true;
          saveState();
          lockScreen.classList.add('hidden');
          homeScreen.classList.remove('hidden');
          initHomeScreen();
        } else {
          lockError.textContent = '密码错误';
          inputBuffer = '';
          lockInput.value = '';
          setTimeout(() => { lockError.textContent = ''; }, 2000);
        }
        return;
      } else {
        if (inputBuffer.length < 4) {
          inputBuffer += val;
        }
      }
      lockInput.value = '•'.repeat(inputBuffer.length);
    });
  });
}

function updateLockTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const lockTime = $('#lockTime');
  const lockDate = $('#lockDate');
  if (lockTime) lockTime.textContent = `${h}:${m}`;
  if (lockDate) {
    const days = ['日','一','二','三','四','五','六'];
    lockDate.textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${days[now.getDay()]}`;
  }
}

// ========== 主界面 ==========
function initHomeScreen() {
  // 更新状态栏时间
  setInterval(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeEl = $('#statusTime');
    if (timeEl) timeEl.textContent = `${h}:${m}`;
  }, 1000);
  
  // 如果已触发结局，直接显示
  if (STATE.endingTriggered) {
    showEnding();
    return;
  }
  
  // 应用图标点击
  $$('.home-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const app = icon.dataset.app;
      openApp(app);
    });
  });
  
  // 底部按键和物理按键
  const backFn = () => {
    if (STATE.currentApp) backToHome();
  };
  $('#softLeft')?.addEventListener('click', backFn);
  $('#keyLeft')?.addEventListener('click', backFn);
  
  const optionsFn = () => {
    if (!STATE.currentApp) {
      if (confirm('清除进度重新开始？')) {
        localStorage.removeItem('bro_save');
        location.reload();
      }
    } else {
      backToHome();
    }
  };
  $('#softRight')?.addEventListener('click', optionsFn);
  $('#keyRight')?.addEventListener('click', optionsFn);
  $('#keyLeft')?.addEventListener('click', backFn);
  
  // 中间键 = 确认/进入
  $('#keyCenter')?.addEventListener('click', () => {
    // 暂无全局确认行为
  });
}

function backToHome() {
  STATE.currentApp = null;
  STATE.currentView = null;
  $('#appContainer').classList.add('hidden');
  $('#homeScreen').classList.remove('hidden');
}

function openApp(app) {
  STATE.currentApp = app;
  STATE.currentView = null;
  $('#homeScreen').classList.add('hidden');
  $('#appContainer').classList.remove('hidden');
  
  const appContent = $('#appContent');
  appContent.innerHTML = '';
  
  switch(app) {
    case 'sms': renderSMS(); break;
    case 'call': renderCalls(); break;
    case 'photo': renderPhotos(); break;
    case 'memo': renderMemos(); break;
    case 'calendar': renderCalendar(); break;
    case 'music': renderMusic(); break;
    case 'files': renderFiles(); break;
    case 'ending': checkEnding(); break;
  }
}

// ========== 短信 ==========
function renderSMS() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">短信</span>
    <span style="width:40px"></span>
  `;
  
  const content = $('#appContent');
  content.innerHTML = `
    <div class="sms-tab-bar">
      <button class="active" onclick="switchSMSTab('inbox', this)">收件箱</button>
      <button onclick="switchSMSTab('deleted', this)">已删除</button>
      <button onclick="switchSMSTab('draft', this)">草稿箱</button>
    </div>
    <div id="smsList"></div>
  `;
  
  renderSMSList('inbox');
}

function switchSMSTab(tab, btn) {
  $$('.sms-tab-bar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSMSList(tab);
}

function renderSMSList(tab) {
  let list;
  if (tab === 'inbox') list = SMS_DATA.inbox;
  else if (tab === 'deleted') list = SMS_DATA.deleted.filter(m => m.id !== 'del_004');
  else if (tab === 'draft') list = SMS_DATA.deleted.filter(m => m.id === 'del_004');
  
  // 按时间倒序排列（最新的在上）
  list = [...list].sort((a, b) => b.date.localeCompare(a.date));
  
  const container = $('#smsList');
  
  if (list.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#aaa;font-size:11px;">（空）</div>';
    return;
  }
  
  container.innerHTML = list.map(msg => `
    <div class="sms-item ${msg.deleted ? 'deleted' : ''} ${msg.clue ? 'clue-flash' : ''}" onclick="showSMSDetail('${tab}', '${msg.id}')">
      <div class="sms-from">${msg.name || msg.from} ${msg.deleted ? '🗑' : ''}</div>
      <div class="sms-preview">${msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text}</div>
      <div class="sms-date">${msg.date}</div>
    </div>
  `).join('');
}

function showSMSDetail(tab, id) {
  let list;
  if (tab === 'inbox') list = SMS_DATA.inbox;
  else list = SMS_DATA.deleted;
  
  const msg = list.find(m => m.id === id);
  if (!msg) return;
  
  STATE.readMessages.add(id);
  saveState();
  
  $('#appContent').innerHTML = `
    <div class="sms-detail fade-in">
      <div class="sms-detail-text">${msg.text}</div>
      <div class="sms-detail-meta">
        来自：${msg.name || msg.from}<br>
        时间：${msg.date}
      </div>
      ${msg.note ? `<div class="sms-clue-note">📝 ${msg.note}</div>` : ''}
      <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderSMS()">← 返回列表</button>
    </div>
  `;
}

// ========== 通话记录 ==========
function renderCalls() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">通话记录</span>
    <span style="width:40px"></span>
  `;
  
  // 按时间倒序
  const sorted = [...CALL_DATA].sort((a, b) => b.date.localeCompare(a.date));
  
  $('#appContent').innerHTML = sorted.map(call => `
    <div class="call-item ${call.clue ? 'clue' : ''}">
      <div class="call-icon">${call.type === 'incoming' ? '📞' : '📤'}</div>
      <div class="call-info">
        <div class="call-name">${call.from || call.to}</div>
        <div class="call-meta">${call.date}${call.note ? ' · ' + call.note : ''}</div>
      </div>
      <div class="call-duration">${call.duration}</div>
    </div>
  `).join('');
}

// ========== 相册 ==========
function renderPhotos() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">相册</span>
    <span style="width:40px"></span>
  `;
  
  $('#appContent').innerHTML = `
    <div class="photo-grid">
      ${PHOTO_DATA.map(p => `
        <div class="photo-thumb ${p.locked && !STATE.solvedPasswords['photo_'+p.id] ? 'locked' : ''}" 
             onclick="showPhotoDetail('${p.id}')">
          ${p.locked && !STATE.solvedPasswords['photo_'+p.id] ? '🔒' : '🖼'}
          <div style="font-size:7px;color:#999;margin-top:2px;">${p.date}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function showPhotoDetail(id) {
  const photo = PHOTO_DATA.find(p => p.id === id);
  if (!photo) return;
  
  const isLocked = photo.locked && !STATE.solvedPasswords['photo_' + id];
  
  if (isLocked) {
    $('#appContent').innerHTML = `
      <div class="photo-detail fade-in">
        <div style="text-align:center;font-size:40px;margin:20px 0;">🔒</div>
        <div class="photo-lock-hint">${photo.lockHint || '输入密码解锁'}</div>
        <div class="photo-lock-input">
          <input type="text" id="photoPassInput" placeholder="输入密码" />
          <button onclick="tryUnlockPhoto('${id}')">解锁</button>
        </div>
        <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderPhotos()">← 返回相册</button>
      </div>
    `;
    return;
  }
  
  STATE.openedPhotos.add(id);
  saveState();
  
  $('#appContent').innerHTML = `
    <div class="photo-detail fade-in">
      <div style="background:#ddd;height:120px;display:flex;justify-content:center;align-items:center;font-size:36px;border-radius:4px;margin-bottom:10px;">🖼</div>
      <div class="photo-desc">${photo.desc}</div>
      <div class="photo-detail-meta" style="font-size:10px;color:#aaa;margin-top:6px;">拍摄日期：${photo.date}</div>
      ${photo.note ? `<div class="photo-note">📝 ${photo.note}</div>` : ''}
      <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderPhotos()">← 返回相册</button>
    </div>
  `;
}

function tryUnlockPhoto(id) {
  const photo = PHOTO_DATA.find(p => p.id === id);
  const input = $('#photoPassInput').value.trim().toLowerCase();
  if (input === photo.password.toLowerCase()) {
    STATE.solvedPasswords['photo_' + id] = true;
    saveState();
    showPhotoDetail(id);
  } else {
    const existing = $('#photoLockError');
    if (existing) existing.remove();
    const err = document.createElement('div');
    err.id = 'photoLockError';
    err.className = 'memo-lock-error';
    err.textContent = '密码错误';
    $('#photoPassInput').parentElement.appendChild(err);
  }
}

// ========== 备忘录 ==========
function renderMemos() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">备忘录</span>
    <span style="width:40px"></span>
  `;
  
  $('#appContent').innerHTML = MEMO_DATA.map(m => `
    <div class="memo-item ${m.locked && !STATE.solvedPasswords['memo_'+m.id] ? 'locked' : ''}" 
         onclick="showMemoDetail('${m.id}')">
      <div class="memo-title">
        ${m.locked && !STATE.solvedPasswords['memo_'+m.id] ? '🔒 ' : ''}${m.title}
      </div>
      <div class="memo-date">${m.date}</div>
    </div>
  `).join('');
}

function showMemoDetail(id) {
  const memo = MEMO_DATA.find(m => m.id === id);
  if (!memo) return;
  
  const isLocked = memo.locked && !STATE.solvedPasswords['memo_' + id];
  
  if (isLocked) {
    $('#appContent').innerHTML = `
      <div class="memo-detail fade-in">
        <div style="font-weight:bold;margin-bottom:8px;">🔒 ${memo.title}</div>
        <div class="memo-lock-box">
          <div class="lock-hint">${memo.lockHint}</div>
          <input type="text" id="memoPassInput" placeholder="输入密码" />
          <button onclick="tryUnlockMemo('${id}')">解锁</button>
          <div id="memoLockError"></div>
        </div>
        <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderMemos()">← 返回列表</button>
      </div>
    `;
    return;
  }
  
  STATE.openedMemos.add(id);
  saveState();
  
  // 如果是最终备忘录，显示内容后检查结局条件
  if (memo.isFinal) {
    $('#appContent').innerHTML = `
      <div class="memo-detail fade-in">
        <div style="font-weight:bold;margin-bottom:8px;">${memo.title}</div>
        <div style="font-size:9px;color:#aaa;margin-bottom:10px;">${memo.date}</div>
        <div class="memo-content">${memo.content}</div>
        ${memo.note ? `<div class="memo-note">📝 ${memo.note}</div>` : ''}
        <div style="margin-top:16px;padding:10px;background:#f0f7ff;border-radius:4px;font-size:10px;color:#1565c0;text-align:center;">
          材料都在文件管理里，密码你知道的。<br>去看看文件管理吧。
        </div>
        <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="backToHome()">← 返回桌面</button>
      </div>
    `;
    
    // 解锁结局图标提示
    checkAllFilesRead();
    return;
  }
  
  $('#appContent').innerHTML = `
    <div class="memo-detail fade-in">
      <div style="font-weight:bold;margin-bottom:8px;">${memo.title}</div>
      <div style="font-size:9px;color:#aaa;margin-bottom:10px;">${memo.date}</div>
      <div class="memo-content">${memo.content}</div>
      ${memo.note ? `<div class="memo-note">📝 ${memo.note}</div>` : ''}
      <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderMemos()">← 返回列表</button>
    </div>
  `;
}

function tryUnlockMemo(id) {
  const memo = MEMO_DATA.find(m => m.id === id);
  const input = $('#memoPassInput').value.trim().toLowerCase();
  if (input === memo.password.toLowerCase()) {
    STATE.solvedPasswords['memo_' + id] = true;
    saveState();
    showMemoDetail(id);
  } else {
    $('#memoLockError').textContent = '密码错误';
    $('#memoPassInput').value = '';
  }
}

// ========== 日历 ==========
function renderCalendar() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">日历</span>
    <span style="width:40px"></span>
  `;
  
  // 按日期排序（新的在前）
  const sorted = [...CALENDAR_DATA].sort((a, b) => b.date.localeCompare(a.date));
  
  $('#appContent').innerHTML = `<div class="calendar-list">${sorted.map(c => `
    <div class="calendar-item ${c.clue ? 'clue' : ''}">
      <div class="cal-date">${c.date}</div>
      ${c.title ? `<div class="cal-title">${c.title}</div>` : ''}
      ${c.note ? `<div class="cal-note">${c.note}</div>` : ''}
    </div>
  `).join('')}</div>`;
}

// ========== 音乐播放器 ==========
let currentSong = 0;
let isPlaying = false;

function renderMusic() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">音乐</span>
    <span style="width:40px"></span>
  `;
  
  const song = MUSIC_DATA[currentSong];
  
  $('#appContent').innerHTML = `
    <div class="music-player fade-in">
      <div class="now-playing">${song.title}</div>
      <div class="now-artist">${song.artist}</div>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <div class="controls">
        <button onclick="prevSong()">⏮</button>
        <button onclick="togglePlay()" id="playBtn">▶</button>
        <button onclick="nextSong()">⏭</button>
      </div>
      <div class="music-list">
        ${MUSIC_DATA.map((s, i) => `
          <div class="music-item ${i === currentSong ? 'playing' : ''}" onclick="playSong(${i})">
            <div class="song-title">${i + 1}. ${s.title}</div>
            <div class="song-meta">${s.artist} · ${s.duration}</div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px;text-align:center;font-size:9px;color:#ccc;">
        💡 这份歌单好像是为谁特意挑的。
      </div>
    </div>
  `;
}

function togglePlay() {
  isPlaying = !isPlaying;
  $('#playBtn').textContent = isPlaying ? '⏸' : '▶';
  if (isPlaying) {
    let progress = 0;
    const song = MUSIC_DATA[currentSong];
    const [min, sec] = song.duration.split(':').map(Number);
    const totalSec = min * 60 + sec;
    const interval = setInterval(() => {
      if (!isPlaying || progress >= 100) {
        clearInterval(interval);
        return;
      }
      progress += (100 / totalSec) * 0.5;
      const fill = $('#progressFill');
      if (fill) fill.style.width = progress + '%';
    }, 500);
  }
}

function playSong(i) {
  currentSong = i;
  isPlaying = false;
  renderMusic();
}

function prevSong() {
  currentSong = (currentSong - 1 + MUSIC_DATA.length) % MUSIC_DATA.length;
  isPlaying = false;
  renderMusic();
}

function nextSong() {
  currentSong = (currentSong + 1) % MUSIC_DATA.length;
  isPlaying = false;
  renderMusic();
}

// ========== 文件管理 ==========
function renderFiles() {
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">文件管理</span>
    <span style="width:40px"></span>
  `;
  
  $('#appContent').innerHTML = FILE_DATA.map(f => `
    <div class="file-item ${f.locked && !STATE.solvedPasswords['file_'+f.id] ? 'locked' : ''}" 
         onclick="showFileDetail('${f.id}')">
      <div class="file-icon">${f.locked && !STATE.solvedPasswords['file_'+f.id] ? '🔒' : '📄'}</div>
      <div class="file-info">
        <div class="file-name">${f.name}</div>
        <div class="file-meta">${f.size} · ${f.date}</div>
      </div>
    </div>
  `).join('');
}

function showFileDetail(id) {
  const file = FILE_DATA.find(f => f.id === id);
  if (!file) return;
  
  const isLocked = file.locked && !STATE.solvedPasswords['file_' + id];
  
  if (isLocked) {
    $('#appContent').innerHTML = `
      <div class="file-detail fade-in">
        <div style="text-align:center;font-size:40px;margin:20px 0;">🔒</div>
        <div style="text-align:center;font-weight:bold;margin-bottom:8px;">${file.name}</div>
        <div class="file-lock-box">
          <input type="text" id="filePassInput" placeholder="输入密码" />
          <button onclick="tryUnlockFile('${id}')">解锁</button>
          <div id="fileLockError"></div>
        </div>
        <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderFiles()">← 返回文件列表</button>
      </div>
    `;
    return;
  }
  
  STATE.openedFiles.add(id);
  saveState();
  
  $('#appContent').innerHTML = `
    <div class="file-detail fade-in">
      <div style="font-weight:bold;margin-bottom:8px;">${file.name}</div>
      <div style="font-size:9px;color:#aaa;margin-bottom:10px;">${file.size} · ${file.date}</div>
      <div class="file-content">${file.content}</div>
      <button class="back-btn" style="margin-top:12px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="renderFiles()">← 返回文件列表</button>
    </div>
  `;
}

function tryUnlockFile(id) {
  const file = FILE_DATA.find(f => f.id === id);
  const input = $('#filePassInput').value.trim().toLowerCase();
  if (input === file.password.toLowerCase()) {
    STATE.solvedPasswords['file_' + id] = true;
    saveState();
    showFileDetail(id);
    
    // 检查是否看完所有关键文件，更新结局图标
    checkAllFilesRead();
  } else {
    $('#fileLockError').textContent = '密码错误';
    $('#filePassInput').value = '';
  }
}

function checkAllFilesRead() {
  const allFilesUnlocked = FILE_DATA.every(f => 
    !f.locked || STATE.solvedPasswords['file_' + f.id]
  );
  const finalMemoUnlocked = STATE.solvedPasswords['memo_memo_005'];
  
  if (allFilesUnlocked && finalMemoUnlocked) {
    // 解锁结局图标
    const endingIcon = $('[data-app="ending"]');
    if (endingIcon) {
      endingIcon.style.opacity = '1';
      endingIcon.querySelector('.icon-img').textContent = '✉';
      endingIcon.querySelector('.icon-label').textContent = '信';
    }
  } else if (finalMemoUnlocked) {
    // 备忘录解了但文件还没全看
    const endingIcon = $('[data-app="ending"]');
    if (endingIcon) {
      endingIcon.style.opacity = '0.5';
    }
  }
}

// ========== 结局 ==========
function checkEnding() {
  // 检查是否满足结局条件
  const finalMemoUnlocked = STATE.solvedPasswords['memo_memo_005'];
  const allFilesUnlocked = FILE_DATA.every(f => 
    !f.locked || STATE.solvedPasswords['file_' + f.id]
  );
  
  if (finalMemoUnlocked && allFilesUnlocked) {
    showEnding();
  } else {
    $('#appContent').innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#888;">
        <div style="font-size:40px;margin-bottom:16px;">❓</div>
        <div style="font-size:12px;">还有些东西没看完。</div>
        <button class="back-btn" style="margin-top:16px;font-size:11px;color:#1a3a5c;background:none;border:none;cursor:pointer;" onclick="backToHome()">← 返回</button>
      </div>
    `;
  }
}

function showEnding() {
  STATE.endingTriggered = true;
  saveState();
  
  $('#homeScreen').classList.add('hidden');
  $('#appContainer').classList.remove('hidden');
  $('#appHeader').innerHTML = `
    <button class="back-btn" onclick="backToHome()">← 返回</button>
    <span class="app-title">写给你的信</span>
    <span style="width:40px"></span>
  `;
  
  $('#appContent').innerHTML = `
    <div class="ending-screen fade-in">
      <div class="ending-title">写给你的信</div>
      <div class="ending-text">
你翻完了父亲的旧手机。

他没来得及寄出的那封信，和所有的证据材料，都在文件管理里。

父亲最后一条备忘录写着：
「下周去把信寄出去。
  牛奶快过期了，遥遥还没回来。」

信没有寄出去。

但证据你可以带走。

冰箱里的牛奶已经过期了。
但你会发现，超市小票上还写着——

「遥遥爱喝的，买了一箱放冰箱。」

你回来的路上要是渴了，
冰箱里有牛奶。

—— 完 ——
      </div>
      <button class="ending-reset" onclick="if(confirm('重新开始？所有进度将被清除。')){localStorage.removeItem('bro_save');location.reload();}">重新开始</button>
    </div>
  `;
}

// ========== 全局函数挂载 ==========
window.backToHome = backToHome;
window.switchSMSTab = switchSMSTab;
window.showSMSDetail = showSMSDetail;
window.showPhotoDetail = showPhotoDetail;
window.tryUnlockPhoto = tryUnlockPhoto;
window.showMemoDetail = showMemoDetail;
window.tryUnlockMemo = tryUnlockMemo;
window.renderPhotos = renderPhotos;
window.renderMemos = renderMemos;
window.renderSMS = renderSMS;
window.renderFiles = renderFiles;
window.tryUnlockFile = tryUnlockFile;
window.togglePlay = togglePlay;
window.playSong = playSong;
window.prevSong = prevSong;
window.nextSong = nextSong;
window.showLockSmsDetail = showLockSmsDetail;
window.showLockEventDetail = showLockEventDetail;
window.closeLockPopup = closeLockPopup;
