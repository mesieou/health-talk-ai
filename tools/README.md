# Hume AI Tools Setup for Mental Health Practice

This directory contains all the files needed to create the tools and configuration for your mental health practice voice assistant.

## Files Overview

### JSON Files
- `create-tools.json` - Contains all 6 tools in one file
- `create-config.json` - Configuration template with placeholders for tool IDs
- Individual tool files (e.g., `check_availability.json`) - Single tool definitions

### Scripts
- `setup-tools.sh` - Automated script to create all tools and configuration

## Setup Options

### Option 1: Automated Setup (Recommended)

1. **Set your Hume AI API key:**
   ```bash
   export HUME_API_KEY=your_api_key_here
   ```

2. **Make the script executable and run it:**
   ```bash
   chmod +x setup-tools.sh
   ./setup-tools.sh
   ```

3. **The script will:**
   - Create all 6 tools
   - Create the configuration
   - Save the configuration ID to `config_id.txt`
   - Display all tool IDs for reference

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

#### Step 2: Create Configuration

1. **Get the tool IDs** from the responses of step 1
2. **Update `create-config.json`** by replacing the placeholders:
   - `<TOOL_ID_1>` → actual tool ID for check_availability
   - `<TOOL_ID_2>` → actual tool ID for book_appointment
   - etc.

3. **Create the configuration:**
   ```bash
   curl -X POST https://api.hume.ai/v0/evi/configs \
      -H "X-Hume-Api-Key: YOUR_API_KEY" \
      -H "Content-Type: application/json" \
      --json @create-config.json
   ```

### Option 3: Using the Combined File

```bash
# Extract and create each tool from the combined file
jq -c '.tools[]' create-tools.json | while read tool; do
    curl https://api.hume.ai/v0/evi/tools \
       -H "X-Hume-Api-Key: YOUR_API_KEY" \
       -H "Content-Type: application/json" \
       --data "$tool"
done
```

## After Setup

1. **Add the configuration ID to your `.env.local`:**
   ```
   NEXT_PUBLIC_HUME_CONFIG_ID=your_config_id_here
   ```

2. **Test your voice assistant** with the new tools

3. **Check the browser console** for tool call logs

## Tool Descriptions

| Tool | Purpose |
|------|---------|
| `check_availability` | Find available appointment slots |
| `book_appointment` | Schedule appointments with patient info |
| `save_patient_info` | Securely store patient details |
| `log_risk_assessment` | Log risk assessments and trigger alerts |
| `get_practice_info` | Provide practice hours, pricing, location |
| `send_confirmation` | Send SMS/email confirmations |

## Troubleshooting

### Common Issues

1. **API Key Error:**
   - Ensure `HUME_API_KEY` is set correctly
   - Check that your API key has the necessary permissions

2. **Tool Creation Fails:**
   - Verify the JSON syntax is valid
   - Check that tool names are unique
   - Ensure parameters schema is correct

3. **Configuration Creation Fails:**
   - Verify all tool IDs are correct
   - Check that the prompt is not too long
   - Ensure the language model is available

### Getting Help

- Check the Hume AI documentation
- Verify your API key permissions
- Test with a simple tool first
- Check the response messages for specific errors

## Security Notes

- Keep your API key secure
- Don't commit API keys to version control
- Use environment variables for sensitive data
- Regularly rotate your API keys
