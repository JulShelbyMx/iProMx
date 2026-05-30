// Netlify Function — Proxy IA via Groq (gratuit, rapide, Llama 3)
// Groq free tier : 14 400 req/jour, 6 000 tokens/min — aucune CB requise
// Clé API : https://console.groq.com/keys

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée.' }) };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[IA] GROQ_API_KEY absent des variables Netlify');
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Clé API manquante — variable GROQ_API_KEY non définie.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON invalide.' }) }; }

  const { messages, system } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Messages requis.' }) };
  }

  console.log('[IA] Requête reçue,', messages.length, 'messages');

  // Format OpenAI-compatible (Groq utilise la même API qu'OpenAI)
  const chatMessages = [
    { role: 'system', content: String(system || '').slice(0, 8000) },
    ...messages.slice(-12).map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 600),
    })),
  ];

  const payload = {
    model:       'llama-3.1-8b-instant', // Gratuit, rapide, multilingue
    messages:    chatMessages,
    max_tokens:  350,
    temperature: 0.75,
  };

  console.log('[IA] Appel Groq, messages:', chatMessages.length);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('[IA] Groq status:', res.status, '| body:', text.slice(0, 200));

    if (!res.ok) {
      console.error('[IA] Groq erreur HTTP', res.status, text.slice(0, 400));
      const msg = res.status === 429
        ? 'Indisponible, réessayez dans quelques secondes.'
        : 'Indisponible, réessayez plus tard.';
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: msg }) };
    }

    let data;
    try { data = JSON.parse(text); }
    catch { return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) }; }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      console.error('[IA] Pas de contenu dans la réponse:', JSON.stringify(data).slice(0, 300));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Pas de réponse. Réessaie.' }) };
    }

    console.log('[IA] Succès:', answer.slice(0, 80));
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ text: answer.trim() }) };

  } catch (err) {
    console.error('[IA] Exception:', err.message);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Indisponible, réessayez plus tard.' }) };
  }
};