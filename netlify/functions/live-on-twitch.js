const fetch = require('node-fetch');

exports.handler = async (event) => {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const streamerName = 'ipromx';

    if (!clientId || !clientSecret) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing Twitch API credentials' })
        };
    }

    try {
        // Obtenir token
        const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
            method: 'POST'
        });
        if (!tokenResponse.ok) throw new Error('Failed to fetch Twitch token');
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Vérifier si en live
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${streamerName}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userData = await userResponse.json();
        if (!userData.data || userData.data.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' })
            };
        }
        const userId = userData.data[0].id;

        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!streamResponse.ok) throw new Error('Failed to fetch stream status');
        const streamData = await streamResponse.json();

        if (event.headers['x-last-live'] === 'true' && streamData.data.length === 0) {
            // Récupérer dernier live
            const videosResponse = await fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`, {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!videosResponse.ok) throw new Error('Failed to fetch videos');
            const videosData = await videosResponse.json();
            const lastLiveDate = videosData.data.length > 0 ? new Date(videosData.data[0].created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Inconnu';
            return {
                statusCode: 200,
                body: JSON.stringify({ lastLive: lastLiveDate })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ status: streamData.data.length > 0 ? 'online' : 'offline' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Twitch status' })
        };
    }
};