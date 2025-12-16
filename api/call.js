const axios = require('axios');

module.exports = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in CORS/preflight:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
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
    const agentPhoneNumberId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;

    // Debug logging (will show in Vercel logs)
    console.log('Environment check:', {
      hasApiKey: !!elevenLabsApiKey,
      hasAgentId: !!elevenLabsAgentId,
      hasPhoneNumberId: !!agentPhoneNumberId,
      apiKeyLength: elevenLabsApiKey?.length || 0,
      agentIdPrefix: elevenLabsAgentId?.substring(0, 10) || 'missing',
      phoneNumberIdPrefix: agentPhoneNumberId?.substring(0, 10) || 'missing',
    });

    if (!elevenLabsApiKey) {
      console.error('Missing ELEVENLABS_API_KEY');
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_API_KEY not configured. Add it in Vercel environment variables.' 
      });
    }

    if (!elevenLabsAgentId) {
      console.error('Missing ELEVENLABS_AGENT_ID');
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_AGENT_ID not configured. Add it in Vercel environment variables.' 
      });
    }

    if (!agentPhoneNumberId) {
      console.error('Missing ELEVENLABS_AGENT_PHONE_NUMBER_ID');
      return res.status(500).json({ 
        success: false,
        error: 'ELEVENLABS_AGENT_PHONE_NUMBER_ID not configured. This is the Twilio phone number ID from your ElevenLabs agent settings.' 
      });
    }

    // Make outbound call via ElevenLabs API (Twilio endpoint)
    const endpoint = 'https://api.elevenlabs.io/v1/convai/twilio/outbound-call';
    
    const requestBody = {
      agent_id: elevenLabsAgentId,
      agent_phone_number_id: agentPhoneNumberId,
      to_number: phoneNumber,
    };

    console.log('Making request to:', endpoint);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('Agent ID (full):', elevenLabsAgentId);
    console.log('Phone Number ID (full):', agentPhoneNumberId);
    console.log('API Key (first 10 chars):', elevenLabsApiKey.substring(0, 10) + '...');
    
    // Check if this is a delayed call request (from client after countdown)
    const isDelayedCall = req.body?.delayed === true;
    
    if (isDelayedCall) {
      // This is the actual call after the delay - make it now
      const response = await axios.post(
        endpoint,
        requestBody,
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
    } else {
      // Initial request - just acknowledge, client will call back after 60 seconds
      return res.status(200).json({
        success: true,
        message: 'Countdown started. Call will be initiated in 60 seconds...',
        countdown: 60,
        delayed: true, // Signal to client to make delayed call
      });
    }
  } catch (error) {
    // Better error logging
    const errorDetails = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      }
    };
    
    console.error('ElevenLabs API Error:', JSON.stringify(errorDetails, null, 2));
    
    // More helpful error messages
    let errorMessage = 'Failed to initiate call';
    if (error.response?.status === 404) {
      errorMessage = 'Not Found - Check that your agent_id and agent_phone_number_id are correct. Verify them in your ElevenLabs dashboard.';
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = 'Authentication failed - Check your ELEVENLABS_API_KEY is correct and has the right permissions.';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      // Include helpful details in response for debugging
      hint: error.response?.status === 404 
        ? 'Verify your agent_id and agent_phone_number_id in ElevenLabs dashboard. Make sure the phone number is connected to your agent.'
        : undefined,
    });
  }
};

