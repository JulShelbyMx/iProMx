/* ============================================================
   iPROMX — Netlify Function : Rate Limiter pour l'inscription
   Fichier : netlify/functions/check-register-limit.js

   Stratégie : on stocke dans Firestore Admin un compteur par IP.
   Max 3 inscriptions par IP par heure.

   Variables Netlify à ajouter :
     FIREBASE_ADMIN_KEY  (JSON stringifié de ta clé de service)
   ============================================================ */

const admin = require('firebase-admin');

// Init Admin SDK (singleton)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const MAX_REGISTRATIONS = 3;   // max par IP par heure
const WINDOW_MS = 60 * 60 * 1000; // 1 heure

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // IP réelle (Netlify forward l'IP dans ce header)
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || event.headers['client-ip']
           || 'unknown';

  const docId  = `rate_${ip.replace(/[.:]/g, '_')}`;
  const ref    = db.collection('_rate_limits').doc(docId);
  const now    = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const doc  = await tx.get(ref);
      const data = doc.exists ? doc.data() : { count: 0, windowStart: now };

      // Nouveau créneau horaire → reset
      if (now - data.windowStart > WINDOW_MS) {
        tx.set(ref, { count: 1, windowStart: now, ip, updatedAt: new Date().toISOString() });
        return { allowed: true, remaining: MAX_REGISTRATIONS - 1 };
      }

      if (data.count >= MAX_REGISTRATIONS) {
        const resetIn = Math.ceil((WINDOW_MS - (now - data.windowStart)) / 60000);
        return { allowed: false, resetIn };
      }

      tx.update(ref, { count: admin.firestore.FieldValue.increment(1), updatedAt: new Date().toISOString() });
      return { allowed: true, remaining: MAX_REGISTRATIONS - data.count - 1 };
    });

    if (!result.allowed) {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Trop d'inscriptions depuis cette adresse IP. Réessaie dans ${result.resetIn} min.`
        })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, remaining: result.remaining })
    };

  } catch (e) {
    console.error('[rate-limit] error:', e);
    // En cas d'erreur du rate limiter, on laisse passer (fail open)
    // mais on log pour investigation
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, warning: 'rate-limit-check-failed' })
    };
  }
};