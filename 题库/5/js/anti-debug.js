/**
 * 鲨鲨wiki - 反调试与安全模块
 * 防F12、右键、DevTools检测、定时debugger陷阱
 */
(function() {
    'use strict';

    // === 1. 禁用右键菜单 ===
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // === 2. 禁用F12和开发者工具快捷键 ===
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Element picker)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // === 3. DevTools检测（通过计时差异） ===
    var devtoolsOpen = false;
    var threshold = 160;

    function detectDevTools() {
        var start = performance.now();
        debugger;
        var end = performance.now();
        if (end - start > threshold) {
            devtoolsOpen = true;
            handleDevToolsOpen();
        }
    }

    function handleDevToolsOpen() {
        // 清空页面内容
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:1.2rem;color:#666;font-family:sans-serif;">检测到开发者工具已打开。为保护游戏完整性，请关闭后刷新页面。</div>';
        // 持续弹debugger
        setInterval(function() { debugger; }, 50);
    }

    // 定期检测
    setInterval(detectDevTools, 2000);

    // === 4. 定时debugger陷阱 ===
    setInterval(function() {
        if (!devtoolsOpen) {
            debugger;
        }
    }, 3000);

    // === 5. Console清空 ===
    if (typeof console !== 'undefined' && console.clear) {
        console.clear();
    }

    // === 6. 覆盖console.log（使调试更困难） ===
    var _console = {};
    if (typeof console !== 'undefined') {
        _console.log = console.log;
        _console.warn = console.warn;
        _console.error = console.error;
        console.log = function() {};
        // 保留error以便正常功能
        console.warn = function() {};
    }

})();
