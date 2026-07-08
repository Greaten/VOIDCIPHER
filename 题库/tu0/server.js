/**
 * 反向图灵测试 — 网页解密游戏服务器
 * 
 * 运行: node server.js
 * 访问: http://localhost:8848
 * 
 * 特殊处理:
 * - /observation-room.html 响应头注入 X-Clue
 * - 禁止直接访问某些页面（必须通过关键词跳转）
 * - 自定义 404 页面
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8848;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 页面访问追踪
const visitorLog = new Map();
let globalVisitorCount = 1834; // 初始值，制造"已经有很多人"的错觉

function getMIME(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname);

  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname} — ${getClientIP(req)}`);

  // 路由匹配: 自动追加 .html (仅用于无后缀的路径)
  const pathExt = path.extname(filePath);
  if (!pathExt && !url.pathname.endsWith('/')) {
    // 先试原始路径，不存在则加 .html
    if (!fs.existsSync(filePath)) {
      filePath += '.html';
    }
  }

  // 规范化路径用于头注入匹配
  const normalizedPath = url.pathname.replace(/\.html$/, '');

  // 特殊路由: 观测室 — 注入 X-Clue 响应头
  if (normalizedPath === '/observation-room') {
    res.setHeader('X-Clue', '/they-are-watching-you');
    res.setHeader('X-Observer-ID', `OBS-${globalVisitorCount}`);
    res.setHeader('X-Player-Count', String(globalVisitorCount));
    res.setHeader('X-Reality-Status', 'unstable');
    globalVisitorCount++;
  }

  // 所有页面注入通用头
  res.setHeader('X-Game', 'Reverse-Turing-Test');
  res.setHeader('X-Powered-By', 'something-else');

  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 自定义 404
        const notFoundPath = path.join(ROOT, '404.html');
        fs.readFile(notFoundPath, (err404, data404) => {
          if (err404) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404</h1><p>这个页面不存在。或者说，它还不存在。</p>');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data404);
          }
        });
        return;
      }
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // robots.txt 和 sitemap.xml 特殊处理
    if (url.pathname.endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    if (url.pathname.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    }

    res.writeHead(200, { 'Content-Type': getMIME(filePath) });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🔬 反向图灵测试 — 服务器已启动        ║
║   地址: http://localhost:${PORT}           ║
║                                          ║
║   "你怎么证明你不是网页上的一个角色？"    ║
╚══════════════════════════════════════════╝
  `);
});
