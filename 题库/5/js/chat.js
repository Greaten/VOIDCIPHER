/**
 * 鲨鲨wiki - 聊天框组件
 * 右侧悬浮聊天面板，神秘引路人引导玩家
 * 特性：打字机效果 / LocalStorage持久化 / 关键词回复 / 最小化切换
 */
(function() {
    'use strict';

    // ========== 配置 ==========
    var GUIDE_NAME = '深渊引路人';
    var GUIDE_ID = 'abyss_guide';
    var STORAGE_KEY = 'sharkwiki_chat_history';
    var FIRST_MSG_KEY = 'sharkwiki_chat_first_msg_sent';

    // ========== 预设回复词典 ==========
    var responses = {
        // 问候类
        '你好': '你好，探索者。我是游走于这些页面之间的引路人。继续翻阅wiki词条吧，真相藏在字里行间。',
        '你是谁': '我是谁并不重要。你可以叫我深渊引路人——一个在你之前踏上这条路的人。',
        '帮助': '仔细阅读每一个wiki词条。注意那些不起眼的脚注、被编辑过的段落、以及研究员们留下的只言片语。线索往往在最不经意的角落。',
        '谢谢': '不必谢我。当你找到终端密码，进入TS-09之后，才是真正的开始。',

        // 引导类
        '开始': '从首页的"深渊计划"词条开始看起吧。那个项目——N3PTUN3——隐藏着比公开资料多得多的秘密。',
        '深渊': 'N3PTUN3——代号本身就值得玩味。把字母替换成数字看看？1=N, 3=E, P, 7=T, U, 3=N... 或者说，它根本就是一个警告。',
        '计划': '深渊计划绝不仅仅是一个深海探索项目。信号异常事件、林海音博士的离职、R-07的失踪……它们都指向同一个方向。',
        '密码': 'TS-09终端的密码线索散布在这些词条之中。R-07在失踪前说过——"密码在鲨鱼的肚子里"。这不是字面意思，但也不是毫无意义的疯话。',

        // 关键词触发
        '鲨鱼': '深海鲨类是古老而智慧的生灵。它们的行为模式与那个深渊信号之间存在某种我们还无法解释的关联。关注鲨鱼行为学词条中的异常行为记录。',
        '信号': '17Hz。记住这个频率。2022年9月，波塞冬站连续72小时收到这个信号。它不是自然产生的——林海音博士最后的实验日志确认了这一点。',
        '林海音': '林海音博士，R-03，波塞冬站首席声学工程师。她在2023年1月离职，最后一次实验中记录到深渊信号对声学脉冲的"应答"。她说过一句话："有些东西在深渊下面，不应该由我们来唤醒。"',
        '波塞冬': '波塞冬研究站——人类在海底最深的据点之一。C舱通信终端室里有一台编号TS-09的终端机，物理隔离、独立加密。你需要的答案就在那里面。',
        '终端': 'TS-09运行SharkOS 3.1系统。访问它需要口令。口令线索散布在鲨鲨wiki之中，需要你把所有碎片拼凑起来。',
        'N3PTUN3': 'N3PTUN3 = Neptune（海王星/海神）。但如果你把数字读取为字母位置：N-3-P-T-U-N-3……有些研究员私下称它为"N3PTUN3不是代号，是警告"。',
        '17': '17Hz——深渊信号的基频。也是六鳃鲨集群通信的频率范围下限。巧合？林海音博士不这么认为。',

        // 进度相关
        '下一步': '如果你已经读完了首页和深渊计划词条，接下来去信号异常事件和实验日志看看。林海音博士的最后一条日志是关键。',
        '线索': '目前可以确认的关键线索：1) 17Hz信号频率；2) SCP-7协议Preamble值0xD34F；3) R-07留言"密码在鲨鱼的肚子里"；4) 六边形对称结构的位置坐标。把它们联系起来。',
        '六边形': '挑战者深渊底部的那个六边形结构——200米宽，埋在沉积物下15米。EXP-2024-012的多波束数据确认了它并非自然形成。中心有一个凹陷……或者说，入口。',

        // 默认回复池
        'default': [
            '继续翻阅wiki页面吧。每个词条都藏着一条线索，你需要把它们串联起来。',
            '我在这里太久了。久到我已经不确定自己是不是真实的。但那些信号——它们是真的。',
            '注意那些被编辑过的段落。2024年3月，大量词条经历了"修订"。谁做的？为什么？',
            'R-07在失踪前最后一条消息只有一句话。那句话指向了鲨鱼、深渊、和一个密码。',
            '你有没有想过，为什么这个wiki叫"鲨鲨wiki"？不是鲨鱼wiki，是鲨鲨。重复的"鲨"字……也许暗指某种双重结构？',
            'TS-09终端里存储着GAMMA+级别的文件。林海音最后的实验数据、完整的异常信号分析、深渊结构的多波束原始图像。你需要口令。',
        ]
    };

    // ========== DOM 结构 ==========
    var chatHTML = '' +
    '<div class="chat-toggle" id="chatToggle">' +
        '<span class="toggle-badge"></span>' +
        '<span class="toggle-icon">&#9654;</span>' +
        '聊天' +
    '</div>' +
    '<div class="chat-panel" id="chatPanel">' +
        '<div class="chat-header">' +
            '<div class="header-info">' +
                '<div class="avatar">&#9660;</div>' +
                '<div class="header-text">' +
                    '<span class="header-name">深渊引路人</span>' +
                    '<span class="header-status"><span class="status-dot"></span>在线 · 加密通道</span>' +
                '</div>' +
            '</div>' +
            '<button class="chat-btn-close" id="chatBtnClose" title="最小化">&#8212;</button>' +
        '</div>' +
        '<div class="chat-messages" id="chatMessages"></div>' +
        '<div class="chat-input-area">' +
            '<input type="text" id="chatInput" placeholder="输入消息..." maxlength="200">' +
            '<button id="chatBtnSend">发送</button>' +
        '</div>' +
    '</div>';

    // ========== 注入DOM ==========
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    var toggleBtn = document.getElementById('chatToggle');
    var chatPanel = document.getElementById('chatPanel');
    var btnClose = document.getElementById('chatBtnClose');
    var messagesEl = document.getElementById('chatMessages');
    var inputEl = document.getElementById('chatInput');
    var btnSend = document.getElementById('chatBtnSend');

    var isOpen = false;
    var isTyping = false;
    var hasUnread = false;

    // ========== LocalStorage 操作 ==========
    function loadHistory() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch(e) {
            return [];
        }
    }

    function saveHistory(messages) {
        try {
            // 只保留最近200条
            var toSave = messages.slice(-200);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch(e) {}
    }

    function hasFirstMsgBeenSent() {
        try {
            return localStorage.getItem(FIRST_MSG_KEY) === '1';
        } catch(e) {
            return false;
        }
    }

    function markFirstMsgSent() {
        try {
            localStorage.setItem(FIRST_MSG_KEY, '1');
        } catch(e) {}
    }

    // ========== 渲染消息 ==========
    function formatTime() {
        var d = new Date();
        return ('0' + d.getHours()).slice(-2) + ':' +
               ('0' + d.getMinutes()).slice(-2);
    }

    function renderMessage(msg, animate) {
        var div = document.createElement('div');
        div.className = 'chat-msg ' + (msg.sender === 'guide' ? 'guide' : 'user');
        if (!animate) {
            div.style.animation = 'none';
        }

        var senderLabel = msg.sender === 'guide' ? GUIDE_NAME : '你';
        div.innerHTML =
            '<div class="msg-sender">' + senderLabel + '</div>' +
            '<div class="msg-text">' + escapeHtml(msg.text) + '</div>' +
            '<div class="msg-time">' + (msg.time || formatTime()) + '</div>';

        messagesEl.appendChild(div);
        scrollToBottom();

        return div;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // ========== 打字机效果 ==========
    function typewriterEffect(element, text, speed, callback) {
        var i = 0;
        var textEl = element.querySelector('.msg-text');
        textEl.textContent = '';
        element.classList.add('typewriter-cursor');

        function type() {
            if (i < text.length) {
                textEl.textContent += text.charAt(i);
                i++;
                scrollToBottom();
                setTimeout(type, speed);
            } else {
                element.classList.remove('typewriter-cursor');
                if (callback) callback();
            }
        }

        type();
    }

    // ========== 添加消息 ==========
    function addMessage(sender, text, options) {
        options = options || {};
        var msg = {
            sender: sender,
            text: text,
            time: formatTime()
        };

        var history = loadHistory();
        history.push(msg);
        saveHistory(history);

        var animate = options.animate !== false;
        var el = renderMessage(msg, animate);

        if (options.typewriter && sender === 'guide') {
            isTyping = true;
            typewriterEffect(el, text, options.speed || 35, function() {
                isTyping = false;
            });
        }

        return el;
    }

    // ========== 匹配回复 ==========
    function findResponse(userInput) {
        var input = userInput.toLowerCase().trim();

        // 精确关键词匹配
        var keywords = Object.keys(responses).filter(function(k) { return k !== 'default'; });
        for (var i = 0; i < keywords.length; i++) {
            if (input.indexOf(keywords[i]) !== -1) {
                return responses[keywords[i]];
            }
        }

        // 模糊匹配
        if (input.length <= 2) {
            return '（深渊引路人似乎在等待你说些什么更有意义的话……）';
        }

        // 从默认池中随机选择
        var pool = responses['default'];
        var idx = Math.floor(Math.random() * pool.length);
        return pool[idx];
    }

    // ========== 发送用户消息并获取回复 ==========
    function sendUserMessage(text) {
        if (isTyping) return;
        if (!text.trim()) return;

        addMessage('user', text.trim(), { animate: true });

        var reply = findResponse(text);

        // 模拟延迟
        setTimeout(function() {
            addMessage('guide', reply, { typewriter: true, speed: 30 });
        }, 600 + Math.random() * 800);
    }

    // ========== 初始化：加载历史 + 首次消息 ==========
    function initChat() {
        var history = loadHistory();

        if (history.length > 0) {
            // 恢复历史消息
            history.forEach(function(msg) {
                renderMessage(msg, false);
            });
            scrollToBottom();
        }

        // 首次访问：发送引导消息
        if (!hasFirstMsgBeenSent()) {
            setTimeout(function() {
                // 根据当前页面定制引导语
                var pageName = getPageName();
                var guideMsg = getFirstMessage(pageName);
                addMessage('guide', guideMsg, { typewriter: true, speed: 32 });
                markFirstMsgSent();

                // 设置未读标记
                if (!isOpen) {
                    setUnread(true);
                }
            }, 1500);
        }
    }

    function getPageName() {
        var path = window.location.pathname;
        var file = path.split('/').pop().replace('.html', '');
        var map = {
            'index': '首页',
            'article_deep_station': '深海研究站「波塞冬」',
            'article_shark_behavior': '鲨鱼行为学',
            'article_abyss_project': '深渊计划',
            'article_signal_anomaly': '信号异常事件',
            'article_researcher_list': '研究员名录',
            'article_experiment_log': '实验日志',
            'article_comm_protocol': '深海通信协议'
        };
        return map[file] || '鲨鲨wiki';
    }

    function getFirstMessage(pageName) {
        var messages = {
            '首页': '欢迎来到鲨鲨wiki。我是深渊引路人——在你之前，已经有人走过这条路。\n\n从"深渊计划"词条开始看起吧。那个代号N3PTUN3的项目，藏着远比公开资料更多的秘密。慢慢翻阅，注意每一个脚注、每一条被编辑过的记录。当你准备好时，我会告诉你下一步该去哪里。',
            '深渊计划': '你找到了深渊计划。很好。\n\n仔细看——Phase IV的内容被编辑过，2024年3月所有条目经历了一次大规模修订。为什么？谁在掩盖什么？\n\n另外，注意N3PTUN3这个代号本身。如果把字母换成数字，会得到什么？',
            '信号异常事件': '17Hz——这是关键。林海音博士在离职前最后一份日志中写道："不要忽略17Hz。"\n\n信号每512秒重复一次，持续72小时。512是2的9次方。这些数字不是随机的。',
            '实验日志': '林海音博士的最后一条实验日志（EXP-2023-007）是整个谜题的核心。"那个信号对我们的声学脉冲有响应——不是回声，是响应。"\n\n她在日志中提到了一个文件路径：/secure/data/HAIDI-2023-019/。这个路径在TS-09终端中可以找到。',
            '研究员名录': 'R-07——失踪的数据分析师。他最后一条消息是："密码在鲨鱼的肚子里。N3PTUN3不是代号，是警告。"\n\n他不是疯癫。他是在用隐晦的方式传递信息。想想看——"鲨鱼的肚子里"可能意味着什么？',
            '深海通信协议': 'SCP-7协议的2024年3月修订中，TS-09终端的Preamble被改为0xD34F。D34F = DEAF的变体——意为"充耳不闻"。\n\n对什么充耳不闻？对那个17Hz的信号。ASF模块（异常信号过滤）被设计用来"忽略"深渊信号。但有些人不希望它被忽略。',
            '鲨鱼行为学': '鲨鱼与深渊信号之间存在某种联系。2023年12月，7只被标记的六鳃鲨同时改变迁徙路线，向挑战者深渊移动，轨迹呈同心螺旋。\n\n这不是巧合。林海音博士在鲨鱼行为学研究中记录了大量异常数据。',
            '深海研究站「波塞冬」': '波塞冬站——一切的核心。C舱通信终端室，TS-09终端机。物理隔离，独立加密。\n\n你需要找到进入TS-09的口令。线索分散在这八个词条之中——17Hz、0xD34F、N3PTUN3、R-07的留言、六边形坐标……把它们拼起来。'
        };
        return messages[pageName] || messages['首页'];
    }

    // ========== 面板开关 ==========
    function openPanel() {
        chatPanel.classList.add('open');
        isOpen = true;
        setUnread(false);
        toggleBtn.style.opacity = '0';
        toggleBtn.style.pointerEvents = 'none';
        inputEl.focus();
        scrollToBottom();
    }

    function closePanel() {
        chatPanel.classList.remove('open');
        isOpen = false;
        toggleBtn.style.opacity = '1';
        toggleBtn.style.pointerEvents = 'auto';
    }

    function togglePanel() {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function setUnread(val) {
        hasUnread = val;
        if (val) {
            toggleBtn.classList.add('unread');
        } else {
            toggleBtn.classList.remove('unread');
        }
    }

    // ========== 事件绑定 ==========
    toggleBtn.addEventListener('click', function() {
        openPanel();
    });

    btnClose.addEventListener('click', function() {
        closePanel();
    });

    btnSend.addEventListener('click', function() {
        var text = inputEl.value;
        inputEl.value = '';
        sendUserMessage(text);
    });

    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            var text = inputEl.value;
            inputEl.value = '';
            sendUserMessage(text);
        }
    });

    // ========== 启动 ==========
    initChat();

})();
