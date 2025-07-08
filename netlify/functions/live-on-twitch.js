const axios = require('axios');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const streamerName = 'ipromx'; // Remplace par ton pseudo Twitch exact

    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Twitch API credentials' })
      };
    }

    // Obtenir un jeton d'accès
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }));

    const accessToken = tokenResponse.data.access_token;

    // Vérifier le statut du streamer
    const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
      params: { user_login: streamerName },
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const isLive = streamResponse.data.data.length > 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ status: isLive ? 'online' : 'offline' })
    };
  } catch (error) {
    console.error('Erreur dans la fonction Twitch:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Twitch status' })
    };
  }
};