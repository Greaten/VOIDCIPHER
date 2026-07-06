/**
 * state.js - 线索状态管理 + localStorage 持久化
 * v0.4 — 修复 C07 映射、C19 复合触发、笔记 3 触发阈值
 */

const State = (() => {
  const LS_KEY = 'haveren_game_state';

  const DEFAULTS = {
    foundClues: [],
    unlockedNotes: {},
    projectNullLoggedIn: false,
    deletedMailUnlocked: false,
    mirrorPageVisited: false,
    g41Unlocked: false,
    gameStarted: false,
    endingTriggered: false,
    // C19 子碎片追踪（冒充寄件闭环的三段）
    c19Fragments: { chenjieChat: false, searchExpress: false, note2Warning: false },
  };

  let state = {};

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        state = { ...DEFAULTS, ...JSON.parse(raw) };
        // 老存档可能缺 c19Fragments
        if (!state.c19Fragments) state.c19Fragments = { chenjieChat: false, searchExpress: false, note2Warning: false };
      } else {
        state = { ...DEFAULTS };
      }
    } catch (e) {
      state = { ...DEFAULTS };
    }
  }

  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  load();

  function findClue(clueId) {
    if (!state.foundClues.includes(clueId)) {
      state.foundClues.push(clueId);
      save();
      return true;
    }
    return false;
  }

  function hasClue(clueId) { return state.foundClues.includes(clueId); }
  function getFoundClues() { return [...state.foundClues]; }
  function getClueCount() { return state.foundClues.length; }
  function set(key, value) { state[key] = value; save(); }
  function get(key) { return state[key]; }

  function reset() { state = { ...DEFAULTS }; save(); }

  // ========== C19 复合触发：冒充寄件闭环 ==========
  function markC19Fragment(fragment) {
    if (!state.c19Fragments) state.c19Fragments = { chenjieChat: false, searchExpress: false, note2Warning: false };
    state.c19Fragments[fragment] = true;
    // 三段全齐 → 触发 C19
    if (state.c19Fragments.chenjieChat && state.c19Fragments.searchExpress && state.c19Fragments.note2Warning) {
      if (!state.foundClues.includes('C19')) {
        state.foundClues.push('C19');
        save();
        return true; // 新触发
      }
    }
    save();
    return false;
  }

  // ========== 应用 → 线索映射（已修正） ==========
  function hasClueInApp(appName) {
    const appClueMap = {
      mail:    ['C01', 'C02', 'C03'],
      browser: ['C05'],
      chat:    ['C04', 'C17'],
      notes:   ['C14', 'C15'],
      files:   ['C07', 'C08', 'C09', 'C16'],
      photos:  ['C06', 'C10', 'C11', 'C12', 'C13'],
      shop:    ['C18'],
    };
    const clues = appClueMap[appName] || [];
    return clues.some(id => state.foundClues.includes(id));
  }

  // ========== 笔记 3 触发：≥5/7 应用有线索（从 7/7 放宽） ==========
  function appsWithClues() {
    const apps = ['mail', 'browser', 'chat', 'notes', 'files', 'photos', 'shop'];
    return apps.filter(app => hasClueInApp(app)).length;
  }

  function enoughAppsForNote3() {
    return appsWithClues() >= 5;
  }

  return {
    findClue, hasClue, getFoundClues, getClueCount,
    set, get, reset,
    hasClueInApp, appsWithClues, enoughAppsForNote3,
    markC19Fragment,
  };
})();
