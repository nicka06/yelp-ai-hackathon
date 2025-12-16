# Restaurant Concierge

A simple web app that triggers AI phone calls via ElevenLabs.

## Quick Start

1. **Set up ElevenLabs** (see SETUP.md)
2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
3. **Add environment variables** in Vercel dashboard:
   - `ELEVENLABS_API_KEY`
   - `ELEVENLABS_AGENT_ID`
4. **Test it!** Visit your Vercel URL and click the button.

## Files

- `index.html` - The web page with the call button
- `api/call.js` - Serverless function that triggers the ElevenLabs call
- `SETUP.md` - Complete setup guide for ElevenLabs and Vercel

## How It Works

1. User enters phone number and clicks button
2. Frontend calls `/api/call` endpoint
3. Vercel serverless function makes API call to ElevenLabs
4. ElevenLabs initiates phone call to user

That's it! Simple and free to host on Vercel.

