// Netlify Function — Proxy IA vers Gemini (évite CORS)
// Node 18+ : fetch natif disponible, pas besoin de node-fetch

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[IA] GEMINI_API_KEY manquant');
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'JSON invalide.' }) };
  }

  const { messages, system } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  // Gemini: l'historique doit alterner user/model et commencer par user
  const safe = messages
    .slice(-12)
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content || '').slice(0, 600) }],
    }));

  // S'assurer que le dernier message est bien de l'utilisateur
  while (safe.length > 0 && safe[safe.length - 1].role !== 'user') safe.pop();
  if (safe.length === 0) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Message utilisateur requis.' }) };
  }

  const payload = {
    system_instruction: {
      parts: [{ text: String(system || '').slice(0, 8000) }],
    },
    contents: safe,
    generationConfig: {
      maxOutputTokens: 350,
      temperature:     0.75,
      topP:            0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('[IA] Gemini HTTP', res.status, text.slice(0, 300));
      if (res.status === 429) {
        return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
      }
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
    }

    let data;
    try { data = JSON.parse(text); }
    catch { return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) }; }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      console.error('[IA] Réponse vide:', JSON.stringify(data).slice(0, 300));
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Pas de réponse. Réessaie.' }) };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: answer.trim() }),
    };

  } catch (err) {
    console.error('[IA] Fetch error:', err.message);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }),
    };
  }
};