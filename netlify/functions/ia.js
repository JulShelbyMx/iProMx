// Netlify Function — Proxy IA Gemini
// Node 18+ natif fetch — aucune dépendance

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[IA] GEMINI_API_KEY absent des variables d\'environnement Netlify');
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Clé API manquante — contacte l\'admin.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON invalide.' }) }; }

  const { messages, system } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  console.log('[IA] Requête reçue,', messages.length, 'messages');

  // Gemini attend user/model en alternance, commençant par user
  let safe = messages
    .slice(-12)
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content || '').slice(0, 600) }],
    }));

  // Assure que ça commence par user et termine par user
  while (safe.length && safe[0].role !== 'user')  safe.shift();
  while (safe.length && safe[safe.length-1].role !== 'user') safe.pop();
  if (!safe.length) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Message utilisateur manquant.' }) };

  const payload = {
    system_instruction: { parts: [{ text: String(system || '').slice(0, 8000) }] },
    contents: safe,
    generationConfig: { maxOutputTokens: 350, temperature: 0.75, topP: 0.9 },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  console.log('[IA] Appel Gemini API, payload contents:', safe.length);

  try {
    const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await res.text();
    console.log('[IA] Gemini status:', res.status, '| body (200 chars):', text.slice(0, 200));

    if (!res.ok) {
      console.error('[IA] Gemini erreur HTTP:', res.status, text.slice(0, 400));
      const msg = res.status === 429 ? 'Limite API atteinte, réessaie dans quelques secondes.' : 'Indisponible, réessayez plus tard.';
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: msg }) };
    }

    let data;
    try { data = JSON.parse(text); } catch(e) {
      console.error('[IA] Erreur parse JSON:', e.message);
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
    }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      const reason = data?.candidates?.[0]?.finishReason || 'unknown';
      console.error('[IA] Pas de texte dans la réponse. finishReason:', reason, '| data:', JSON.stringify(data).slice(0, 300));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Pas de réponse. Réessaie.' }) };
    }

    console.log('[IA] Succès, réponse:', answer.slice(0, 80));
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ text: answer.trim() }) };

  } catch (err) {
    console.error('[IA] Exception fetch:', err.message);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
  }
};