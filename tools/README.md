# Hume AI Tools Setup for Mental Health Practice

This directory contains all the files needed to create the tools and configuration for your mental health practice voice assistant.

## Dual Agent System

This application now supports **two specialized agents**:

1. **Customer Service Agent** - Handles patient appointments, inquiries, and support
2. **Business Agent** - Handles business partnerships, professional consultations, and corporate services

## Quick Setup for Dual Agents

### Step 1: Set your API key
```bash
export HUME_API_KEY=your_api_key_here
```

### Step 2: Create Customer Service Agent (if not already done)
```bash
chmod +x setup-tools.sh
./setup-tools.sh
```

### Step 3: Create Business Agent
```bash
chmod +x setup-business-agent.sh
./setup-business-agent.sh
```

### Step 4: Update your environment variables
Add to your `.env.local`:
```bash
# Customer Service Agent (your existing config)
NEXT_PUBLIC_HUME_CONFIG_ID_CUSTOMER=your_customer_config_id

# Business Agent (newly created)
NEXT_PUBLIC_HUME_CONFIG_ID_BUSINESS=your_business_config_id
```

## Files Overview

### Configuration Files
- `create-config.json` - Customer service agent configuration template
- `create-business-config.json` - Business agent configuration template

### JSON Files
- `create-tools.json` - Contains all 6 tools in one file
- Individual tool files (e.g., `check_availability.json`) - Single tool definitions

### Scripts
- `setup-tools.sh` - Automated script to create customer service agent
- `setup-business-agent.sh` - Automated script to create business agent

## Agent Capabilities

### Customer Service Agent
- **Tools**: All patient-facing tools
  - `check_availability` - Check appointment slots
  - `book_appointment` - Book patient appointments
  - `save_patient_info` - Store patient information
  - `log_risk_assessment` - Handle risk assessments
  - `get_practice_info` - Provide practice information
  - `send_confirmation` - Send appointment confirmations
  - `log_consent` - Record call consent
  - `log_privacy_check` - Verify privacy

### Business Agent
- **Tools**: Limited to business-appropriate tools
  - `get_practice_info` - Provide practice information
  - `save_patient_info` - Store business contact information
  - `log_consent` - Record call consent
  - `log_privacy_check` - Verify privacy
- **Focus**: Professional partnerships, corporate services, referrals

## Setup Options

### Option 1: Automated Setup (Recommended)

1. **Set your Hume AI API key:**
   ```bash
   export HUME_API_KEY=your_api_key_here
   ```

2. **Create both agents:**
   ```bash
   chmod +x setup-tools.sh setup-business-agent.sh
   ./setup-tools.sh        # Customer service agent
   ./setup-business-agent.sh  # Business agent
   ```

3. **Update your .env.local** with both configuration IDs

### Option 2: Manual Setup

#### Step 1: Create Tools One by One

For each tool, use the individual JSON files:

```bash
# Example for check_availability tool
curl https://api.hume.ai/v0/evi/tools \
   -H "X-Hume-Api-Key: YOUR_API_KEY" \
   --json @check_availability.json
```

Repeat for each tool:
- `check_availability.json`
- `book_appointment.json`
- `save_patient_info.json`
- `log_risk_assessment.json`
- `get_practice_info.json`
- `send_confirmation.json`

#### Step 2: Create Configurations

1. **Create Customer Service Configuration:**
   ```bash
   curl -X POST https://api.hume.ai/v0/evi/configs \
      -H "X-Hume-Api-Key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      --json @create-config.json
   ```

2. **Create Business Configuration:**
   ```bash
   curl -X POST https://api.hume.ai/v0/evi/configs \
      -H "X-Hume-Api-Key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      --json @create-business-config.json
   ```

### Option 3: Using the Combined File

```bash
# Extract and create each tool from the combined file
curl https://api.hume.ai/v0/evi/tools \
   -H "X-Hume-Api-Key: YOUR_API_KEY" \
   --json @create-tools.json
```

## Usage

Once set up, users can switch between agents in the chat interface:

1. **Customer Service Agent** - For patient appointments and support
2. **Business Agent** - For business inquiries and partnerships

The interface provides a simple toggle to switch between agents, each with their own specialized capabilities and tools.

## Tool Restrictions by Agent

- **Customer Service**: Full access to all patient-care tools
- **Business**: Limited to business-appropriate tools only
- Tools are automatically filtered based on the active agent

## Troubleshooting

If you encounter issues:

1. **Check API key**: Ensure `HUME_API_KEY` is set correctly
2. **Verify config IDs**: Check that both config IDs are in `.env.local`
3. **Tool permissions**: Ensure tools are created and accessible
4. **Check logs**: Server logs show which agent is making tool calls
