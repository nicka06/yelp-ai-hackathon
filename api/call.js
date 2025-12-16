const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Get environment variables
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;

  if (!elevenLabsApiKey || !elevenLabsAgentId) {
    return res.status(500).json({ 
      error: 'ElevenLabs API key or Agent ID not configured. Check your environment variables.' 
    });
  }

  try {
    // Make outbound call via ElevenLabs API
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/conversational-ai/outbound-call',
      {
        agent_id: elevenLabsAgentId,
        phone_number: phoneNumber,
      },
      {
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Call initiated successfully',
      callId: response.data.id || 'unknown',
    });
  } catch (error) {
    console.error('ElevenLabs API Error:', error.response?.data || error.message);
    
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to initiate call',
    });
  }
};

