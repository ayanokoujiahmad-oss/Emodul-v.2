// ============================================================
// Gemini AI helper â€“ used for interactive cyberbullying sims.
//
// This module deliberately does not read a VITE_ API key. Every VITE_
// variable is included in the browser build, so the Gemini key must stay in
// the server environment and requests go through /api/gemini instead.
// If the server is unavailable, callers fall back to a local scripted reply.
// ============================================================

import { auth } from './firebase';


export interface GeminiTurn {
  role: 'user' | 'model';
  text: string;
}

interface GenerateOptions {
  systemInstruction: string;
  history: GeminiTurn[];
  temperature?: number;
}

/**
 * Sends a chat history to our server endpoint and returns the raw text reply.
 * The server owns the Gemini key, model selection, output limit, and safety
 * settings, so none of those controls can be changed from the browser.
 */
export async function generateGeminiReply({
  systemInstruction,
  history,
}: GenerateOptions): Promise<string> {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers,
    body: JSON.stringify({ systemInstruction, history }),
  });

  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data?.useFallback) {
    throw new Error(data?.error || 'Gemini tidak tersedia.');
  }

  const text: string | undefined = data?.text;
  if (!text) {
    throw new Error('Gemini mengembalikan respons kosong.');
  }
  return text;
}

/**
 * Safely parses a JSON object out of a model reply that may be
 * wrapped in markdown fences or contain extra text.
 */
export function parseJsonReply<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
