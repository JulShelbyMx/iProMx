const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const MAX = 3;
const WINDOW = 60 * 60 * 1000;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || event.headers['client-ip']
           || 'unknown';

  const docId = `rate_${ip.replace(/[.:]/g, '_')}`;
  const ref   = db.collection('_rate_limits').doc(docId);
  const now   = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const doc  = await tx.get(ref);
      const data = doc.exists ? doc.data() : { count: 0, windowStart: now };

      if (now - data.windowStart > WINDOW) {
        tx.set(ref, { count: 1, windowStart: now, ip, updatedAt: new Date().toISOString() });
        return { allowed: true, remaining: MAX - 1 };
      }

      if (data.count >= MAX) {
        const resetIn = Math.ceil((WINDOW - (now - data.windowStart)) / 60000);
        return { allowed: false, resetIn };
      }

      tx.update(ref, {
        count: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString()
      });
      return { allowed: true, remaining: MAX - data.count - 1 };
    });

    if (!result.allowed) {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Trop d'inscriptions depuis cette IP. Réessaie dans ${result.resetIn} min.`
        })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, remaining: result.remaining })
    };

  } catch (e) {
    console.error('[rate-limit]', e);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, warning: 'rate-limit-check-failed' })
    };
  }
};