const axios = require('axios');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const streamerName = 'ipromx'; // Pseudo Twitch exact

    if (!clientId || !clientSecret) {
      console.error('Missing Twitch API credentials: clientId or clientSecret is undefined');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Twitch API credentials' })
      };
    }

    console.log('Requesting Twitch access token...');
    // Obtenir un jeton d'accès
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }));

    const accessToken = tokenResponse.data.access_token;
    console.log('Access token received:', accessToken);

    console.log(`Checking stream status for ${streamerName}...`);
    // Vérifier le statut du streamer
    const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
      params: { user_login: streamerName },
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Stream response:', JSON.stringify(streamResponse.data, null, 2));
    const isLive = streamResponse.data.data.length > 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ status: isLive ? 'online' : 'offline' })
    };
  } catch (error) {
    console.error('Erreur dans la fonction Twitch:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Twitch status', details: error.message })
    };
  }
};