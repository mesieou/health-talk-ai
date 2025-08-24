#!/bin/bash

# Hume AI Tools Setup Script for Mental Health Practice
# This script creates all the tools and configuration for the mental health practice assistant

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

echo -e "${BLUE}🚀 Setting up Hume AI Tools for Mental Health Practice${NC}"
echo ""

# Create tools
echo -e "${YELLOW}📝 Creating tools...${NC}"

# Array to store tool IDs
declare -a tool_ids

# Create each tool
tools=(
    "check_availability"
    "book_appointment"
    "save_patient_info"
    "log_risk_assessment"
    "get_practice_info"
    "send_confirmation"
)

for tool in "${tools[@]}"; do
    echo -e "${BLUE}Creating tool: $tool${NC}"

    # Extract the tool data from the JSON file
    tool_data=$(jq -r ".tools[] | select(.name == \"$tool\")" create-tools.json)

    if [ -z "$tool_data" ]; then
        echo -e "${RED}Error: Tool data not found for $tool${NC}"
        continue
    fi

    # Create the tool
    response=$(curl -s -X POST https://api.hume.ai/v0/evi/tools \
        -H "X-Hume-Api-Key: $HUME_API_KEY" \
        -H "Content-Type: application/json" \
        --data "$tool_data")

    # Extract tool ID from response
    tool_id=$(echo "$response" | jq -r '.id')

    if [ "$tool_id" != "null" ] && [ "$tool_id" != "" ]; then
        echo -e "${GREEN}✅ Created tool: $tool (ID: $tool_id)${NC}"
        tool_ids+=("$tool_id")
    else
        echo -e "${RED}❌ Failed to create tool: $tool${NC}"
        echo "Response: $response"
    fi

    echo ""
done

# Create configuration
echo -e "${YELLOW}⚙️  Creating configuration...${NC}"

# Read the config template
config_data=$(cat create-config.json)

# Replace tool IDs in the configuration
for i in "${!tool_ids[@]}"; do
    tool_id="${tool_ids[$i]}"
    placeholder="<TOOL_ID_$((i+1))>"
    config_data=$(echo "$config_data" | sed "s/$placeholder/$tool_id/g")
done

# Create the configuration
response=$(curl -s -X POST https://api.hume.ai/v0/evi/configs \
    -H "X-Hume-Api-Key: $HUME_API_KEY" \
    -H "Content-Type: application/json" \
    --data "$config_data")

# Extract config ID from response
config_id=$(echo "$response" | jq -r '.id')

if [ "$config_id" != "null" ] && [ "$config_id" != "" ]; then
    echo -e "${GREEN}✅ Created configuration (ID: $config_id)${NC}"

    # Save the config ID to a file for easy reference
    echo "$config_id" > config_id.txt
    echo -e "${GREEN}📄 Configuration ID saved to config_id.txt${NC}"
else
    echo -e "${RED}❌ Failed to create configuration${NC}"
    echo "Response: $response"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "Tools created: ${#tool_ids[@]}"
echo "Configuration ID: $config_id"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Add the configuration ID to your .env.local file:"
echo "   NEXT_PUBLIC_HUME_CONFIG_ID=$config_id"
echo ""
echo "2. Test your voice assistant with the new tools"
echo ""
echo -e "${BLUE}🔧 Tool IDs for reference:${NC}"
for i in "${!tool_ids[@]}"; do
    echo "  ${tools[$i]}: ${tool_ids[$i]}"
done
