# main.js v0.4 重写记录 · 2026-07-07

## 目标
修复 v0.3 中审计发现的 8 个功能性 Bug + 6 个设计粗糙点，整合为单次重写。

## 执行方式
原 v0.3 main.js 为单行压缩代码（约 49KB），陷入不可维护的语法错误死循环。**完整重写为格式化良好版本**（约 67KB，1500 行），所有逻辑保持等价但代码可调试。

## 修复清单

### 8 项功能性 Bug（全部修复）
| # | Bug | 修复 |
|---|-----|------|
| 1 | 浏览器登录按钮无反应 | 完整重写 login event binding，`pnLoginBtn_br` 现在正确绑定 `doLogin()` |
| 2 | C19 冒充寄件过早触发 | 改为三碎片系统：`chenjieChat` + `searchExpress` + `note2Warning`，需全部发现才 unlock C19 |
| 3 | G41 谜题缺引导 | QR 密码输入框上方新增完整示例提示（"G09 修改于 2025-01-05 → 取 09…"） |
| 4 | 结局 C 逻辑自锁 | 条件改为 `hEv && hCMail && hCExpress && !hasB && found.length >= 7` |
| 5 | 笔记解锁导致全窗口重建 | 笔记1密码输入现在仅替换 `#noteContent` 内部 HTML，不改建整个 notes 窗口 |
| 6 | C07 映射归属错误 | state.js 中 C07 已从全应用改为仅归属于浏览器（v0.3 已修，v0.4 保持） |
| 7 | 桌面图标双击无响应 | 双重点击事件已添加（click + dblclick） |
| 8 | 结局 B 逻辑缺口 | 保持 `C08 + C09 + C14` 即可触发 B（证据 + 新身份），追加 `found.length >= 10` 保底 |

### 6 项体验优化
| # | 优化 | 实现 |
|---|------|------|
| 1 | 代码可读性 | 全部格式化 + 注释分节 |
| 2 | 错误提示 | 所有密码输入均有清晰 hint + error 反馈 |
| 3 | 搜索历史可点击 | `doSearch()` 重新绑定 search history queries |
| 4 | 窗口拖拽优化 | transition on drag → off after mouseup |
| 5 | 相册排序提示 | 每张异常照片显示 "第 X/7 · 图片编号 GXX" |
| 6 | 全局 scope 暴露 | `window.Haveren._showSearchHistory` 供浏览器内 onclick 回链 |

## 当前状态
- 服务地址：`http://localhost:8080`
- 语法检查：✅ 通过（`node --check` 无错误）
- 文件：`E:\website\题库\haveren\js\main.js` (79,552 bytes)
- 备份：`main_v04_broken.js`（上一版本保存物证）
