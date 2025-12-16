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

  try {
    // Parse request body
    let phoneNumber;
    if (typeof req.body === 'string') {
      const parsed = JSON.parse(req.body);
      phoneNumber = parsed.phoneNumber;
    } else {
      phoneNumber = req.body?.phoneNumber;
    }

    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'Phone number is required' 
      });
    }

    // Get environment variables
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;

    if (!elevenLabsApiKey) {
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_API_KEY not configured. Add it in Vercel environment variables.' 
      });
    }

    if (!elevenLabsAgentId) {
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_AGENT_ID not configured. Add it in Vercel environment variables.' 
      });
    }

    // Get agent phone number ID from environment (required for Twilio integration)
    const agentPhoneNumberId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;
    
    if (!agentPhoneNumberId) {
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_AGENT_PHONE_NUMBER_ID not configured. This is the Twilio phone number ID from your ElevenLabs agent settings.' 
      });
    }

    // Make outbound call via ElevenLabs API (Twilio endpoint)
    const endpoint = 'https://api.elevenlabs.io/v1/convai/twilio/outbound-call';
    
    const response = await axios.post(
      endpoint,
      {
        agent_id: elevenLabsAgentId,
        agent_phone_number_id: agentPhoneNumberId,
        to_number: phoneNumber,
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
    // Better error logging
    const errorDetails = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    };
    
    console.error('Error details:', JSON.stringify(errorDetails, null, 2));
    
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.response?.data?.detail || error.message || 'Failed to initiate call',
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
    });
  }
};

