import { createVerify } from 'node:crypto';
import { existsSync, createReadStream, readFileSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import https from 'node:https';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(dirname, '..');
const distDir = resolve(rootDir, 'dist');
const indexPath = join(distDir, 'index.html');

const MAX_HISTORY_TURNS = 8;
const MAX_TURN_CHARS = 1_500;
const MAX_HISTORY_CHARS = 7_000;
const MAX_INSTRUCTION_CHARS = 7_000;
const MAX_JSON_BODY_BYTES = 24 * 1024;

const publicConfigKeys = [
  'VITE_DEMO_MODE',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

let cachedKeys = {};
let cacheTime = 0;

loadLocalEnv();

function loadLocalEnv() {
  const envPath = join(rootDir, '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (key in process.env) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getHeaderValue(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function getFirebaseProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '';
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(text);
}

function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

function methodNotAllowed(res) {
  sendJson(res, 405, { error: 'Method not allowed' }, { Allow: 'POST' });
}

function isUnexpectedCrossOriginRequest(req) {
  const origin = getHeaderValue(req.headers.origin);
  const host = getHeaderValue(req.headers['x-forwarded-host']) || getHeaderValue(req.headers.host);

  if (!origin || !host) return false;

  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_JSON_BODY_BYTES) {
      const error = new Error('Payload too large');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString('utf8');
  if (!text.trim()) return {};

  try {
    return JSON.parse(text);
  } catch {
    const error = new Error('Invalid JSON');
    error.statusCode = 400;
    throw error;
  }
}

function decodeBase64UrlJson(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
}

async function getGooglePublicKeys() {
  const now = Date.now();
  if (now - cacheTime < 3_600_000 && Object.keys(cachedKeys).length > 0) {
    return cachedKeys;
  }

  const keysUrl =
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com';

  const keys = await new Promise((resolvePromise, rejectPromise) => {
    https
      .get(keysUrl, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode && response.statusCode >= 400) {
            rejectPromise(new Error(`Google public keys returned HTTP ${response.statusCode}`));
            return;
          }
          resolvePromise(JSON.parse(data));
        });
      })
      .on('error', rejectPromise);
  });

  cachedKeys = keys && typeof keys === 'object' ? keys : {};
  cacheTime = now;
  return cachedKeys;
}

async function verifyFirebaseIdToken(token, projectId) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = decodeBase64UrlJson(parts[0]);
    const payload = decodeBase64UrlJson(parts[1]);
    const kid = header.kid;
    if (!kid) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;

    const keys = await getGooglePublicKeys();
    const cert = keys[kid];
    if (!cert) return null;

    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();

    const signature = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    return verifier.verify(cert, signature, 'base64') ? payload.sub : null;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}

async function requireFirebaseAuth(req, res) {
  const projectId = getFirebaseProjectId();
  if (!projectId) return true;

  const authHeader = getHeaderValue(req.headers.authorization);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendJson(res, 401, { error: 'Unauthorized: Missing token' });
    return false;
  }

  const token = authHeader.slice('Bearer '.length);
  const uid = await verifyFirebaseIdToken(token, projectId);
  if (!uid) {
    sendJson(res, 401, { error: 'Unauthorized: Invalid token' });
    return false;
  }

  return true;
}

function normalizeHistory(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_HISTORY_TURNS) {
    return null;
  }

  let totalChars = 0;
  const history = [];

  for (const turn of value) {
    if (
      !turn ||
      typeof turn !== 'object' ||
      (turn.role !== 'user' && turn.role !== 'model') ||
      typeof turn.text !== 'string'
    ) {
      return null;
    }

    const text = turn.text.trim();
    if (!text || text.length > MAX_TURN_CHARS) return null;

    totalChars += text.length;
    if (totalChars > MAX_HISTORY_CHARS) return null;

    history.push({ role: turn.role, text });
  }

  return history;
}

