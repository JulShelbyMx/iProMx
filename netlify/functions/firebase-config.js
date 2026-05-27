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
      'Cache-Control': 'public, max-age=3600',
    },
    body: `window.__FIREBASE_CONFIG__ = ${JSON.stringify(config)};`,
  };
};