// Minimal zero-dependency Backend API (demo)
// GS Battery — sopify-sdlc demo. Real project should use Express + TypeScript per SKILL.md.
const http = require('http');

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';

// One standard response shape (mirrors SOP Phase 5 API response format)
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/health') {
    return sendJson(res, 200, { success: true, data: { status: 'ok', service: 'backend', port: PORT } });
  }

  if (url.pathname === '/api/message') {
    return sendJson(res, 200, {
      success: true,
      data: {
        message: 'สวัสดีครับ! Backend API ตอบกลับเรียบร้อย 🎉',
        service: 'GS Battery — sopify-sdlc demo backend',
        stack: 'Node.js (http) — pattern จริงคือ Express + TypeScript',
        time: new Date().toISOString(),
      },
    });
  }

  return sendJson(res, 404, { success: false, message: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[backend] listening on http://${HOST}:${PORT}`);
});
