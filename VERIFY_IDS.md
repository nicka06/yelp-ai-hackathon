# How to Verify Your ElevenLabs IDs

If you're getting a "Not Found" error, one of your IDs is likely incorrect. Here's how to verify each one:

## 1. Verify ELEVENLABS_API_KEY

1. Go to ElevenLabs dashboard → **Profile** → **API Keys**
2. Your API key should look like: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Make sure it's active and not expired
4. Copy it exactly (no extra spaces)

## 2. Verify ELEVENLABS_AGENT_ID

1. Go to ElevenLabs dashboard → **Conversational AI**
2. Click on your agent
3. Look for the **Agent ID** - it might be:
   - In the URL: `https://elevenlabs.io/app/conversational-ai/agents/[AGENT_ID]`
   - In the agent settings page
   - In the API section
4. It should look like: `agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` or just a string of characters
5. Copy it exactly

## 3. Verify ELEVENLABS_AGENT_PHONE_NUMBER_ID (Most Common Issue!)

This is the ID of the **Twilio phone number connected to your agent**, NOT the phone number itself.

1. Go to ElevenLabs dashboard → **Conversational AI** → Your agent
2. Go to **"Phone Numbers"** or **"Twilio"** section
3. You should see your connected phone number
4. Look for the **Phone Number ID** - it might be:
   - Next to the phone number
   - In a tooltip when you hover
   - In the API/developer section
   - In the network requests (open browser dev tools)
5. It might look like: `phone_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` or just an ID string
6. **This is NOT the phone number itself** (like +1234567890), it's the ID of that phone number in ElevenLabs

## Test Your IDs

You can test if your IDs are correct by running this curl command (replace with your actual values):

```bash
curl -X POST https://api.elevenlabs.io/v1/convai/twilio/outbound-call \
  -H "xi-api-key: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "YOUR_AGENT_ID_HERE",
    "agent_phone_number_id": "YOUR_PHONE_NUMBER_ID_HERE",
    "to_number": "+1234567890"
  }'
```

If you get "Not Found", check:
- Is the agent_id correct?
- Is the agent_phone_number_id correct?
- Is the phone number actually connected to this agent?

## Common Mistakes

1. **Using the phone number instead of phone number ID**
   - ❌ Wrong: `+1234567890`
   - ✅ Right: `phone_abc123` or similar ID

2. **Using voice ID instead of agent ID**
   - Make sure you're using the Conversational AI agent ID, not a voice ID

3. **Phone number not connected**
   - The phone number must be connected to the agent in ElevenLabs dashboard
   - Just having a Twilio number isn't enough - it must be linked to the agent

## Still Not Working?

1. Check Vercel logs for the exact error message
2. Verify all three environment variables are set correctly
3. Make sure you redeployed after adding environment variables
4. Try the curl command above to test outside of Vercel

