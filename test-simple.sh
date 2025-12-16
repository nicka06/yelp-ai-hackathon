#!/bin/bash

# Simple test - just the outbound call
# Edit these values:
API_KEY="your-api-key-here"
AGENT_ID="your-agent-id-here"
PHONE_NUMBER_ID="your-phone-number-id-here"
TO_NUMBER="+1234567890"

echo "Making outbound call test..."
echo ""

curl -X POST "https://api.elevenlabs.io/v1/convai/twilio/outbound-call" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"agent_id\": \"$AGENT_ID\",
    \"agent_phone_number_id\": \"$PHONE_NUMBER_ID\",
    \"to_number\": \"$TO_NUMBER\"
  }" \
  -v

echo ""
echo "Check the response above for errors"

