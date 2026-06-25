// Minimal zero-dependency Frontend server (demo)
// Serves index.html and proxies /api/* to the backend so the browser only
// needs the frontend's forwarded URL (avoids cross-origin issues in preview).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';

const server = http.createServer((req, res) => {
  // Proxy API calls to the backend
  if (req.url.startsWith('/api/')) {
    const target = new URL(req.url, BACKEND);
    const proxyReq = http.request(
      target,
      { method: req.method, headers: { ...req.headers, host: target.host } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Backend unreachable: ' + err.message }));
    });
    req.pipe(proxyReq);
    return;
  }

  // Serve the single-page index.html for everything else
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[frontend] listening on http://${HOST}:${PORT} (proxy /api -> ${BACKEND})`);
});
