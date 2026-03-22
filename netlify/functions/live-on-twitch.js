const fetch = require('node-fetch');

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

    try {
        // ── 1. Token OAuth ──────────────────────────────────────
        const tokenRes = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
            { method: 'POST' }
        );
        if (!tokenRes.ok) throw new Error('Failed to fetch Twitch token');
        const { access_token: accessToken } = await tokenRes.json();

        const headers = {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        };

        // ── 2. ID utilisateur ───────────────────────────────────
        const userRes = await fetch(
            `https://api.twitch.tv/helix/users?login=${streamerName}`,
            { headers }
        );
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        if (!userData.data?.length) {
            return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
        }
        const userId = userData.data[0].id;

        // ── 3. Statut du stream ─────────────────────────────────
        const streamRes = await fetch(
            `https://api.twitch.tv/helix/streams?user_id=${userId}`,
            { headers }
        );
        if (!streamRes.ok) throw new Error('Failed to fetch stream status');
        const streamData = await streamRes.json();
        const isOnline = streamData.data?.length > 0;

        // ── Mode "dernier live" demandé par le client ───────────
        const wantsLastLive = event.headers['x-last-live'] === 'true';

        if (wantsLastLive && !isOnline) {
            // Récupérer le dernier VOD archivé
            const videosRes = await fetch(
                `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`,
                { headers }
            );
            if (!videosRes.ok) throw new Error('Failed to fetch videos');
            const videosData = await videosRes.json();

            // Titre actuel du channel (même hors live — peut avoir été mis à jour)
            const channelRes = await fetch(
                `https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`,
                { headers }
            );
            const channelData = channelRes.ok ? await channelRes.json() : null;
            const channelTitle = channelData?.data?.[0]?.title || '';
            const channelGame  = channelData?.data?.[0]?.game_name || '';

            const lastVideo = videosData.data?.[0];
            const lastLiveDate = lastVideo
                ? new Date(lastVideo.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : null;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    lastLive:     lastLiveDate,
                    title:        channelTitle,   // titre channel actuel (même hors live)
                    game:         channelGame,
                    lastVodTitle: lastVideo?.title || null
                })
            };
        }

        if (isOnline) {
            // ── EN LIVE ─────────────────────────────────────────
            const stream = streamData.data[0];
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status:      'online',
                    streamTitle: stream.title,
                    game:        stream.game_name,
                    viewers:     stream.viewer_count,
                    startedAt:   stream.started_at
                })
            };
        } else {
            // ── HORS LIGNE ──────────────────────────────────────
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'offline' })
            };
        }

    } catch (error) {
        console.error('Twitch function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Twitch status' })
        };
    }
};
