#!/bin/bash

# Setup script for Business Agent configuration

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if API key is provided
if [ -z "$HUME_API_KEY" ]; then
    echo -e "${RED}Error: HUME_API_KEY environment variable is not set${NC}"
    echo "Please set your Hume AI API key:"
    echo "export HUME_API_KEY=your_api_key_here"
    exit 1
fi

echo -e "${BLUE}🚀 Setting up Business Agent Configuration${NC}"
echo ""

# Create the business configuration
echo -e "${YELLOW}⚙️ Creating business agent configuration...${NC}"

response=$(curl -s -X POST https://api.hume.ai/v0/evi/configs \
    -H "X-Hume-Api-Key: $HUME_API_KEY" \
    -H "Content-Type: application/json" \
    --data @create-business-config.json)

# Extract config ID from response
config_id=$(echo "$response" | jq -r '.id')

if [ "$config_id" != "null" ] && [ "$config_id" != "" ]; then
    echo -e "${GREEN}✅ Created business agent configuration (ID: $config_id)${NC}"

    # Save the config ID to a file for easy reference
    echo "$config_id" > business_config_id.txt
    echo -e "${GREEN}📄 Business configuration ID saved to business_config_id.txt${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 Business Agent setup complete!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Add the business configuration ID to your .env.local file:"
    echo "   NEXT_PUBLIC_HUME_CONFIG_ID_BUSINESS=$config_id"
    echo ""
    echo "2. Optionally add customer service config:"
    echo "   NEXT_PUBLIC_HUME_CONFIG_ID_CUSTOMER=your_existing_config_id"
    echo ""
    echo "3. Test your dual-agent voice assistant"
else
    echo -e "${RED}❌ Failed to create business configuration${NC}"
    echo "Response: $response"
    exit 1
fi