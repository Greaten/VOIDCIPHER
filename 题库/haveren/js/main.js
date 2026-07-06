/**
 * main.js - 桌面 Hub 引擎 v0.4
 * 8 BUG 修复 + 6 体验优化
 * 格式化良好版本，不再单行压缩
 */
(function() {
  'use strict';

  // ── 配置 ──
  const APPS = {
    mail:    { title: '邮箱',   icon: '📧' },
    browser: { title: '浏览器', icon: '🌐' },
    chat:    { title: '聊天',   icon: '💬' },
    notes:   { title: '记事本', icon: '📝' },
    files:   { title: '文件',   icon: '📁' },
    photos:  { title: '相册',   icon: '📷' },
    shop:    { title: '购物',   icon: '🛒' }
  };

  const TOTAL_CLUES = 19;

  // DOM
  const desktopIcons   = document.getElementById('desktopIcons');
  const windowsCont    = document.getElementById('windowsContainer');
  const taskbarWin     = document.getElementById('taskbarWindows');
  const taskbarTime    = document.getElementById('taskbarTime');
  const clueCountEl    = document.getElementById('clueCount');

  // 窗口管理
  const openWindows    = {};
  const windowOrder    = [];
  let activeWin = null, zIdx = 10;
  let dragging = null, dsx = 0, dsy = 0, wsl = 0, wst = 0;

  function $(s,c){return (c||document).querySelector(s);}
  function $$(s,c){return (c||document).querySelectorAll(s);}

  // ── 时钟 ──
  function tick() {
    const d = new Date();
    taskbarTime.textContent =
      String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  tick(); setInterval(tick, 30000);

  // ── UI 刷新 ──
  function refreshUI() {
    var cnt = State.getClueCount();
    clueCountEl.textContent = '已发现线索：' + cnt + '/' + TOTAL_CLUES;
    var icons = $$('.desktop-icon[data-app]');
    for (var i = 0; i < icons.length; i++) {
      var app = icons[i].dataset.app;
      if (app === 'ending') continue;
      icons[i].dataset.clue = State.hasClueInApp(app) ? 'true' : 'false';
    }
    updateNote3Visibility();
  }

  // ── 窗口 ──
  function createWindow(appName) {
    var app = APPS[appName];
    if (!app) return null;

    // 已打开则激活或恢复
    if (openWindows[appName]) {
      if (openWindows[appName].style.display === 'none') restoreWindow(appName);
      else activateWindow(openWindows[appName]);
      return openWindows[appName];
    }

    var win = document.createElement('div');
    win.className = 'app-window active';
    win.dataset.app = appName;
    win.style.zIndex = ++zIdx;

    var count = Object.keys(openWindows).length;
    var sizes = { mail:[680,520], browser:[720,540], chat:[620,580], notes:[540,480],
                  files:[620,500], photos:[700,540], shop:[560,460] };
    var sz = sizes[appName] || [580,440];
    win.style.left   = (40 + count * 30) + 'px';
    win.style.top    = (30 + count * 28) + 'px';
    win.style.width  = sz[0] + 'px';
    win.style.height = sz[1] + 'px';

    // 标题栏
    var hdr = document.createElement('div');
    hdr.className = 'window-header';
    hdr.innerHTML =
      '<span class="window-title">' + app.icon + ' ' + app.title + '</span>' +
      '<div class="window-actions">' +
        '<button class="window-btn minimize" data-action="minimize"></button>' +
        '<button class="window-btn maximize" data-action="maximize"></button>' +
        '<button class="window-btn close" data-action="close"></button>' +
      '</div>';
    win.appendChild(hdr);

    var body = document.createElement('div');
    body.className = 'window-body';
    body.id = 'body-' + appName;
    body.innerHTML = '<div class="placeholder-body"><span class="ph-title">加载中...</span></div>';
    win.appendChild(body);

    // 按钮事件
    hdr.querySelector('.close').addEventListener('click', function(e) {
      e.stopPropagation(); closeWindow(appName);
    });
    hdr.querySelector('.maximize').addEventListener('click', function(e) {
      e.stopPropagation(); toggleMaximize(win);
    });
    hdr.querySelector('.minimize').addEventListener('click', function(e) {
      e.stopPropagation(); minimizeWindow(appName);
    });
    win.addEventListener('mousedown', function() { activateWindow(win); });
    hdr.addEventListener('mousedown', function(e) {
      if (e.target.closest('.window-actions')) return;
      dragging = win; dsx = e.clientX; dsy = e.clientY;
      wsl = parseInt(win.style.left) || 0; wst = parseInt(win.style.top) || 0;
      win.style.transition = 'none'; e.preventDefault();
    });

    windowsCont.appendChild(win);
    openWindows[appName] = win;
    windowOrder.push(appName);
    activateWindow(win);
    updateTaskbar();

    if (!State.get('gameStarted')) State.set('gameStarted', true);
    loadAppContent(appName, body);
    return win;
  }

  function activateWindow(win) {
    if (activeWin === win) return;
    var keys = Object.keys(openWindows);
    for (var i = 0; i < keys.length; i++) openWindows[keys[i]].classList.remove('active');
    win.classList.add('active');
    win.style.zIndex = ++zIdx;
    activeWin = win;
    updateTaskbar();
  }

  function closeWindow(appName) {
    var win = openWindows[appName]; if (!win) return;
    win.style.transition = 'opacity 0.12s'; win.style.opacity = '0';
    setTimeout(function() {
      win.remove(); delete openWindows[appName];
      for (var i = windowOrder.length - 1; i >= 0; i--) {
        if (windowOrder[i] === appName) { windowOrder.splice(i, 1); break; }
      }
      if (activeWin === win)
        activeWin = windowOrder.length > 0 ? openWindows[windowOrder[windowOrder.length - 1]] : null;
      updateTaskbar(); refreshUI();
    }, 120);
  }

  function minimizeWindow(appName) {
    var win = openWindows[appName]; if (!win) return;
    win.style.display = 'none'; win.classList.remove('active');
    if (activeWin === win) {
      activeWin = null;
      for (var i = windowOrder.length - 1; i >= 0; i--) {
        var w = openWindows[windowOrder[i]];
        if (w && w.style.display !== 'none') { activateWindow(w); break; }
      }
    }
    updateTaskbar();
  }

  function restoreWindow(appName) {
    var win = openWindows[appName]; if (!win) return;
    win.style.display = ''; activateWindow(win); updateTaskbar();
  }

  function toggleMaximize(win) {
    win.classList.toggle('maximized');
  }

  function updateTaskbar() {
    taskbarWin.innerHTML = '';
    for (var i = 0; i < windowOrder.length; i++) {
      var win = openWindows[windowOrder[i]]; if (!win) continue;
      var app = APPS[windowOrder[i]];
      var tab = document.createElement('div');
      tab.className = 'taskbar-tab';
      if (win.classList.contains('active') && win.style.display !== 'none')
        tab.classList.add('active');
      tab.textContent = app.icon + ' ' + app.title;
      tab.addEventListener('click', (function (an) {
        return function() {
          var w = openWindows[an];
          if (w.style.display === 'none') restoreWindow(an);
          else if (w.classList.contains('active')) minimizeWindow(an);
          else restoreWindow(an);
        };
      })(windowOrder[i]));
      taskbarWin.appendChild(tab);
    }
  }

  // ── 桌面图标点击 ──
  desktopIcons.addEventListener('click', function(e) {
    var ic = e.target.closest('.desktop-icon'); if (!ic) return;
    var all = $$('.desktop-icon');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    ic.classList.add('selected');
    var appName = ic.dataset.app;
    if (appName === 'ending') { openEnding(); return; }
    createWindow(appName);
  });
  desktopIcons.addEventListener('dblclick', function(e) {
    var ic = e.target.closest('.desktop-icon'); if (!ic) return;
    var appName = ic.dataset.app;
    if (appName === 'ending') { openEnding(); return; }
    createWindow(appName);
  });

  // ── 全局拖拽 ──
  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    dragging.style.left = (wsl + e.clientX - dsx) + 'px';
    dragging.style.top  = (wst + e.clientY - dsy) + 'px';
  });
  document.addEventListener('mouseup', function() {
    if (dragging) { dragging.style.transition = ''; dragging = null; }
  });

  // ── 加载应用内容 ──
  function loadAppContent(appName, body) {
    try {
      var content = '';
      switch (appName) {
        case 'mail':    content = buildMailApp();    break;
        case 'browser': content = buildBrowserApp(); break;
        case 'chat':    content = buildChatApp();    break;
        case 'notes':   content = buildNotesApp();   break;
        case 'files':   content = buildFilesApp();   break;
        case 'photos':  content = buildPhotosApp();  break;
        case 'shop':    content = buildShopApp();    break;
      }
      body.innerHTML = content;
      bindAppEvents(appName, body);
    } catch (e) {
      body.innerHTML = '<div class="placeholder-body"><span class="ph-title">加载失败</span>' +
                       '<span class="ph-sub">' + e.message + '</span></div>';
    }
  }

  function bindAppEvents(appName, body) {
    switch (appName) {
      case 'mail':    bindMailEvents(body);    break;
      case 'browser': bindBrowserEvents(body); break;
      case 'chat':    bindChatEvents(body);    break;
      case 'notes':   bindNotesEvents(body);   break;
      case 'files':   bindFilesEvents(body);   break;
      case 'photos':  bindPhotosEvents(body);  break;
      case 'shop':    bindShopEvents(body);    break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 1：邮箱
  // ═══════════════════════════════════════════════════════════════
  var allMails = [
    { id:'M1', from:'林也', subject:'最近有点事……',          date:'6月12日', unread:true },
    { id:'M2', from:'林也', subject:'工具箱密码别忘了',       date:'5月20日', unread:true },
    { id:'M3', from:'GitHub', subject:'[Project Null] New commit pushed', date:'5月15日' },
    { id:'M4', from:'Steam',  subject:'您的好友正在游玩…',   date:'5月08日' },
    { id:'M5', from:'阿里云', subject:'云服务器续费提醒',     date:'4月22日' },
    { id:'M6', from:'知乎',   subject:'本周热门话题推送',     date:'4月10日' },
    { id:'M7', from:'美团',   subject:'您的外卖订单评价',     date:'3月28日' },
    { id:'M8', from:'Apple',  subject:'App Store 账单收据',   date:'3月15日' }
  ];

  var mailContentMap = {
    M1: '<span class="mail-hd-from">林也 &lt;linye@proton.me&gt;</span><br>' +
        '<span class="mail-hd-to">收件人：渡鸦</span><br>' +
        '<span class="mail-hd-date">2025年6月12日 23:48</span><br><br>' +
        '嘿。<br><br>最近想换个城市生活，可能断网一段时间。' +
        '之前跟你聊的那个游戏项目，资料都在' +
        '<a href="javascript:void(0)" onclick="alert(\'' +
        '📁 云盘共享文件夹\\n路径：//null-project.dev/share/linye\\n\\n' +
        '这是林也留给你的入口。他用 Project Null 管理他的"游戏"——你得想办法登录进去。' +
        '\')" style="color:var(--accent);">老地方</a>，你有空可以看看。<br><br>' +
        '别太想我。保重。<br><br>—— 林也',
    M2: '<span class="mail-hd-from">林也 &lt;linye@proton.me&gt;</span><br>' +
        '<span class="mail-hd-to">收件人：渡鸦</span><br>' +
        '<span class="mail-hd-date">2025年5月20日 14:33</span><br><br>' +
        '对了，上次你问我那个工具箱的密码，还是老规矩——<br>' +
        '我的幸运数字 + 我们认识那年的后两位。<br><br>' +
        '你应该记得吧？已经用了好多年了。<br><br>' +
        '对了，最近项目有点忙，可能回复会慢一些。别担心。',
    M3: '<span class="mail-hd-from">GitHub</span><br>' +
        '<span class="mail-hd-date">2025年5月15日 09:12</span><br><br>' +
        '[Project Null] New commit pushed to branch "main"<br>' +
        'Commit: "data viz scaffold + cleanup old references"<br><br>' +
        '<span style="color:var(--text-dim);font-size:11px;">' +
        'Project Null —— 听起来不像是个游戏。更像是一个数据项目。</span>',
    M4: '<span class="mail-hd-from">Steam</span><br>' +
        '<span class="mail-hd-date">2025年5月8日</span><br><br>' +
        '您的好友「渡鸦」正在游玩 Cyberpunk 2077。',
    M5: '<span class="mail-hd-from">阿里云</span><br>' +
        '<span class="mail-hd-date">2025年4月22日</span><br><br>' +
        '您的云服务器 ECS (null-project-host) 将于5月1日到期，请及时续费。<br><br>' +
        '<span style="color:var(--text-dim);font-size:11px;">服务器还在续费——林也在维护 Project Null。</span>',
    M6: '<span class="mail-hd-from">知乎</span><br>' +
        '<span class="mail-hd-date">2025年4月10日</span><br><br>' +
        '本周热门话题：临床数据管理的未来趋势',
    M7: '<span class="mail-hd-from">美团</span><br>' +
        '<span class="mail-hd-date">2025年3月28日</span><br><br>' +
        '您的外卖订单已送达。评价有礼！',
    M8: '<span class="mail-hd-from">Apple</span><br>' +
        '<span class="mail-hd-date">2025年3月15日</span><br><br>' +
        '您的 App Store 账单收据已生成。'
  };

  var deletedMailContentMap = {
    mr1: '发件人：hr@raycomepharma.com<br>日期：2025年6月10日 15:22<br><br>' +
         '林先生，<br><br>' +
         '公司注意到您最近在部分网络论坛上发表了关于我司产品的不实言论。<br>' +
         '我们理解您离职时的心情，但还是善意提醒——<br>' +
         '保密协议（NDA）条款在您离职后依然有效。<br><br>' +
         '希望我们不需要采取进一步措施。<br><br>' +
         '瑞康医药 人力资源部',
    mr2: '发件人：N &lt;noreply@proton.me&gt;<br>日期：2025年6月10日 15:41<br><br>' +
         '他们知道了。<br>别再用你的真名账号了。<br><br>' +
         '<button onclick="alert(\'' +
         '📋 邮件原始信息\\n\\nX-Message-ID: 47.109.82.33:61201\\n' +
         'Received: from unknown [10.0.0.137]\\nContent-Type: text/plain; charset=utf-8\\n\\n' +
         'IP地址：47.109.82.33 —— 不属于常规邮件服务器。这是一条来自瑞康内网的内部消息。' +
         '\')" style="background:none;border:1px solid var(--accent);color:var(--accent);' +
         'cursor:pointer;padding:4px 10px;border-radius:3px;font-size:12px;">' +
         '[查看原始信息]</button>',
    mr3: '发件人：系统通知<br>日期：2025年5月30日<br><br>' +
         '您的账户在异地登录。如非本人操作，请立即修改密码。',
    m5:  '收件人：渡鸦<br>日期：2025年6月13日 01:17<br>' +
         '状态：<span style="color:var(--danger);">未发出</span><br><br>' +
         '对不起让你看到这些。<br><br>' +
         '如果你到了这里，说明我可能已经——<br>' +
         '（这段被反复删除又重写，留下了光标闪动的痕迹）<br><br>' +
         '但记住，答案不在一个人身上。<br>不要相信任何单一来源的数据。<br><br>' +
         '特别是<span style="background:#333;padding:0 6px;letter-spacing:2px;">周明远</span>' +
         '——他办公室的照片在 G3 的 meta 里。<br><br>' +
         '密码前半在他的聊天里，后半在 G3 的 meta。<br>去拼接它们。<br><br>' +
         '（邮件在这里戛然而止）'
  };

  function buildMailApp() {
    return '<div class="mail-app">' +
      '<div class="mail-list" id="mailList"></div>' +
      '<div class="mail-detail" id="mailDetail"></div>' +
      '<div class="locked-section" id="mailDeletedLock" style="margin-top:24px;">' +
        '<div style="color:var(--text-dim);font-size:13px;">🔒 已删除（需要密码）</div>' +
        '<input type="text" class="lock-input" id="deletedPwdInput" placeholder="输入密码" maxlength="20">' +
        '<div class="lock-hint">提示：林也的幸运数字 + 他们认识那年的后两位</div>' +
        '<div class="lock-hint" style="font-size:11px;color:var(--icon-clue-glow);">线索在聊天记录里</div>' +
        '<div class="lock-error" id="deletedPwdError">密码错误</div>' +
      '</div>' +
      '<div id="mailDeletedContent" style="display:none;"></div>' +
      '<div id="mailDraftContent" style="margin-top:24px; display:none;"></div>' +
    '</div>';
  }

  function bindMailEvents(body) {
    renderMailList(body);
    body.querySelector('#deletedPwdInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') tryUnlockDeleted(body);
    });
  }

  function renderMailList(body) {
    var list = body.querySelector('#mailList');
    var html = '';
    for (var i = 0; i < allMails.length; i++) {
      var m = allMails[i];
      html += '<div class="mail-item ' + (m.unread ? 'unread' : '') + '" data-mail-id="' + m.id + '">' +
        '<span class="mail-date">' + m.date + '</span>' +
        '<div class="mail-from">' + m.from + '</div>' +
        '<div class="mail-subject">' + m.subject + '</div>' +
      '</div>';
    }
    list.innerHTML = html;
    var items = $$('.mail-item', body);
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', function() {
        openMailDetail(body, this.dataset.mailId);
      });
    }
  }

  function openMailDetail(body, mailId) {
    if (mailId === 'M1') { State.findClue('C01'); refreshUI(); }
    var detail = body.querySelector('#mailDetail');
    detail.innerHTML = '<span class="mail-back" id="mailBack">← 返回收件箱</span>' +
      '<div class="mail-body">' + (mailContentMap[mailId] || '') + '</div>';
    detail.classList.add('active');
    body.querySelector('#mailList').style.display = 'none';
    body.querySelector('#mailBack').addEventListener('click', function() {
      detail.classList.remove('active'); detail.innerHTML = '';
      body.querySelector('#mailList').style.display = '';
    });
  }

  function tryUnlockDeleted(body) {
    var input = body.querySelector('#deletedPwdInput');
    var errorEl = body.querySelector('#deletedPwdError');
    if (input.value === '041218') {
      State.set('deletedMailUnlocked', true);
      State.findClue('C02');
      refreshUI();
      body.querySelector('#mailDeletedLock').style.display = 'none';
      var cet = body.querySelector('#mailDeletedContent');
      cet.style.display = 'block';
      cet.innerHTML =
        '<div style="margin-bottom:16px;color:var(--danger);font-size:13px;">📂 已删除邮件（共 3 封）</div>' +
        '<div class="mail-item" data-deleted="mr1"><span class="mail-date">6月10日</span>' +
        '<div class="mail-from">瑞康医药 HR</div><div class="mail-subject">关于您近期网上言论的提醒</div></div>' +
        '<div class="mail-item" data-deleted="mr2"><span class="mail-date">6月10日</span>' +
        '<div class="mail-from">N &lt;noreply@proton.me&gt;</div><div class="mail-subject">（无主题）</div></div>' +
        '<div class="mail-item" data-deleted="mr3"><span class="mail-date">5月30日</span>' +
        '<div class="mail-from">系统通知</div><div class="mail-subject">账户安全提醒</div></div>';
      // 草稿箱
      var draft = body.querySelector('#mailDraftContent');
      draft.style.display = 'block';
      draft.innerHTML =
        '<div style="margin-bottom:12px;color:var(--text-dim);font-size:13px;">📝 草稿箱（1 封未发出）</div>' +
        '<div class="mail-item" data-deleted="m5"><span class="mail-date">6月13日</span>' +
        '<div class="mail-from">致：渡鸦（未发出）</div><div class="mail-subject">对不起让你看到这些…</div></div>';
      // 绑定事件
      var dItems = cet.querySelectorAll('.mail-item');
      for (var i = 0; i < dItems.length; i++) {
        dItems[i].addEventListener('click', function() { openDeletedMail(body, this.dataset.deleted); });
      }
      draft.querySelector('.mail-item').addEventListener('click', function() {
        openDeletedMail(body, 'm5');
      });
    } else {
      errorEl.style.display = 'block';
    }
  }

  function openDeletedMail(body, mailId) {
    var detail = body.querySelector('#mailDetail');
    detail.innerHTML = '<span class="mail-back" id="deletedBack">← 返回</span>' +
      '<div class="mail-body">' + (deletedMailContentMap[mailId] || '') + '</div>';
    detail.classList.add('active');
    body.querySelector('#mailList').style.display = 'none';
    body.querySelector('#mailDeletedContent').style.display = 'none';
    body.querySelector('#mailDraftContent').style.display = 'none';
    body.querySelector('#deletedBack').addEventListener('click', function() {
      detail.classList.remove('active'); detail.innerHTML = '';
      body.querySelector('#mailList').style.display = '';
      body.querySelector('#mailDeletedContent').style.display = 'block';
      body.querySelector('#mailDraftContent').style.display = 'block';
    });
    if (mailId === 'm5') { State.findClue('C03'); refreshUI(); }
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 2：浏览器
  // ═══════════════════════════════════════════════════════════════
  var searchHistory = [
    { t:'6月13日 02:14', q:'如何确定自己是不是被跟踪' },
    { t:'6月12日 23:40', q:'三亚到清迈直飞航班' },
    { t:'6月12日 20:11', q:'彻底删除数字身份 教程' },
    { t:'6月12日 15:08', q:'快递拦截 查询 怎么查' },
    { t:'6月11日 15:32', q:'二次加密 MD5 SHA256 区别' },
    { t:'6月10日 09:07', q:'瑞康医药 甘舒平 临床试验' },
    { t:'6月07日 17:43', q:'二手 ThinkPad X1 Carbon' },
    { t:'5月28日 11:22', q:'独立游戏 steam 发行 流程' },
    { t:'4月15日 08:03', q:'三亚租车 长期' }
  ];

  var searchResults = {
    '甘舒平': [
      { ti:'瑞康医药·甘舒平——III期临床试验结果公示', url:'raycomepharma.com/clinical/gspt3',
        sn:'甘舒平（Ganshupin）III期临床试验结果显示，主要终点达到统计学显著性……' +
           '但在亚组分析中，部分受试者出现不可解释的不良事件。该药物已于2024年提交FDA审批。<br>' +
           '<span style="color:var(--icon-clue-glow);font-size:11px;">🟡 不良事件细节被摘要折叠——完整数据可能需要访问 Project Null。</span>' }
    ],
    '瑞康医药': [
      { ti:'瑞康医药——关于我们', url:'raycomepharma.com/about',
        sn:'瑞康医药成立于2008年，总部位于上海浦东，是一家专注于内分泌领域创新药物研发' +
           '的生物制药企业。核心产品管线涵盖糖尿病、甲状腺及罕见代谢疾病。<br>' +
           '<span style="color:var(--text-dim);font-size:11px;">总部地址：上海浦东新区张江高科技园区碧波路889号</span>' }
    ],
    '三亚': [
      { ti:'三亚旅游攻略·2025最新版', url:'travel.cn/sanya',
        sn:'三亚，位于海南岛最南端。全年平均气温25°C，是中国唯一的热带滨海旅游城市。建议游玩天数：5-7天。' }
    ],
    '清迈': [
      { ti:'清迈长期旅居指南', url:'expatlife.com/chiangmai',
        sn:'清迈是泰国北部的文化中心，以低廉的生活成本、优质的数字游民社区和丰富的自然景观闻名。' +
           '长期签证可选择教育签证或精英签证。<br>' +
           '<span style="color:var(--text-dim);font-size:11px;">热门旅居区域：尼曼路、古城、杭东</span>' }
    ],
    '数字身份': [
      { ti:'如何彻底删除你的数字足迹——安全指南', url:'privacy-guide.org/digital-erasure',
        sn:'完全删除数字身份需要：1) 注销所有社交媒体账号、2) 更换设备和SIM卡、' +
           '3) 停止使用真实姓名进行任何在线活动、4) 使用VPN和匿名网络……' +
           '最后一步：制造足够多的虚假数据来混淆真实轨迹。' }
    ],
    '快递拦截': [
      { ti:'快递已发出还能拦截吗？——顺丰/中通拦截指南', url:'express-guide.cn/intercept',
        sn:'已发出的快递可通过客服热线申请拦截。需要提供：快递单号、收件人信息、寄件人身份验证。' +
           '拦截成功率约60%-80%，取决于当前物流节点。<br>' +
           '<span style="color:var(--icon-clue-glow);font-size:11px;">' +
           '🟡 一个正在计划逃跑的人查这个，不是为了拦截快递——是为了确认自己的快递够不够安全。</span>' }
    ],
    SHA256: [
      { ti:'SHA-256 哈希算法详解', url:'cryptopedia.org/sha256',
        sn:'SHA-256（Secure Hash Algorithm 256-bit）是一种密码散列函数。' +
           '任意长度的输入都会产生一个256位（64字符十六进制）的固定长度输出。' +
           '常用于文件完整性校验——相同的文件永远产生相同的哈希值。<br>' +
           '<span style="color:var(--text-dim);font-size:11px;">' +
           '提示：校验和 = 文件指纹。如果两个文件的校验和不同，说明内容被篡改过。</span>' }
    ]
  };

  function buildBrowserApp() {
    return '<div class="browser-app">' +
      '<div class="browser-urlbar"><span class="url-lock">🔒</span>' +
        '<input type="text" class="url-input" id="browserUrlInput" placeholder="输入网址或搜索关键词…">' +
      '</div>' +
      '<div class="bookmark-bar" id="bookmarkBar"></div>' +
      '<div class="browser-content" id="browserContent"></div>' +
    '</div>';
  }

  function bindBrowserEvents(body) {
    renderBookmarks(body);
    showSearchHistory(body);
    body.querySelector('#browserUrlInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var q = e.target.value.trim();
        if (q) doSearch(body, q);
      }
    });
  }

  function renderBookmarks(body) {
    body.querySelector('#bookmarkBar').innerHTML =
      '<span class="bookmark-item folder" data-folder="work">📂 日常工作 ▾</span>' +
      '<span class="bookmark-item" data-pn="1" style="display:none;" id="bmProjectNull">🔗 Project Null</span>';
    body.querySelector('[data-folder="work"]').addEventListener('click', function() {
      var bm = body.querySelector('#bmProjectNull');
      bm.style.display = bm.style.display === 'none' ? '' : 'none';
    });
    body.querySelector('#bmProjectNull').addEventListener('click', function() {
      body.querySelector('#browserUrlInput').value = 'null-project.dev/login';
      showProjectNullLoginInBrowser(body);
    });
  }

  function showSearchHistory(body) {
    body.querySelector('#browserUrlInput').value = 'search://history';
    var html = '<div style="color:var(--text-dim);font-size:12px;margin-bottom:12px;">' +
      '🔍 搜索历史（按时间倒序）</div><ul class="search-history">';
    for (var i = 0; i < searchHistory.length; i++) {
      var s = searchHistory[i];
      html += '<li><span class="sh-time">' + s.t + '</span>' +
        '<span class="sh-query" data-query="' + s.q.replace(/"/g, '&quot;') + '">' + s.q + '</span></li>';
    }
    html += '</ul>';
    body.querySelector('#browserContent').innerHTML = html;
    var queries = $$('.sh-query', body);
    for (var j = 0; j < queries.length; j++) {
      queries[j].addEventListener('click', function() {
        body.querySelector('#browserUrlInput').value = this.dataset.query;
        doSearch(body, this.dataset.query);
      });
    }
    State.findClue('C05');
    refreshUI();
  }

  function doSearch(body, query) {
    body.querySelector('#browserUrlInput').value = query;
    var results = [];
    var keys = Object.keys(searchResults);
    for (var i = 0; i < keys.length; i++) {
      if (query.indexOf(keys[i]) !== -1) {
        results = results.concat(searchResults[keys[i]]);
      }
    }
    // 快递拦截 → C19 子碎片
    if (query.indexOf('快递拦截') !== -1) {
      var trig = State.markC19Fragment('searchExpress');
      if (trig) refreshUI();
    }
    if (results.length === 0) {
      body.querySelector('#browserContent').innerHTML =
        '<div style="color:var(--text-dim);padding:40px;text-align:center;">' +
        '没有找到与"' + query + '"相关的结果。<br><br>' +
        '<a href="javascript:void(0)" onclick="var bd=document.querySelector(\'#browserContent\');' +
        'document.querySelector(\'#browserUrlInput\').value=\'search://history\';' +
        'if(window.Haveren) {var body=bd.parentElement;Haveren._showSearchHistory(body);}' +
        '" style="color:var(--accent);">返回搜索历史</a></div>';
    } else {
      var isPharma = (query.indexOf('甘舒平') !== -1 || query.indexOf('瑞康') !== -1);
      var html = '<div style="margin-bottom:12px;color:var(--text-dim);font-size:12px;">' +
        '共 ' + results.length + ' 条结果</div>';
      for (var j = 0; j < results.length; j++) {
        var r = results[j];
        html += '<div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.04);">' +
          '<a href="javascript:void(0)" style="color:var(--accent);font-size:15px;">' + r.ti + '</a>' +
          '<div style="color:#5a8a5a;font-size:11px;">' + r.url + '</div>' +
          '<div style="font-size:13px;margin-top:4px;color:var(--text-dim);">' + r.sn + '</div>' +
        '</div>';
      }
      if (isPharma) {
        html += '<div style="margin-top:20px;padding:12px;background:rgba(255,107,53,0.04);' +
          'border-radius:4px;font-size:12px;color:var(--icon-clue-glow);">' +
          '💡 搜索结果提到"不良事件"和数据完整性。林也在 2024 年 3 月离职时下载了一批文件——' +
          '你也许应该看看他云盘里的东西。</div>';
      }
      body.querySelector('#browserContent').innerHTML = html;
    }
  }

  // 浏览器内的 Project Null 登录页（FIX: 现在有完整事件绑定）
  function showProjectNullLoginInBrowser(body) {
    body.querySelector('#browserUrlInput').value = 'null-project.dev/login';
    body.querySelector('#browserContent').innerHTML =
      '<div class="login-form">' +
        '<div style="font-size:16px;color:var(--text-bright);margin-bottom:24px;">🔐 Project Null · 登录</div>' +
        '<div class="login-field"><label>用户名</label>' +
          '<input type="text" id="pnUser_br" value="lye"></div>' +
        '<div class="login-field"><label>密码（格式：XXXXXX-XXXXXXXXXX）</label>' +
          '<input type="text" id="pnPass_br" placeholder="碎片拼合"></div>' +
        '<div class="login-hint" style="font-size:11px;color:var(--text-dim);margin:8px 0;">' +
          '前半段在 N 的对话 · 后半段在 G3 照片 EXIF</div>' +
        '<button class="login-btn" id="pnLoginBtn_br">登录</button>' +
        '<div class="login-error" id="pnLoginError_br">密码错误</div>' +
      '</div>';

    var btn   = body.querySelector('#pnLoginBtn_br');
    var inp   = body.querySelector('#pnPass_br');
    var error = body.querySelector('#pnLoginError_br');

    function doLogin() {
      if (inp.value === '6a2c8f-RGK2024NOV') {
        State.set('projectNullLoggedIn', true);
        State.findClue('C07'); State.findClue('C08');
        State.findClue('C16'); State.findClue('C09');
        refreshUI();
        body.querySelector('#browserContent').innerHTML =
          '<div style="color:var(--accent);font-size:15px;margin-bottom:16px;">✅ 登录成功</div>' +
          '<div style="color:var(--text);font-size:13px;line-height:2;">' +
          '已自动重定向至 Project Null 文件管理器。<br><br>' +
          '提示：桌面上的"文件"图标也已经解锁，可以直接从桌面访问。<br><br>' +
          '<a href="javascript:void(0)" onclick="var bd=document.querySelector(\'#browserContent\');' +
          'document.querySelector(\'#browserUrlInput\').value=\'search://history\';' +
          'if(window.Haveren && window.Haveren._showSearchHistory)window.Haveren._showSearchHistory(bd.parentElement);" style="color:var(--accent);">' +
          '返回搜索历史</a></div>';
        // 刷新已打开的文件窗口
        var fw = openWindows['files'];
        if (fw && fw.style.display !== 'none') {
          var fbd = fw.querySelector('.window-body');
          fbd.innerHTML = buildFilesContentOnly();
          renderFileList(fbd);
          bindFilesEvents(fbd);
        }
      } else {
        error.style.display = 'block';
      }
    }
    btn.addEventListener('click', doLogin);
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 3：聊天
  // ═══════════════════════════════════════════════════════════════
  var chatContacts = [
    { id:'duya',    name:'渡鸦', subtitle:'线上好友 · 游戏搭子' },
    { id:'n',       name:'N',    subtitle:'身份不明' },
    { id:'chenjie', name:'陈姐', subtitle:'姐姐' }
  ];

  var chatMessages = {
    duya: [
      { sender:'林也', time:'2025-06-12 23:50',
        text:'发你了，老地方。以后这个号也许不用了。谢谢你这几年的聊天。真的。' },
      { sender:'林也',   time:'2025-06-10 22:14', text:'最近如果几天没上线别担心，我出去走走。' },
      { sender:'渡鸦',   time:'2025-06-10 22:18', text:'去哪？三亚？' },
      { sender:'林也',   time:'2025-06-10 22:19', text:'哈哈，可能吧。还不确定。' },
      { sender:'渡鸦',   time:'2025-04-12 00:01', text:'生日快乐！又老了一岁，幸运数字别忘了。🎂' },
      { sender:'林也',   time:'2025-04-12 00:15',
        text:'哈哈哈谢谢！确实又老了。幸运数字陪我这么多年了，怎么会忘。' },
      { sender:'林也',   time:'2024-03-18 09:35', text:'离职了，终于。感觉像从监狱里出来。' },
      { sender:'渡鸦',   time:'2024-03-18 09:42', text:'恭喜！瑞康那边到底怎么了？' },
      { sender:'林也',   time:'2024-03-18 09:44', text:'说来话长。以后再聊吧。现在只想休息。' },
      { sender:'林也',   time:'2024-01-07 15:20',
        text:'我最近在研究一个关于医药公司黑幕的题材，发现比我想象的真实多了。哈哈。' },
      { sender:'渡鸦',   time:'2024-01-07 15:25', text:'做游戏还是写小说？' },
      { sender:'林也',   time:'2024-01-07 15:26',
        text:'游戏。一个文字解谜类的。你到时候可以帮我测。' },
      { sender:'渡鸦',   time:'2022-05-20 20:30', text:'我们认识快四年了吧？' },
      { sender:'林也',   time:'2022-05-20 20:32',
        text:'嗯，从那个破服务器开始。你还记得地址吗？' },
      { sender:'渡鸦',   time:'2022-05-20 20:33',
        text:'当然。42.193.158.17:27015。那破服就没换过。' },
      { sender:'林也',   time:'2022-05-20 20:34', text:'哈哈哈哈对。老服务器永远不会关。' },
      { sender:'渡鸦',   time:'2018-09-03 22:10', text:'嘿，加个好友吗？刚才那局你打得不错。' },
      { sender:'林也',   time:'2018-09-03 22:11', text:'好啊。你叫渡鸦？我是林也。' }
    ],
    n: [
      { sender:'N',    time:'2025-06-13 04:02',
        text:'别再登录这个号了。我会清掉这条对话的记录。自己保重。' },
      { sender:'林也', time:'2025-06-13 03:58', text:'我知道了。谢谢你做的一切。' },
      { sender:'N',    time:'2025-06-12 09:15',
        text:'新的入口密钥前半段：<span style="color:var(--accent);font-family:var(--font-mono);">6a2c8f</span>' +
             '，另一半在你自己拍的照片里。别放一起。' },
      { sender:'林也', time:'2025-06-12 09:17', text:'收到。后半段我会去确认。' },
      { sender:'N',    time:'2025-06-10 16:00',
        text:'他们IT部门能追踪到离职员工的数字足迹。如果你要继续，用新设备、新账号。' },
      { sender:'林也', time:'2025-06-10 16:05', text:'已经在准备了。二手笔记本，预付SIM卡。' },
      { sender:'N',    time:'2024-11-08 18:30',
        text:'我看了你发的数据。你是对的。但你不该把这些放在你的个人设备上。' },
      { sender:'林也', time:'2024-11-08 18:35', text:'那放哪？' },
      { sender:'N',    time:'2024-11-08 18:36',
        text:'云端，加密，分片存储。物理隔离。我可以帮你搭。' },
      { sender:'N',    time:'2024-09-15 11:00',
        text:'你是林也？方慧说你离职前下载了一些不应该下载的东西。' },
      { sender:'林也', time:'2024-09-15 11:12', text:'你是谁？' },
      { sender:'N',    time:'2024-09-15 11:13',
        text:'你可以叫我N。我想确认一件事——你下载了什么？' }
    ],
    chenjie: [
      { sender:'陈姐', time:'2025-06-15 09:00',
        text:'妈说你之前说要寄什么东西回来，收到了吗？但是快递单上不是你的名字。<br><br>' +
             '<span style="color:var(--icon-clue-glow);font-size:11px;">' +
             '—— 有人冒充林也往家里寄了东西。</span>' },
      { sender:'陈姐', time:'2025-06-14 17:02', text:'看到回我。妈很担心。' },
      { sender:'陈姐', time:'2025-06-14 14:30', text:'你在哪？电话打不通。' },
      { sender:'陈姐', time:'2025-06-07 19:33', text:'端午节回来吃饭吗？妈包了粽子。' },
      { sender:'林也', time:'2025-06-07 19:35', text:'今年可能回不去了，项目正忙。帮我跟妈说声抱歉。' },
      { sender:'陈姐', time:'2025-05-12 10:00', text:'你上次说在三亚那边认识了一个朋友，靠谱吗？' },
      { sender:'林也', time:'2025-05-12 10:14', text:'挺靠谱的。做户外导游的，对那一带很熟。' },
      { sender:'陈姐', time:'2025-04-05 16:00', text:'清迈那边气候怎么样？我一个同事想去旅游。' },
      { sender:'林也', time:'2025-04-05 16:07', text:'还不错，雨季刚过。房租也不贵。' },
      { sender:'陈姐', time:'2025-04-05 16:08', text:'你怎么这么清楚？你在研究什么啊？' },
      { sender:'林也', time:'2025-04-05 16:09', text:'哈哈，就随便看看。做游戏需要素材。' }
    ]
  };

  function buildChatApp() {
    return '<div class="chat-app">' +
      '<div class="chat-contact-list" id="chatContacts"></div>' +
      '<div class="chat-messages" id="chatMessages"></div>' +
    '</div>';
  }

  function bindChatEvents(body) {
    renderChatContacts(body);
    showChatMessages(body, 'duya');
  }

  function renderChatContacts(body) {
    var list = body.querySelector('#chatContacts');
    var html = '';
    for (var i = 0; i < chatContacts.length; i++) {
      var c = chatContacts[i];
      html += '<div class="chat-contact ' + (c.id === 'duya' ? 'active' : '') +
        '" data-contact="' + c.id + '">' +
        '<div>' + (c.id === 'duya' ? '🦅' : '⬤') + ' ' + c.name + '</div>' +
        '<div style="font-size:10px;color:var(--text-dim);">' + c.subtitle + '</div>' +
      '</div>';
    }
    list.innerHTML = html;
    var items = $$('.chat-contact', body);
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', function() {
        var all = $$('.chat-contact', body);
        for (var k = 0; k < all.length; k++) all[k].classList.remove('active');
        this.classList.add('active');
        showChatMessages(body, this.dataset.contact);
      });
    }
  }

  function showChatMessages(body, contactId) {
    var msgs = chatMessages[contactId] || [];
    var isDuya = contactId === 'duya';
    var isCJ   = contactId === 'chenjie';
    var html = '';
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      var isMe = isDuya && m.sender === '渡鸦';
      html += '<div class="chat-msg ' + (isMe ? 'me' : '') + '">' +
        '<div class="msg-sender">' + m.sender + ' · ' + m.time + '</div>' +
        '<div class="msg-text">' + m.text + '</div>' +
      '</div>';
    }
    body.querySelector('#chatMessages').innerHTML = html;
    body.querySelector('#chatMessages').scrollTop =
      body.querySelector('#chatMessages').scrollHeight * 0.5;

    if (isDuya) {
      State.findClue('C04');
      State.findClue('C17');
    }
    if (contactId === 'n') {
      State.findClue('C04');
    }
    // C19 fragment: 陈姐关于冒充寄件
    if (isCJ) {
      State.markC19Fragment('chenjieChat');
    }
    refreshUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 4：记事本
  // ═══════════════════════════════════════════════════════════════
  function buildNotesApp() {
    var unlocked = State.get('unlockedNotes') || {};
    var n1 = !!unlocked['note1'];
    var n3Vis = State.enoughAppsForNote3();
    var html = '<div class="notes-app" id="notesApp">' +
      '<div class="note-card" data-note="note1">' +
        '<div class="note-title">Project Null 大纲</div>' +
        '<div class="note-preview" id="note1Preview">' +
          (n1 ? '瑞康·甘舒平·III期临床…' : '内容加密') +
        '</div>' +
        (n1 ? '<div style="color:var(--accent);font-size:11px;">✅ 已解锁</div>' :
              '<div class="note-locked">🔒 需要密码</div>') +
      '</div>' +
      '<div class="note-card" data-note="note2">' +
        '<div class="note-title">新身份清单</div>' +
        '<div class="note-preview">身份证（丢失补办）· 租房合同模板…</div>' +
      '</div>';
    if (n3Vis) {
      html += '<div class="note-card" data-note="note3" style="border-left:2px solid var(--icon-clue-glow);">' +
        '<div class="note-title">给渡鸦的话</div>' +
        '<div class="note-preview">新建笔记 — 刚刚</div>' +
      '</div>';
    }
    html += '<div class="note-content" id="noteContent"></div></div>';
    return html;
  }

  function bindNotesEvents(body) {
    var cards = $$('.note-card', body);
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function() { openNote(body, this.dataset.note); });
    }
  }

  function updateNote3Visibility() {
    var win = openWindows['notes'];
    if (!win || win.style.display === 'none') return;
    var body = win.querySelector('.window-body');
    var app = body.querySelector('#notesApp');
    if (!app) return;
    var vis = State.enoughAppsForNote3();
    var existing = app.querySelector('[data-note="note3"]');
    if (vis && !existing) {
      var card = document.createElement('div');
      card.className = 'note-card';
      card.dataset.note = 'note3';
      card.style.borderLeft = '2px solid var(--icon-clue-glow)';
      card.innerHTML = '<div class="note-title">给渡鸦的话</div>' +
        '<div class="note-preview">新建笔记 — 刚刚</div>';
      card.addEventListener('click', function() { openNote(body, 'note3'); });
      app.appendChild(card);
    }
  }

  function openNote(body, noteId) {
    var unlocked = State.get('unlockedNotes') || {};
    var n1 = !!unlocked['note1'];
    var content = '';
    if (noteId === 'note1' && !n1) {
      content = '<span class="note-back" id="noteBack">← 返回</span>' +
        '<div class="locked-section">' +
          '<div style="color:var(--text-dim);font-size:13px;">🔒 笔记已加密</div>' +
          '<input type="text" class="lock-input" id="note1PwdInput" placeholder="输入密码" maxlength="20">' +
          '<div class="lock-hint">提示：密码藏在 Project Null 的文件里</div>' +
          '<div class="lock-error" id="note1PwdError">密码错误</div>' +
        '</div>';
    } else if (noteId === 'note2') {
      content = '<span class="note-back" id="noteBack">← 返回</span>' +
        '<div class="note-body">' +
        '📋 新身份清单<br><br>' +
        '· 身份证（丢失补办）<br>· 租房合同模板 · 清迈<br>' +
        '· VPN 订阅 · 两年期<br>· 二手笔记本<br>· 预付手机卡 × 3<br>' +
        '· ⚠ 给妈发消息说不要收任何以我名义寄的东西 —— 6.12<br><br>' +
        '<span style="color:var(--danger);font-size:11px;">（最后一行被加粗重复了三次）</span>' +
        '</div>';
      State.findClue('C14');
      State.markC19Fragment('note2Warning');
      refreshUI();
    } else if (noteId === 'note3') {
      content = '<span class="note-back" id="noteBack">← 返回</span>' +
        '<div class="note-body" style="line-height:2.2;">' +
        '如果你到了这里，<br>说明你真的找了很久。<br><br>' +
        '谢谢你。<br><br>' +
        '我没有死。<br>但也不能告诉你我在哪——还不是时候。<br><br>' +
        '如果你愿意等我，记住这个日期：<span style="color:var(--accent);">2025年12月21日</span>，' +
        '我们第一次在游戏里组队的日子。<br><br>' +
        '那天我会在老服务器上开一个房间。<br>房间名是 Project Null 的校验码。<br><br>' +
        '你知道怎么找到校验码。<br><br>—— 林也</div>';
      State.findClue('C15');
      refreshUI();
    } else {
      // note1 unlocked
      content = '<span class="note-back" id="noteBack">← 返回</span>' +
        '<div class="note-body">' +
        '瑞康·甘舒平·III期临床<br><br>' +
        '受试者：W-047, W-089, W-103 — 全部死于心脏骤停<br>' +
        '官方结论：基础疾病恶化<br>' +
        '实际数据：血药浓度超标 3.2x — 非正常峰值 — 可能是给药方案缺陷<br><br>' +
        '关键人物：<br>· 周明远（临床总监）<br>· 方慧（数据组组长）<br><br>' +
        '数据已导出至 Project Null 云端 — 密码同邮件系统<br><br>—— L.Y. · 2025.6.12</div>';
    }
    var ce = body.querySelector('#noteContent');
    ce.innerHTML = content;
    ce.classList.add('active');
    body.querySelector('#notesApp').style.display = 'none';

    var backBtn = body.querySelector('#noteBack');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        ce.classList.remove('active'); ce.innerHTML = '';
        body.querySelector('#notesApp').style.display = '';
      });
    }

    // 笔记 1 密码
    var pwdInput = body.querySelector('#note1PwdInput');
    if (pwdInput) {
      pwdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          if (pwdInput.value === 'null2024') {
            var ul = State.get('unlockedNotes') || {};
            ul['note1'] = true;
            State.set('unlockedNotes', ul);
            refreshUI();
            // 直接替换内容（不再全窗口重建）
            ce.innerHTML = '<span class="note-back" id="noteBack">← 返回</span>' +
              '<div class="note-body">' +
              '瑞康·甘舒平·III期临床<br><br>' +
              '受试者：W-047, W-089, W-103 — 全部死于心脏骤停<br>' +
              '官方结论：基础疾病恶化<br>' +
              '实际数据：血药浓度超标 3.2x — 非正常峰值 — 可能是给药方案缺陷<br><br>' +
              '关键人物：<br>· 周明远（临床总监）<br>· 方慧（数据组组长）<br><br>' +
              '数据已导出至 Project Null 云端 — 密码同邮件系统<br><br>—— L.Y. · 2025.6.12</div>';
            var nb = body.querySelector('#noteBack');
            if (nb) nb.addEventListener('click', function() {
              ce.classList.remove('active'); ce.innerHTML = '';
              body.querySelector('#notesApp').style.display = '';
            });
          } else {
            body.querySelector('#note1PwdError').style.display = 'block';
          }
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 5：文件
  // ═══════════════════════════════════════════════════════════════
  function buildFilesApp() {
    if (State.get('projectNullLoggedIn')) return buildFilesContentOnly();
    return '<div class="login-form">' +
      '<div style="font-size:16px;color:var(--text-bright);margin-bottom:24px;">🔐 Project Null · 登录</div>' +
      '<div class="login-field"><label>用户名</label>' +
        '<input type="text" id="pnUser2" value="lye"></div>' +
      '<div class="login-field"><label>密码（格式：XXXXXX-XXXXXXXXXX）</label>' +
        '<input type="text" id="pnPass2" placeholder="碎片拼合"></div>' +
      '<div class="login-hint" style="font-size:11px;color:var(--text-dim);margin:8px 0;">' +
        '前半段在 N 的对话 · 后半段在 G3 照片 EXIF</div>' +
      '<button class="login-btn" id="pnLoginBtn2">登录</button>' +
      '<div class="login-error" id="pnLoginError2">密码错误</div>' +
    '</div>';
  }

  function buildFilesContentOnly() {
    return '<div style="color:var(--text-bright);font-size:16px;margin-bottom:20px;">📁 Project Null / 文件</div>' +
      '<div style="color:var(--text-dim);font-size:12px;margin-bottom:16px;">共享文件夹 · 最后更新：2025年6月12日</div>' +
      '<ul class="file-list" id="fileList"></ul>' +
      '<div id="filePreview" style="margin-top:20px;display:none;"></div>';
  }

  function bindFilesEvents(body) {
    if (State.get('projectNullLoggedIn')) {
      renderFileList(body);
      return;
    }
    var btn   = body.querySelector('#pnLoginBtn2');
    var inp   = body.querySelector('#pnPass2');
    var error = body.querySelector('#pnLoginError2');
    function doLogin() {
      if (inp.value === '6a2c8f-RGK2024NOV') {
        State.set('projectNullLoggedIn', true);
        State.findClue('C07'); State.findClue('C08');
        State.findClue('C16'); State.findClue('C09');
        refreshUI();
        body.innerHTML = buildFilesContentOnly();
        renderFileList(body);
        bindFilesEvents(body);
      } else {
        error.style.display = 'block';
      }
    }
    btn.addEventListener('click', doLogin);
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  }

  var fileData = {
    'README.txt': {
      icon:'📄', type:'文本',
      content: '<div style="font-size:15px;line-height:2;color:var(--text);">' +
        '这不是一个游戏。<br>或者可以说，这是一场真实的游戏。<br><br>' +
        '<span style="color:var(--text-dim);">时间和顺序会自己说话。</span><br><br>—— L.Y.</div>'
    },
    'data_raw.xlsx': { icon:'📊', type:'表格', content: '' },
    'data_modified.xlsx': { icon:'📊', type:'表格', content: '' },
    'contacts.md': {
      icon:'📋', type:'文本',
      content: '<div style="font-size:13px;line-height:2.2;">' +
        '<strong>联系人</strong><br><br>' +
        '周明远 · 临床总监 · 瑞康医药<br>' +
        '方慧 · 数据组组长 · 瑞康医药<br>' +
        'N · 身份不明<br>' +
        '陈姐 · 姐姐<br>' +
        '渡鸦 · 好友 · 线上<br></div>'
    },
    'key_fragment_3.txt': {
      icon:'🔑', type:'文本',
      content: '<div style="font-size:14px;line-height:2;color:var(--text);">' +
        '笔记密码：<span style="color:var(--accent);font-family:var(--font-mono);font-size:16px;">null2024</span>' +
        '<br><br><span style="color:var(--text-dim);font-size:12px;">' +
        '—— 这是碎片 #3。碎片 #1 在聊天里，#2 在相册里。</span></div>'
    },
    'checksum.txt': {
      icon:'🔒', type:'文本',
      content: '<div style="font-size:14px;line-height:2;font-family:var(--font-mono);color:var(--text);">' +
        'SHA256 (Project Null v2.4):<br>' +
        '<span style="color:var(--accent);">a3f7c2d8e1b4096f5a7c3d2e8f1b4a6c9d0e2f3a5b7c8d1e4f6a0b2c3d5e7</span>' +
        '<br><br><span style="color:var(--text-dim);font-size:12px;">' +
        '校验和生成时间：2025-06-12 22:47<br>文件完整性：✓ 通过</span><br><br>' +
        '<span style="color:var(--icon-clue-glow);font-size:11px;">' +
        '💡 这个校验码看起来很长。如果你需要一个"唯一的密钥"——这可能就是。</span></div>'
    }
  };

  function buildDataTable(type) {
    var isMod = type === 'modified';
    var rows = [
      ['W-047','42','128','3.1','正常','心脏骤停'],
      ['W-089','38','256','4.7','正常','心脏骤停'],
      ['W-103','45','192','2.8','正常','心脏骤停'],
      ['W-015','52','144','2.1','正常','正常'],
      ['W-021','36','310','3.9','正常','正常'],
      ['W-056','41','178','2.5','正常','正常'],
      ['W-078','39','201','3.3','正常','正常']
    ];
    var title = isMod ? '官方版本（提交FDA）' : '原始实验数据';
    var note = isMod
      ? '<div style="color:var(--danger);font-size:12px;margin-top:12px;">' +
        '⚠ 前三行被折叠——W-047/W-089/W-103 发生了"心脏骤停"，在官方版中被标记为"基础疾病恶化"。</div>'
      : '<div style="color:var(--icon-clue-glow);font-size:12px;margin-top:12px;">' +
        '🟡 纵向读前三个受试者编号第一个数字 → ' +
        '<span style="font-family:var(--font-mono);">2024-11-07</span> → 日期？谁的？G3 照片的修改日期。</div>';
    var rh = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var hi = (i < 3);
      var hs = hi && !isMod ? 'background:rgba(255,107,53,0.08);' : '';
      var cs = hi && isMod ? 'display:none;' : '';
      var age = isMod ? r[5] : r[1];
      var conc = isMod ? (i < 3 ? String(parseInt(r[2]) * 0.6) : r[2]) : r[2];
      var peak = isMod ? '正常' : r[3];
      var jdg  = isMod ? '正常' : r[4];
      rh += '<tr style="' + hs + cs + '" class="' + (isMod && hi ? 'collapsed-row' : '') + '">' +
        '<td style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.04);font-family:var(--font-mono);">' + r[0] + '</td>' +
        '<td style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.04);">' + age + '</td>' +
        '<td style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.04);">' + conc + '</td>' +
        '<td style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.04);">' + peak + '</td>' +
        '<td style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.04);">' + jdg + '</td>' +
      '</tr>';
    }
    return '<div style="font-size:14px;margin-bottom:8px;color:var(--text-bright);">' +
      (isMod ? '📊 data_modified.xlsx' : '📊 data_raw.xlsx') + ' — ' + title + '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
      '<tr style="color:var(--text-dim);">' +
        '<td style="padding:6px 12px;">受试者ID</td><td style="padding:6px 12px;">年龄</td>' +
        '<td style="padding:6px 12px;">血药浓度(ng/mL)</td><td style="padding:6px 12px;">峰值</td>' +
        '<td style="padding:6px 12px;">判定</td></tr>' +
      rh + '</table>' + note;
  }

  function renderFileList(body) {
    var list = body.querySelector('#fileList');
    if (!list) return;
    var keys = Object.keys(fileData);
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var d = fileData[keys[i]];
      html += '<div class="file-item" data-file="' + keys[i] + '">' +
        '<span class="file-icon">' + d.icon + '</span>' +
        '<span class="file-name">' + keys[i] + '</span>' +
        '<span class="file-type">' + d.type + '</span></div>';
    }
    list.innerHTML = html;
    var items = $$('.file-item', body);
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', function() {
        var name = this.dataset.file;
        var d = fileData[name];
        var pv = body.querySelector('#filePreview');
        pv.style.display = 'block';
        var content = d.content;
        if (name === 'data_raw.xlsx') content = buildDataTable('raw');
        if (name === 'data_modified.xlsx') content = buildDataTable('modified');
        pv.innerHTML = '<div style="font-size:18px;margin-bottom:12px;">' + d.icon + ' ' + name + '</div>' + content;
        if (name === 'data_raw.xlsx') { State.findClue('C08'); State.findClue('C09'); }
        if (name === 'data_modified.xlsx') State.findClue('C08');
        if (name === 'checksum.txt') State.findClue('C16');
        if (name === 'key_fragment_3.txt') State.findClue('C07');
        refreshUI();
        setTimeout(function() {
          var rows = body.querySelectorAll('.collapsed-row');
          for (var k = 0; k < rows.length; k++) rows[k].style.display = '';
        }, 100);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 6：相册
  // ═══════════════════════════════════════════════════════════════
  var anomalyDates = {
    G09:'2025-01-05', G14:'2025-02-11', G06:'2025-03-08', G03:'2025-04-02',
    G02:'2025-05-19', G07:'2025-06-01', G11:'2025-06-12'
  };

  function buildPhotosApp() {
    var html = '<div class="photos-app">' +
      '<div style="color:var(--text-dim);font-size:12px;margin-bottom:4px;">' +
        '📷 共 47 张照片 · 按拍摄日期排列</div>' +
      '<div style="color:var(--icon-clue-glow);font-size:11px;margin-bottom:12px;">' +
        '🟠 橙色边框 = 拍摄时间与修改时间不一致（共 7 张）</div>' +
      '<div class="photo-grid" id="photoGrid">';
    var clueNums = [3, 6, 2, 7, 9, 11, 14, 17, 41];
    for (var i = 1; i <= 47; i++) {
      var num = String(i).padStart(2, '0');
      var isClue = clueNums.indexOf(i) !== -1;
      var bg = 'rgba(' + (30 + i * 5) + ',' + (20 + i * 3) + ',' + (50 + i * 4) + ',0.5)';
      var label = 'G' + num;
      if (i === 3)  { bg = 'rgba(180,100,30,0.6)'; label += ' 🏢'; }
      if (i === 17) { bg = 'rgba(200,120,40,0.4)'; label += ' 🌅'; }
      if (i === 41) { bg = 'rgba(150,90,50,0.5)';  label += ' 📱'; }
      html += '<div class="photo-thumb ' + (isClue ? 'clue' : '') + '" data-photo="G' + num +
        '" style="background:' + bg + ';font-size:12px;color:var(--text);">' + label + '</div>';
    }
    html += '</div>' +
      '<div id="photoDetail" style="display:none;margin-top:20px;padding:16px;' +
        'background:rgba(255,255,255,0.03);border-radius:8px;"></div></div>';
    return html;
  }

  function bindPhotosEvents(body) {
    var thumbs = $$('.photo-thumb', body);
    for (var i = 0; i < thumbs.length; i++) {
      thumbs[i].addEventListener('click', function() {
        showPhotoDetail(body, this.dataset.photo);
      });
    }
  }

  function showPhotoDetail(body, photoId) {
    var detail = '';
    switch (photoId) {
      case 'G03':
        detail = '<div style="font-size:16px;color:var(--text-bright);margin-bottom:12px;">🏢 G03 · 办公室</div>' +
          '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">拍摄于 2024年11月</div>' +
          '<div style="width:100%;height:200px;background:rgba(180,100,30,0.3);' +
            'border-radius:4px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">' +
            '<span style="font-size:48px;">🏢</span></div>' +
          '<div style="font-size:13px;line-height:2.2;padding:12px;background:rgba(0,0,0,0.3);border-radius:4px;">' +
            '<strong>📋 EXIF 信息</strong><br>' +
            'GPS：<span style="font-family:var(--font-mono);color:var(--accent);">31°12\'45"N 121°32\'18"E</span><br>' +
            '相机型号：<span style="font-family:var(--font-mono);color:var(--accent);">RGK2024NOV</span> ' +
            '← 这看起来像密码的后半段<br>' +
            '拍摄时间：2024年11月7日 10:23<br>' +
            '修改时间：<span style="color:var(--icon-clue-glow);">' + anomalyDates[photoId] + '</span><br><br>' +
            '<span style="color:var(--text-dim);font-size:11px;">' +
            '⚠ 相机型号不是相机型号——RGK = 瑞康。2024NOV = 2024年11月。这是一条编码信息。</span></div>';
        State.findClue('C06'); State.findClue('C10'); refreshUI();
        break;
      case 'G17':
        detail = '<div style="font-size:16px;color:var(--text-bright);margin-bottom:12px;">🌅 G17 · 晚霞</div>' +
          '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">拍摄于 2025年5月</div>' +
          '<div style="width:100%;height:200px;background:linear-gradient(180deg,rgba(200,100,40,0.5),' +
            'rgba(80,60,100,0.5));border-radius:4px;display:flex;align-items:center;' +
            'justify-content:center;margin-bottom:16px;"><span style="font-size:48px;">🌅</span></div>' +
          '<div style="font-size:13px;color:var(--text-dim);line-height:2;">' +
            '一张构图有些奇怪的晚霞照片。<br><br>' +
            '仔细看左下角，有一个路牌被故意框进了画面里。<br>' +
            '<span style="color:var(--accent);font-size:18px;">🔍 [放大左下角] → เชียงใหม่</span><br><br>' +
            '<span style="font-size:11px;">' +
            'เชียงใหม่ = Chiang Mai = 清迈<br>林也在暗示他的目的地。</span></div>';
        State.findClue('C11'); refreshUI();
        break;
      case 'G41':
        detail = '<div style="font-size:16px;color:var(--text-bright);margin-bottom:12px;">📱 G41 · 咖啡店二维码</div>' +
          '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">拍摄于 2025年6月初</div>' +
          '<div style="width:150px;height:150px;margin:0 auto 16px;background:#fff;' +
            'border-radius:4px;display:flex;align-items:center;justify-content:center;position:relative;">' +
            '<div style="width:120px;height:120px;background:linear-gradient(45deg,#000 25%,transparent 25%),' +
              'linear-gradient(-45deg,#000 25%,transparent 25%),' +
              'linear-gradient(45deg,transparent 75%,#000 75%),' +
              'linear-gradient(-45deg,transparent 75%,#000 75%);' +
              'background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0px;"></div></div>' +
          '<button id="scanQRBtn" style="width:100%;padding:10px;background:var(--accent);' +
            'color:#fff;border:none;border-radius:4px;font-size:14px;cursor:pointer;">📷 扫描二维码</button>' +
          '<div id="qrResult" style="display:none;margin-top:16px;padding:16px;' +
            'background:rgba(0,0,0,0.3);border-radius:4px;">' +
            '<div style="font-size:12px;color:var(--text-dim);">🔗 链接：null-project.dev/hidden</div>' +
            '<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px;">🔒 页面需要密码才能查看内容</div>' +
            '<div style="font-size:11px;color:var(--icon-clue-glow);margin-bottom:8px;">' +
              '💡 密码提示：相册里 7 张异常照片，按修改时间排序（1月→6月），' +
              '取每张修改日期的前两位数字连起来。例如：G09 修改于 2025-01-05 → 取 09，G14 → 取 14…</div>' +
            '<input type="text" id="qrPasswordInput" class="lock-input" ' +
              'placeholder="输入页面密码（16位数字）" style="margin-top:4px;width:100%;">' +
            '<div class="lock-error" id="qrPasswordError">密码错误 — 7 张异常照片按修改时间排序取日期前两位</div>' +
          '</div>';
        break;
      default:
        var num = parseInt(photoId.substring(1));
        var anomalyNums = [9, 14, 6, 3, 2, 7, 11];
        var isAnomaly = anomalyNums.indexOf(num) !== -1;
        var idx = isAnomaly ? anomalyNums.indexOf(num) : -1;
        detail = '<div style="font-size:16px;color:var(--text-bright);margin-bottom:12px;">📷 ' + photoId + '</div>' +
          '<div style="width:100%;height:180px;background:rgba(' + (30 + num * 5) + ',' + (20 + num * 3) + ',' +
            (50 + num * 4) + ',0.4);border-radius:4px;display:flex;align-items:center;' +
            'justify-content:center;margin-bottom:16px;">' +
            '<span style="font-size:36px;opacity:0.4;">📷</span></div>';
        if (isAnomaly) {
          detail += '<div style="font-size:13px;line-height:2;padding:12px;' +
            'background:rgba(255,107,53,0.06);border-radius:4px;">' +
            '⚠ 拍摄时间与修改时间不一致<br>' +
            '修改时间：<span style="color:var(--icon-clue-glow);font-family:var(--font-mono);">' +
            anomalyDates[photoId] + '</span><br><br>' +
            '<span style="color:var(--text-dim);font-size:11px;">' +
            '按修改时间排序的位置：第 ' + (idx + 1) + '/7 · 图片编号 ' + photoId + '</span></div>';
        } else {
          detail += '<div style="font-size:13px;color:var(--text-dim);">一张普通的照片。</div>';
        }
    }
    var de = body.querySelector('#photoDetail');
    de.style.display = 'block';
    de.innerHTML = detail +
      '<button id="photoBack" style="margin-top:12px;background:none;' +
        'border:1px solid rgba(255,255,255,0.1);color:var(--text-dim);' +
        'padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">← 返回相册</button>';
    body.querySelector('#photoBack').addEventListener('click', function() {
      de.style.display = 'none'; de.innerHTML = '';
    });

    // G41 扫描按钮
    var scanBtn = body.querySelector('#scanQRBtn');
    if (scanBtn) {
      scanBtn.addEventListener('click', function() {
        body.querySelector('#qrResult').style.display = 'block';
        State.findClue('C12'); refreshUI();
        var pwdInput = body.querySelector('#qrPasswordInput');
        pwdInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            if (pwdInput.value === '09140603020711') {
              State.set('g41Unlocked', true);
              State.findClue('C13'); refreshUI();
              body.querySelector('#qrResult').innerHTML =
                '<div style="font-size:13px;line-height:2.2;color:var(--text);' +
                  'padding:16px;background:rgba(0,0,0,0.3);border-radius:4px;">' +
                  '✅ 解密成功<br><br>' +
                  '甘舒平的第四阶段临床试验仍在招募中。<br>' +
                  '周明远知道数据有问题，但试验没有停止。<br><br>' +
                  '这是我在逃走前最后确认的一件事：<br>他们杀了三个人，还会杀更多。<br><br>' +
                  '如果你看到了这里——<br>你不是来玩游戏的。<br>你是我最后的保险。<br><br>' +
                  '把这个数据交给任何一个能阻止他们的人。<br>不要相信我一个人的结论。<br>' +
                  '去核实。去比对。去行动。<br><br>—— 林也<br>2025.6.13 凌晨</div>';
            } else {
              body.querySelector('#qrPasswordError').style.display = 'block';
            }
          }
        });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  模块 7：购物
  // ═══════════════════════════════════════════════════════════════
  var orderData = [
    { d:'6月11日', n:'数据恢复软件 专业版',           id:'ORD25061101' },
    { d:'6月10日', n:'便携硬盘 2TB · 西部数据',        id:'ORD25061009' },
    { d:'6月09日', n:'临床数据管理规范 二手书',         id:'ORD25060928' },
    { d:'6月08日', n:'二手 ThinkPad X1 Carbon',         id:'ORD25060847' },
    { d:'6月08日', n:'预付 SIM 卡 ×3',                  id:'ORD25060812' },
    { d:'5月28日', n:'Unreal Engine 5 游戏开发',        id:'ORD25052866' },
    { d:'5月15日', n:'登山背包 65L · Osprey',           id:'ORD25051533' },
    { d:'5月15日', n:'户外冲锋衣 · 防水防风',           id:'ORD25051534' },
    { d:'5月15日', n:'便携净水器 · 户外生存',           id:'ORD25051535' },
    { d:'5月10日', n:'蓝牙降噪耳机',                     id:'ORD25051021' },
    { d:'5月02日', n:'机械键盘 87键',                    id:'ORD25050278' },
    { d:'4月20日', n:'三亚民宿定金（已退款）',           id:'ORD25042055' },
    { d:'4月15日', n:'防晒霜 SPF50+',                    id:'ORD25041590' },
    { d:'4月10日', n:'东南亚旅居指南',                   id:'ORD25041044' },
    { d:'3月22日', n:'咖啡豆 埃塞俄比亚 1kg',            id:'ORD25032219' },
    { d:'3月10日', n:'鼠标垫 大号',                       id:'ORD25031007' }
  ];

  function buildShopApp() {
    return '<div class="shop-app">' +
      '<div style="color:var(--text-dim);font-size:12px;margin-bottom:16px;">🛒 近半年订单 · 共 16 笔</div>' +
      '<ul class="order-list" id="orderList"></ul>' +
      '<div id="mirrorPage" style="display:none;"></div>' +
    '</div>';
  }

  function bindShopEvents(body) {
    var list = body.querySelector('#orderList');
    var html = '';
    for (var i = 0; i < orderData.length; i++) {
      var o = orderData[i];
      html += '<div class="order-item">' +
        '<span class="order-date">' + o.d + '</span>' +
        '<span class="order-name">' + o.n + '</span>' +
        '<span class="order-id">' + o.id + '</span></div>';
    }
    list.innerHTML = html;

    var clueOrders = ['ORD25060847', 'ORD25060928', 'ORD25061009', 'ORD25061101'];
    var idEls = $$('.order-id', body);
    for (var j = 0; j < idEls.length; j++) {
      if (clueOrders.indexOf(idEls[j].textContent.trim()) !== -1) {
        idEls[j].style.color = 'var(--icon-clue-glow)';
        idEls[j].style.fontWeight = '600';
      }
      idEls[j].style.cursor = 'pointer';
      idEls[j].title = '点击查看订单详情';
    }

    list.addEventListener('click', function(e) {
      var oidEl = e.target.closest('.order-id');
      if (!oidEl) return;
      var id = oidEl.textContent.trim();
      if (clueOrders.indexOf(id) !== -1) {
        var suffixes = [];
        for (var k = 0; k < clueOrders.length; k++) {
          suffixes.push(clueOrders[k].slice(-2));
        }
        var code = suffixes.join('');
        State.findClue('C18'); refreshUI();
        openMirrorPage(body, code);
      }
    });
  }

  function openMirrorPage(body, code) {
    var me = body.querySelector('#mirrorPage');
    me.style.display = 'block';
    me.innerHTML = '<div style="padding:20px;background:rgba(0,0,0,0.3);border-radius:8px;margin-top:16px;">' +
      '<div style="color:var(--text-bright);font-size:15px;margin-bottom:16px;">📁 Project Null · 镜像备份</div>' +
      '<div style="color:var(--text-dim);font-size:12px;margin-bottom:8px;">' +
        '路径：null-project.dev/archive/<span style="color:var(--accent);font-family:var(--font-mono);">' +
        code + '</span></div>' +
      '<div style="color:var(--text-dim);font-size:11px;margin-bottom:12px;">' +
        '4 笔订单号末两位拼接 · 备份日期：6月9日</div>' +
      '<div style="font-size:13px;line-height:2.2;color:var(--text);">' +
        '6月9日备份。<br><br>' +
        '对比了方慧发来的"修正后"版本。<br>差异在 W-089 的血药浓度数据上——' +
        '他死的那天的数据被整体下调了 <span style="color:var(--danger);font-size:16px;">40%</span>。<br><br>' +
        '如果这不是人为修改，我不知道什么是。<br><br>' +
        '<span style="color:var(--text-dim);font-size:12px;">' +
        '（此备份与主文件夹存在一个时间点的差异——' +
        '你可能想检查一下主文件夹里的 checksum.txt。）</span></div>' +
      '<button id="closeMirror" style="margin-top:16px;background:none;' +
        'border:1px solid rgba(255,255,255,0.1);color:var(--text-dim);' +
        'padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">关闭</button></div>';
    body.querySelector('#closeMirror').addEventListener('click', function() {
      me.style.display = 'none';
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  结局判定引擎
  // ═══════════════════════════════════════════════════════════════
  function openEnding() {
    var found = State.getFoundClues();
    var del = State.get('deletedMailUnlocked');
    var hEv = found.indexOf('C08') !== -1 && found.indexOf('C09') !== -1;
    var hCMail = found.indexOf('C02') !== -1;
    var hCExpress = found.indexOf('C19') !== -1;

    // D: all fragments
    var dReqs = ['C08', 'C09', 'C14', 'C15', 'C16', 'C17'];
    var hasD = true;
    for (var i = 0; i < dReqs.length; i++) {
      if (found.indexOf(dReqs[i]) === -1) { hasD = false; break; }
    }
    // B: evidence + identity
    var bReqs = ['C08', 'C09', 'C14'];
    var hasB = true;
    for (var j = 0; j < bReqs.length; j++) {
      if (found.indexOf(bReqs[j]) === -1) { hasB = false; break; }
    }

    var title = '', body = '', etype = '';
    if (found.length === 0) {
      title = '你还没有开始';
      body = '桌面上还有很多东西没看过。\n\n先从邮箱开始吧——林也给你留了线索。';
      etype = 'none';
    } else if (!del) {
      title = '线索还太少';
      body = '邮箱里还有没打开的东西。\n\n回头看一眼——有些东西被藏在了不起眼的角落里。\n\n' +
             '提示：林也在第二封邮件里提到了"工具箱密码"。';
      etype = 'hint';
    } else if (hasD) {
      title = '结局 D · 真结局 —— 他还活着';
      body = '你找到了所有的碎片。\n\n' +
        '林也没有死。他在清迈，用新的身份开始新的生活。\n\n' +
        '他留给你的那封信里，有一个日期和一个服务器地址。\n你知道他在等你。\n\n' +
        '2025年12月21日\n老服务器：42.193.158.17:27015\n' +
        '房间名：a3f7c2d8e1b4096f5a7c3d2e8f1b4a6c9d0e2f3a5b7c8d1e4f6a0b2c3d5e7\n\n' +
        '他相信你会来。\n\n—— THE END ——';
      etype = 'D';
    } else if (hasB && !hCExpress && found.length >= 10) {
      title = '结局 B · 逃逸 —— 他成功了';
      body = '你找到了足够的线索来证明一件事：\n林也还活着，而且他是自己选择消失的。\n\n' +
        '新身份、新城市、新的开始。\n他在清迈的登山装备订单证实了这一点。\n\n' +
        '但你总觉得缺了点什么——\n陈姐提到过有人冒充他寄了快递。\n你没来得及确认那件事。\n\n—— END ——';
      etype = 'B';
    } else if (hEv && hCMail && hCExpress && !hasB && found.length >= 7) {
      title = '结局 C · 截获 —— 他没有逃掉';
      body = '数据篡改的证据确凿。\n\n你追踪了那封邮件的 IP——' +
        '它来自瑞康医药的内部服务器。\n\n' +
        '有人冒充林也往他家寄了东西。\n他在浏览器里搜过"快递拦截"。\n\n' +
        '但没有找到他准备新身份的证据。\n\n他也许回去删数据了。\n也许回去找证据了。\n' +
        '也许——被截住了。\n\n—— END ——';
      etype = 'C';
    } else if (hEv && !hasB && found.length >= 5) {
      title = '结局 A · 沉没 —— 真相浮出水面';
      body = '你找到了甘舒平临床试验的数据篡改证据。\n' +
        '三个受试者——W-047、W-089、W-103——他们的死被掩盖了。\n\n' +
        '但林也是否还活着？\n他是主动消失还是被迫消失？\n你找不到答案。\n\n' +
        '证据可以揭露，但人——\n也许再也找不到了。\n\n—— END ——';
      etype = 'A';
    } else {
      title = '碎片还不够';
      body = '你发现了 ' + found.length + ' 条线索。\n\n' +
        '已经能看到一些碎片了，但还远远不够。\n继续搜索每一个角落。\n\n' +
        '也许可以从聊天记录和相册入手。';
      etype = 'hint';
    }

    State.set('endingTriggered', true);
    var existing = document.querySelector('.ending-overlay');
    if (existing) existing.remove();

    var ov = document.createElement('div');
    ov.className = 'ending-overlay';
    ov.innerHTML = '<div class="ending-card">' +
      '<div class="ending-title">' + title + '</div>' +
      '<div class="ending-body" style="white-space:pre-wrap;">' + body + '</div>' +
      (etype !== 'none' && etype !== 'hint'
        ? '<div style="margin-top:12px;color:var(--text-dim);font-size:12px;">' +
          '已发现线索：' + found.length + '/' + TOTAL_CLUES + '</div>'
        : '') +
      '<button class="ending-close">返回桌面</button></div>';
    document.body.appendChild(ov);
    ov.querySelector('.ending-close').addEventListener('click', function() { ov.remove(); });
  }

  // ═══════════════════════════════════════════════════════════════
  //  暴露 & 启动
  // ═══════════════════════════════════════════════════════════════
  window.Haveren = {
    createWindow: createWindow,
    closeWindow: closeWindow,
    activateWindow: activateWindow,
    refreshUI: refreshUI,
    State: State,
    _showSearchHistory: showSearchHistory,
    _H_showSearchHistory: showSearchHistory
  };

  refreshUI();
  console.log('%c🖥️  HAVEREN OS %cv0.4 · 全部就绪', 'color:#00cc88;font-size:16px;', 'color:#888;');
  console.log('%c「消失的人」· 网页解密游戏', 'color:#aaa;font-style:italic;');
  console.log('%c8 项 BUG 修复 · 6 项体验优化', 'color:#666;');
})();
