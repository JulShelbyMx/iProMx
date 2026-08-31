// Vérifie le mot de passe du "Mode développeur" côté serveur.
// Le mot de passe réel n'est jamais envoyé au client : seule la variable
// d'environnement Netlify DEV_MODE_PASSWORD (à créer dans Site settings ->
// Environment variables) sert de référence.
const admin = require('firebase-admin');

let dbAvailable = true;
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
} catch (e) {
  dbAvailable = false;
}
const db = dbAvailable ? admin.firestore() : null;

const MAX_ATTEMPTS = 10;
const WINDOW = 60 * 60 * 1000; // 1h

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const REAL_PASSWORD = process.env.DEV_MODE_PASSWORD;
  if (!REAL_PASSWORD) {
    console.error('[verify-dev-password] DEV_MODE_PASSWORD non configurée sur Netlify.');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false })
    };
  }

  let password;
  try {
    password = JSON.parse(event.body || '{}').password;
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }
  if (typeof password !== 'string' || !password) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false })
    };
  }

  // Anti brute-force léger (best-effort, ne bloque jamais si Firestore indispo)
  if (db) {
    try {
      const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim()
               || event.headers['client-ip'] || 'unknown';
      const ref = db.collection('_rate_limits').doc(`devpwd_${ip.replace(/[.:]/g, '_')}`);
      const now = Date.now();
      const allowed = await db.runTransaction(async (tx) => {
        const doc = await tx.get(ref);
        const data = doc.exists ? doc.data() : { count: 0, windowStart: now };
        if (now - data.windowStart > WINDOW) {
          tx.set(ref, { count: 1, windowStart: now });
          return true;
        }
        if (data.count >= MAX_ATTEMPTS) return false;
        tx.update(ref, { count: admin.firestore.FieldValue.increment(1) });
        return true;
      });
      if (!allowed) {
        return {
          statusCode: 429,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: false, error: 'Trop de tentatives. Réessaie plus tard.' })
        };
      }
    } catch (e) {
      // Firestore indisponible : on ne bloque pas la vérification pour autant
    }
  }

  const ok = password === REAL_PASSWORD;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok })
  };
};