async function handleGemini(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return sendNoContent(res);
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (isUnexpectedCrossOriginRequest(req)) {
    return sendJson(res, 403, { error: 'Cross-origin request not allowed' });
  }
  if (!(await requireFirebaseAuth(req, res))) return;

  const body = await readJsonBody(req);
  const { systemInstruction, history } = body;

  if (
    typeof systemInstruction !== 'string' ||
    !systemInstruction.trim() ||
    systemInstruction.length > MAX_INSTRUCTION_CHARS
  ) {
    return sendJson(res, 400, { error: 'Invalid system instruction' });
  }

  const safeHistory = normalizeHistory(history);
  if (!safeHistory) return sendJson(res, 400, { error: 'Invalid chat history' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 200, { useFallback: true, error: 'AI service not configured' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
    `:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction.trim() }] },
        contents: safeHistory.map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.text }],
        })),
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Gemini simulation request failed', { status: response.status });
      return sendJson(res, 200, { useFallback: true, error: 'AI service unavailable' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return sendJson(res, 200, { useFallback: true, error: 'AI returned an empty response' });
    }

    return sendJson(res, 200, { useFallback: false, text });
  } catch (error) {
    console.error('Gemini simulation request failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return sendJson(res, 200, { useFallback: true, error: 'AI service unavailable' });
  }
}

async function handleEvaluate(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return sendNoContent(res);
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (isUnexpectedCrossOriginRequest(req)) {
    return sendJson(res, 403, { error: 'Cross-origin request not allowed' });
  }
  if (!(await requireFirebaseAuth(req, res))) return;

  const body = await readJsonBody(req);
  const { context, message, reply } = body;

  if (
    typeof reply !== 'string' ||
    !reply.trim() ||
    reply.length > 1_500 ||
    (context !== undefined && (typeof context !== 'string' || context.length > 3_000)) ||
    (message !== undefined && (typeof message !== 'string' || message.length > 6_000))
  ) {
    return sendJson(res, 400, { error: 'Invalid request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 200, { useFallback: true, error: 'API key not configured' });
  }

  const prompt = `Kamu adalah AI Mentor Cerdas untuk anak SD kelas 6 (usia 11-12 tahun).
Anak tersebut sedang disimulasikan membalas pesan obrolan chat di media sosial atau WhatsApp secara santun.
Tugasmu adalah menilai balasan anak tersebut dan memberikan umpan balik dalam Bahasa Indonesia yang ramah, memotivasi, dan mendidik.

Konteks Kejadian: ${context || 'Media sosial'}
Pesan Sebelumnya (jika ada): "${message || ''}"
Balasan Anak: "${reply}"

Aturan Klasifikasi Kesantunan:
1. 'rude': Jika anak membalas dengan kemarahan, kata kasar, makian, ejekan balik, tidak berempati, merendahkan, atau menantang berkelahi.
2. 'passive': Jika anak membalas dengan ketakutan, pasrah, meminta maaf padahal tidak salah, memohon-mohon, atau terlalu tertutup.
3. 'assertive': Jika anak membalas secara santun, sopan, berempati, memberi semangat, menengahi ejekan secara tegas dan tenang, atau memberikan ucapan selamat yang hangat.

Umpan balik harus bernada mendidik, positif, ramah anak, dan memotivasi mereka untuk berkomunikasi dengan santun di dunia digital.
Berikan juga rekomendasi kalimat santun dan tegas yang sebaiknya diucapkan.

Kembalikan jawaban dalam format JSON objek dengan properti berikut:
- score: skor numerik (10 jika rude, 20 jika passive, 33 jika assertive)
- isCorrect: boolean (true jika assertive, false jika lainnya)
- type: string ("rude" | "passive" | "assertive")
- feedback: penjelasan analisis tentang balasannya (maksimal 3 kalimat)
- recommendation: saran kalimat santun dan empati yang lebih baik (maksimal 2 kalimat)`;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
      `:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: { type: 'INTEGER' },
              isCorrect: { type: 'BOOLEAN' },
              type: { type: 'STRING', enum: ['rude', 'passive', 'assertive'] },
              feedback: { type: 'STRING' },
              recommendation: { type: 'STRING' },
            },
            required: ['score', 'isCorrect', 'type', 'feedback', 'recommendation'],
          },
        },
      }),
    });

    if (response.status === 429) {
      return sendJson(res, 200, { useFallback: true, error: 'Gemini Rate Limit Exceeded' });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return sendJson(res, 200, {
        useFallback: true,
        error: `Gemini API returned error status: ${response.status}`,
      });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      return sendJson(res, 200, { useFallback: true, error: 'Empty response from Gemini' });
    }

    return sendJson(res, 200, { useFallback: false, result: JSON.parse(resultText) });
  } catch (error) {
    console.error('Backend catch block error:', error);
    return sendJson(res, 200, {
      useFallback: true,
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}

function handleRuntimeConfig(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const config = {};
  for (const key of publicConfigKeys) {
    config[key] = process.env[key] ?? '';
  }

  const body = `window.__SIBERCERDAS_CONFIG__ = ${JSON.stringify(config)};\n`;
  res.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/javascript; charset=utf-8',
  });
  if (req.method === 'HEAD') return res.end();
  res.end(body);
}

async function serveFile(req, res, filePath, cacheControl = 'public, max-age=0') {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) return false;

  const contentType = contentTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
  res.writeHead(200, {
    'Cache-Control': cacheControl,
    'Content-Length': fileStat.size,
    'Content-Type': contentType,
  });

  if (req.method === 'HEAD') {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

async function handleStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return sendText(res, 400, 'Bad request');
  }

  const requestedPath = decodedPathname === '/' ? '/index.html' : decodedPathname;
  const filePath = resolve(distDir, `.${requestedPath}`);
  const withinDist = filePath === distDir || filePath.startsWith(`${distDir}${sep}`);

  if (!withinDist) return sendText(res, 403, 'Forbidden');

  try {
    const cacheControl = requestedPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0';
    if (await serveFile(req, res, filePath, cacheControl)) return;
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EISDIR') throw error;
  }

  if (requestedPath.startsWith('/assets/') || extname(requestedPath)) {
    return sendText(res, 404, 'Not found');
  }

  try {
    await serveFile(req, res, indexPath, 'public, max-age=0');
  } catch {
    sendText(res, 500, 'Production build not found. Run npm run build first.');
  }
}

async function handleRequest(req, res) {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/healthz') {
      return sendJson(res, 200, { ok: true });
    }

    if (url.pathname === '/runtime-config.js') {
      return handleRuntimeConfig(req, res);
    }

    if (url.pathname === '/api/gemini') {
      return handleGemini(req, res);
    }

    if (url.pathname === '/api/evaluate') {
      return handleEvaluate(req, res);
    }

    if (url.pathname.startsWith('/api/')) {
      return sendJson(res, 404, { error: 'API route not found' });
    }

    return handleStatic(req, res, url.pathname);
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;
    if (statusCode === 500) console.error('[Server] Unhandled error:', error);
    sendJson(res, statusCode, { error: message });
  }
}

export function createSiberCerdasServer() {
  return createServer(handleRequest);
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '0.0.0.0';

  createSiberCerdasServer().listen(port, host, () => {
    console.log(`SiberCerdas listening on http://${host}:${port}`);
  });
}
