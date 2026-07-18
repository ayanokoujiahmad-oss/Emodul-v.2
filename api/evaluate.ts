import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyFirebaseIdToken } from './_auth';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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


  const { context, message, reply } = req.body ?? {};

  if (
    typeof reply !== 'string' ||
    !reply.trim() ||
    reply.length > 1_500 ||
    (context !== undefined && (typeof context !== 'string' || context.length > 3_000)) ||
    (message !== undefined && (typeof message !== 'string' || message.length > 6_000))
  ) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      useFallback: true,
      error: 'API key not configured'
    });
  }

  const prompt = `Kamu adalah AI Mentor Cerdas untuk anak SD kelas 6 (usia 11-12 tahun). 
Anak tersebut sedang disimulasikan membalas pesan obrolan chat di media sosial atau WhatsApp secara santun.
Tugasmu adalah menilai balasan anak tersebut dan memberikan umpan balik dalam Bahasa Indonesia yang ramah, memotivasi, dan mendidik.

Konteks Kejadian: ${context || 'Media sosial'}
Pesan Sebelumya (jika ada): "${message || ''}"
Balasan Anak: "${reply}"

Aturan Klasifikasi Kesantunan:
1. 'rude': Jika anak membalas dengan kemarahan, kata kasar, makian, ejekan balik, tidak berempati, merendahkan, atau menantang berkelahi.
2. 'passive': Jika anak membalas dengan ketakutan, pasrah, meminta maaf padahal tidak salah, memohon-mohon, atau terlalu tertutup.
3. 'assertive': Jika anak membalas secara santun, sopan, berempati, memberi semangat, menengahi ejekan secara tegas dan tenang, atau memberikan ucapan selamat yang hangat.

Umpan balik (feedback) harus bernada mendidik, positif, ramah anak, dan memotivasi mereka untuk berkomunikasi dengan santun di dunia digital.
Berikan juga rekomendasi (recommendation) kalimat santun dan tegas yang sebaiknya diucapkan.

Kembalikan jawaban dalam format JSON objek dengan properti berikut:
- score: skor numerik (10 jika rude, 20 jika passive, 33 jika assertive)
- isCorrect: boolean (true jika assertive, false jika lainnya)
- type: string ("rude" | "passive" | "assertive")
- feedback: penjelasan analisis tentang balasannya (maksimal 3 kalimat)
- recommendation: saran kalimat santun dan empati yang lebih baik (maksimal 2 kalimat)`;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
              recommendation: { type: 'STRING' }
            },
            required: ['score', 'isCorrect', 'type', 'feedback', 'recommendation']
          }
        }
      })
    });

    if (response.status === 429) {
      return res.status(200).json({
        useFallback: true,
        error: 'Gemini Rate Limit Exceeded'
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return res.status(200).json({
        useFallback: true,
        error: `Gemini API returned error status: ${response.status}`
      });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      return res.status(200).json({
        useFallback: true,
        error: 'Empty response from Gemini'
      });
    }

    const parsedResult = JSON.parse(resultText);
    return res.status(200).json({
      useFallback: false,
      result: parsedResult
    });

  } catch (err: any) {
    console.error('Backend catch block error:', err);
    return res.status(200).json({
      useFallback: true,
      error: err.message || 'Unknown server error'
    });
  }
}
