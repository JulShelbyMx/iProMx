const fetch = require('node-fetch');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { messages, system } = body;
  if (!messages?.length) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Messages requis.' }) };

  // Convert history to Gemini format
  const safeMessages = messages.slice(-12).map(m => ({
    role:  m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.content || '').slice(0, 500) }],
  }));

  const payload = {
    system_instruction: { parts: [{ text: String(system || '').slice(0, 8000) }] },
    contents:           safeMessages,
    generationConfig: {
      maxOutputTokens: 300,
      temperature:     0.7,
    },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (res.status === 429) return { statusCode: 200, headers, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
    if (!res.ok) {
      const err = await res.text();
      console.error('[IA] Gemini error:', res.status, err.slice(0, 200));
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
    }

    const data   = await res.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse.';

    return { statusCode: 200, headers, body: JSON.stringify({ text: answer }) };
  } catch (e) {
    console.error('[IA] Function error:', e.message);
    return { statusCode: 200, headers, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
  }
};