# Setup Guide: Restaurant Concierge

This guide will help you set up ElevenLabs and deploy this app to Vercel for free.

## Prerequisites

- A GitHub account (free)
- An ElevenLabs account (free tier available)
- A phone number to receive calls

## Step 1: Set Up ElevenLabs

### 1.1 Create ElevenLabs Account

1. Go to [https://elevenlabs.io](https://elevenlabs.io)
2. Sign up for a free account
3. Verify your email

### 1.2 Get Your API Key

1. Go to your ElevenLabs dashboard
2. Navigate to **Profile** → **API Keys**
3. Click **"Create API Key"**
4. Give it a name (e.g., "Restaurant Concierge")
5. **Copy the API key** - you'll need it later
   - It looks like: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 1.3 Create a Conversational AI Agent

1. In the ElevenLabs dashboard, go to **Conversational AI**
2. Click **"Create Agent"**
3. Configure your agent:
   - **Name**: Restaurant Concierge (or any name)
   - **Voice**: Choose a voice you like
   - **First Message**: Something like "Hi! I'm calling to tell you about a great restaurant nearby..."
   - **System Prompt**: 
     ```
     You are a friendly restaurant concierge. When you call someone, tell them about a nearby restaurant. 
     Be conversational, brief (30-45 seconds), and helpful. Mention the restaurant name, cuisine type, 
     and why they might want to check it out.
     ```
4. Click **"Save"**
5. **Copy the Agent ID** - you'll need it later
   - It looks like: `agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 1.4 Connect a Phone Number (via Twilio)

ElevenLabs requires a Twilio phone number to make outbound calls.

1. **Set Up Twilio**:
   - Go to [https://www.twilio.com](https://www.twilio.com)
   - Sign up for a free account (you get $15.50 free credit)
   - Go to **Phone Numbers** → **Buy a Number**
   - Purchase a phone number (costs ~$1/month)

2. **Connect Twilio to ElevenLabs**:
   - In your ElevenLabs agent settings, go to **"Phone Numbers"** or **"Twilio"** section
   - Connect your Twilio phone number to the agent
   - **Copy the Agent Phone Number ID** - you'll need this!
     - This is different from the agent ID
     - It's the ID of the phone number connected to your agent
     - It might look like: `phone_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` or just a string ID

**Important**: You need THREE things from ElevenLabs:
- `ELEVENLABS_API_KEY` (from Step 1.2)
- `ELEVENLABS_AGENT_ID` (from Step 1.3)
- `ELEVENLABS_AGENT_PHONE_NUMBER_ID` (from this step - the Twilio phone number ID)

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2.2 Push Code to GitHub

1. Create a new repository on GitHub
2. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/restaurant-concierge.git
   git push -u origin main
   ```

### 2.3 Deploy to Vercel

**Option A: Via Vercel Website (Easiest)**

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Click **"Deploy"**
6. Wait for deployment to complete

**Option B: Via CLI**

```bash
vercel login
vercel
```

Follow the prompts.

### 2.4 Add Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add these THREE variables:

   ```
   ELEVENLABS_API_KEY = sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ELEVENLABS_AGENT_ID = agent_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ELEVENLABS_AGENT_PHONE_NUMBER_ID = phone_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Important**: Make sure you have all three! The `ELEVENLABS_AGENT_PHONE_NUMBER_ID` is the Twilio phone number ID from your agent settings.

3. Click **"Save"**
4. **Redeploy** your project (go to Deployments → click the three dots → Redeploy)

## Step 3: Test Your App

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Enter your phone number (format: +1234567890)
3. Click **"Call Me Now"**
4. You should receive a call from your ElevenLabs agent!

## Troubleshooting

### Call Not Working?

1. **Check Environment Variables**
   - Make sure `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` are set in Vercel
   - Redeploy after adding variables

2. **Check ElevenLabs Dashboard**
   - Verify your agent is active
   - Check if phone number is connected
   - Look for any error messages

3. **Check Vercel Logs**
   - Go to your Vercel project → **Deployments** → Click on latest deployment → **Functions** tab
   - Look for error messages in the logs

4. **API Endpoint**
   - Make sure the endpoint is: `https://api.elevenlabs.io/v1/conversational-ai/outbound-call`
   - Check ElevenLabs documentation for any API changes

### Phone Number Format

- Always use international format: `+1234567890`
- Include country code (e.g., +1 for US)

### Free Tier Limits

- **ElevenLabs**: Free tier has limited minutes/month
- **Vercel**: Free tier is generous, should be fine
- **Twilio**: Free $15.50 credit, then pay-as-you-go

## Next Steps

- Customize the agent's voice and prompts in ElevenLabs
- Add more features to the web page
- Set up multiple agents for different scenarios

## Support

- ElevenLabs Docs: [https://docs.elevenlabs.io](https://docs.elevenlabs.io)
- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- Twilio Docs: [https://www.twilio.com/docs](https://www.twilio.com/docs)

