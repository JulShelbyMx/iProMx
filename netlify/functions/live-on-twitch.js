/* ============================================================
   iPROMX — Netlify Function : Statut Twitch (version optimisée)
   
   Optimisations vs version originale :
   1. Cache mémoire 2 min sur le statut live → -90% appels API Twitch
   2. Token OAuth mis en cache jusqu'à expiration → -66% appels OAuth
   3. ID utilisateur mis en cache permanent → -33% appels Helix users
   4. Cache séparé pour lastLive (TTL 10 min, moins volatile)
   ============================================================ */

const fetch = require('node-fetch');

// ── Cache en mémoire (survit entre les invocations chaudes) ──
let _cache = {
  // Token OAuth Twitch
  token:         null,
  tokenExpiry:   0,

  // ID utilisateur (permanent sur la durée de vie de la function)
  userId:        null,

  // Statut live (TTL court : 2 min)
  liveStatus:    null,
  liveStatusAt:  0,
  LIVE_TTL:      2 * 60 * 1000,  // 2 minutes

  // Last live (TTL long : 10 min)
  lastLive:      null,
  lastLiveAt:    0,
  LAST_LIVE_TTL: 10 * 60 * 1000, // 10 minutes
};

// ── Token OAuth avec cache ────────────────────────────────────
async function getToken(clientId, clientSecret) {
  const now = Date.now();
  // Renouveler 5 min avant expiration
  if (_cache.token && now < _cache.tokenExpiry - 5 * 60 * 1000) {
    return _cache.token;
  }

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error('Failed to fetch Twitch token');
  const data = await res.json();

  _cache.token       = data.access_token;
  // expires_in est en secondes, default ~60 jours
  _cache.tokenExpiry = now + (data.expires_in || 3600) * 1000;

  return _cache.token;
}

// ── ID utilisateur avec cache permanent ──────────────────────
async function getUserId(streamerName, headers) {
  if (_cache.userId) return _cache.userId;

  const res = await fetch(
    `https://api.twitch.tv/helix/users?login=${streamerName}`,
    { headers }
  );
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  if (!data.data?.length) throw new Error('User not found');

  _cache.userId = data.data[0].id;
  return _cache.userId;
}

// ── Handler principal ─────────────────────────────────────────
exports.handler = async (event) => {
  const clientId     = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const streamerName = 'ipromx';

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Twitch API credentials' })
    };
  }

  const now = Date.now();
  const wantsLastLive = event.headers?.['x-last-live'] === 'true';

  try {
    // ── 1. Token + headers ────────────────────────────────────
    const accessToken = await getToken(clientId, clientSecret);
    const headers = {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`
    };

    // ── 2. ID utilisateur (caché) ─────────────────────────────
    let userId;
    try {
      userId = await getUserId(streamerName, headers);
    } catch (e) {
      if (e.message === 'User not found') {
        return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
      }
      throw e;
    }

    // ── 3. Mode "dernier live" ────────────────────────────────
    if (wantsLastLive) {
      // Vérifier le cache lastLive
      if (_cache.lastLive && now - _cache.lastLiveAt < _cache.LAST_LIVE_TTL) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
          body: JSON.stringify(_cache.lastLive)
        };
      }

      // Vérifier d'abord si live (pas besoin de VOD si live)
      const streamRes = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        { headers }
      );
      if (!streamRes.ok) throw new Error('Failed to fetch stream status');
      const streamData = await streamRes.json();
      const isOnline = streamData.data?.length > 0;

      if (!isOnline) {
        // Récupérer VOD + channel info en parallèle
        const [videosRes, channelRes] = await Promise.all([
          fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`, { headers }),
          fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, { headers })
        ]);

        const videosData  = videosRes.ok  ? await videosRes.json()  : null;
        const channelData = channelRes.ok ? await channelRes.json() : null;

        const lastVideo    = videosData?.data?.[0];
        const channelTitle = channelData?.data?.[0]?.title    || '';
        const channelGame  = channelData?.data?.[0]?.game_name || '';

        const lastLiveDate = lastVideo
          ? new Date(lastVideo.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          : null;

        const result = {
          lastLive:     lastLiveDate,
          title:        channelTitle,
          game:         channelGame,
          lastVodTitle: lastVideo?.title || null
        };

        // Mettre en cache
        _cache.lastLive   = result;
        _cache.lastLiveAt = now;

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
          body: JSON.stringify(result)
        };
      }
      // Si en live, retourner le statut live standard (pas de VOD)
    }

    // ── 4. Statut live avec cache ─────────────────────────────
    if (_cache.liveStatus && now - _cache.liveStatusAt < _cache.LIVE_TTL) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        body: JSON.stringify(_cache.liveStatus)
      };
    }

    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${userId}`,
      { headers }
    );
    if (!streamRes.ok) throw new Error('Failed to fetch stream status');
    const streamData = await streamRes.json();
    const isOnline = streamData.data?.length > 0;

    let result;
    if (isOnline) {
      const stream = streamData.data[0];
      result = {
        status:      'online',
        streamTitle: stream.title,
        game:        stream.game_name,
        viewers:     stream.viewer_count,
        startedAt:   stream.started_at
      };
    } else {
      result = { status: 'offline' };
    }

    // Mettre en cache
    _cache.liveStatus   = result;
    _cache.liveStatusAt = now;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Twitch function error:', error);
    // En cas d'erreur, invalider le cache token (peut-être expiré)
    _cache.token = null;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Twitch status' })
    };
  }
};
