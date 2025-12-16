#!/bin/bash

# Test script for ElevenLabs API
# Replace these with your actual values
ELEVENLABS_API_KEY="your-api-key-here"
AGENT_ID="your-agent-id-here"
AGENT_PHONE_NUMBER_ID="your-phone-number-id-here"
TO_NUMBER="+1234567890"  # Your phone number to test with

echo "Testing ElevenLabs API..."
echo ""

# Test 1: Check if API key is valid (list agents)
echo "Test 1: Checking API key (listing agents)..."
curl -X GET "https://api.elevenlabs.io/v1/convai/agents" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || echo "Response received (install jq for pretty printing)"

echo ""
echo "---"
echo ""

# Test 2: Get agent details
echo "Test 2: Getting agent details..."
curl -X GET "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || echo "Response received"

echo ""
echo "---"
echo ""

# Test 3: List phone numbers for agent
echo "Test 3: Listing phone numbers for agent..."
curl -X GET "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID/phone-numbers" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || echo "Response received"

echo ""
echo "---"
echo ""

# Test 4: Make the actual outbound call
echo "Test 4: Making outbound call..."
curl -X POST "https://api.elevenlabs.io/v1/convai/twilio/outbound-call" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"agent_id\": \"$AGENT_ID\",
    \"agent_phone_number_id\": \"$AGENT_PHONE_NUMBER_ID\",
    \"to_number\": \"$TO_NUMBER\"
  }" \
  | jq '.' 2>/dev/null || echo "Response received"

echo ""
echo "Done!"

