/* ============================================================
   iPROMX — Netlify Function : Firebase Config
   Sert la config Firebase depuis les variables d'environnement
   (jamais exposées dans le code source)

   Variables à définir dans Netlify → Site settings → Env vars :
     FIREBASE_API_KEY
     FIREBASE_AUTH_DOMAIN
     FIREBASE_PROJECT_ID
     FIREBASE_STORAGE_BUCKET
     FIREBASE_MESSAGING_SENDER_ID
     FIREBASE_APP_ID
     FIREBASE_MEASUREMENT_ID   (optionnel)
   ============================================================ */

exports.handler = async () => {
  const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
  } = process.env;

  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Firebase env vars not configured' }),
    };
  }

  const config = {
    apiKey:            FIREBASE_API_KEY,
    authDomain:        FIREBASE_AUTH_DOMAIN,
    projectId:         FIREBASE_PROJECT_ID,
    storageBucket:     FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId:             FIREBASE_APP_ID,
    measurementId:     FIREBASE_MEASUREMENT_ID,
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/javascript',
      // Cache 1h côté navigateur (la config ne change pas souvent)
      'Cache-Control': 'public, max-age=3600',
    },
    // On expose la config sous forme de JS global pour que firebase-auth.js puisse la lire
    body: `window.__FIREBASE_CONFIG__ = ${JSON.stringify(config)};`,
  };
};
