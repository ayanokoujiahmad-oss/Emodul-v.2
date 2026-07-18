import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyFirebaseIdToken } from './_auth';


type GeminiTurn = {
  role: 'user' | 'model';
  text: string;
};

const MAX_HISTORY_TURNS = 8;
const MAX_TURN_CHARS = 1_500;
const MAX_HISTORY_CHARS = 7_000;
const MAX_INSTRUCTION_CHARS = 7_000;

function normalizeHistory(value: unknown): GeminiTurn[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_HISTORY_TURNS) {
    return null;
  }

  let totalChars = 0;
  const history: GeminiTurn[] = [];

  for (const turn of value) {
    if (
      !turn ||
      typeof turn !== 'object' ||
      !('role' in turn) ||
      !('text' in turn) ||
      ((turn as { role: unknown }).role !== 'user' && (turn as { role: unknown }).role !== 'model') ||
      typeof (turn as { text: unknown }).text !== 'string'
    ) {
      return null;
    }

    const text = (turn as { text: string }).text.trim();
    if (!text || text.length > MAX_TURN_CHARS) {
      return null;
    }

    totalChars += text.length;
    if (totalChars > MAX_HISTORY_CHARS) {
      return null;
    }

    history.push({ role: (turn as GeminiTurn).role, text });
  }

  return history;
}

function isUnexpectedCrossOriginRequest(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;

  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isUnexpectedCrossOriginRequest(req)) {
    return res.status(403).json({ error: 'Cross-origin request not allowed' });
  }

  // Verify Firebase ID Token if Firebase project ID is configured
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (projectId) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.substring(7);
    const uid = await verifyFirebaseIdToken(token, projectId);
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }


  const { systemInstruction, history } = req.body ?? {};
  if (
    typeof systemInstruction !== 'string' ||
    !systemInstruction.trim() ||
    systemInstruction.length > MAX_INSTRUCTION_CHARS
  ) {
    return res.status(400).json({ error: 'Invalid system instruction' });
  }

  const safeHistory = normalizeHistory(history);
  if (!safeHistory) {
    return res.status(400).json({ error: 'Invalid chat history' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ useFallback: true, error: 'AI service not configured' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

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
      return res.status(200).json({ useFallback: true, error: 'AI service unavailable' });
    }

    const data = await response.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(200).json({ useFallback: true, error: 'AI returned an empty response' });
    }

    return res.status(200).json({ useFallback: false, text });
  } catch (error) {
    console.error('Gemini simulation request failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return res.status(200).json({ useFallback: true, error: 'AI service unavailable' });
  }
}
