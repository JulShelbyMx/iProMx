const fetch = require('node-fetch');

let _cache = {
  token:         null,
  tokenExpiry:   0,
  userId:        null,
  liveStatus:    null,
  liveStatusAt:  0,
  LIVE_TTL:      2 * 60 * 1000,
  lastLive:      null,
  lastLiveAt:    0,
  LAST_LIVE_TTL: 10 * 60 * 1000,
};

async function getToken(clientId, clientSecret) {
  const now = Date.now();
  if (_cache.token && now < _cache.tokenExpiry - 5 * 60 * 1000) return _cache.token;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error('Failed to fetch Twitch token');
  const data = await res.json();

  _cache.token       = data.access_token;
  _cache.tokenExpiry = now + (data.expires_in || 3600) * 1000;
  return _cache.token;
}

async function getUserId(streamerName, headers) {
  if (_cache.userId) return _cache.userId;

  const res = await fetch(`https://api.twitch.tv/helix/users?login=${streamerName}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  if (!data.data?.length) throw new Error('User not found');

  _cache.userId = data.data[0].id;
  return _cache.userId;
}

exports.handler = async (event) => {
  const clientId     = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const streamerName = 'ipromx';

  if (!clientId || !clientSecret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing Twitch credentials' }) };
  }

  const now          = Date.now();
  const wantsLastLive = event.headers?.['x-last-live'] === 'true';

  try {
    const accessToken = await getToken(clientId, clientSecret);
    const headers = {
      'Client-ID':     clientId,
      'Authorization': `Bearer ${accessToken}`,
    };

    let userId;
    try {
      userId = await getUserId(streamerName, headers);
    } catch (e) {
      if (e.message === 'User not found') {
        return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
      }
      throw e;
    }

    if (wantsLastLive) {
      if (_cache.lastLive && now - _cache.lastLiveAt < _cache.LAST_LIVE_TTL) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
          body: JSON.stringify(_cache.lastLive),
        };
      }

      const streamRes  = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, { headers });
      if (!streamRes.ok) throw new Error('Failed to fetch stream');
      const streamData = await streamRes.json();
      const isOnline   = streamData.data?.length > 0;

      if (!isOnline) {
        const [videosRes, channelRes] = await Promise.all([
          fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`, { headers }),
          fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, { headers }),
        ]);

        const videosData  = videosRes.ok  ? await videosRes.json()  : null;
        const channelData = channelRes.ok ? await channelRes.json() : null;

        const lastVideo    = videosData?.data?.[0];
        const channelTitle = channelData?.data?.[0]?.title     || '';
        const channelGame  = channelData?.data?.[0]?.game_name || '';

        const lastLiveDate = lastVideo
          ? new Date(lastVideo.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric', month: 'long', day: 'numeric',
            })
          : null;

        const result = {
          lastLive:     lastLiveDate,
          title:        channelTitle,
          game:         channelGame,
          lastVodTitle: lastVideo?.title || null,
        };

        _cache.lastLive   = result;
        _cache.lastLiveAt = now;

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
          body: JSON.stringify(result),
        };
      }
    }

    if (_cache.liveStatus && now - _cache.liveStatusAt < _cache.LIVE_TTL) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        body: JSON.stringify(_cache.liveStatus),
      };
    }

    const streamRes  = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, { headers });
    if (!streamRes.ok) throw new Error('Failed to fetch stream');
    const streamData = await streamRes.json();
    const isOnline   = streamData.data?.length > 0;

    let result;
    if (isOnline) {
      const stream = streamData.data[0];
      result = {
        status:      'online',
        streamTitle: stream.title,
        game:        stream.game_name,
        viewers:     stream.viewer_count,
        startedAt:   stream.started_at,
      };
    } else {
      result = { status: 'offline' };
    }

    _cache.liveStatus   = result;
    _cache.liveStatusAt = now;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Twitch error:', error);
    _cache.token = null;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Twitch status' }),
    };
  }
};