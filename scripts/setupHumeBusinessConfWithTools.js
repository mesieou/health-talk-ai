#!/usr/bin/env node

/**
 * Hume AI Tool Setup Script for Health Talk AI
 * 
 * This script creates all healthcare tools and configurations using your existing structure
 * Run with: node scripts/setup-hume-tools.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const HUME_API_KEY = process.env.HUME_API_KEY;
const TOOLS_API = 'https://api.hume.ai/v0/evi/tools';
const CONFIGS_API = 'https://api.hume.ai/v0/evi/configs';

if (!HUME_API_KEY) {
  console.error('❌ Error: HUME_API_KEY not found in environment variables');
  console.error('Please add HUME_API_KEY to your .env file');
  process.exit(1);
}

// Healthcare tools definitions matching your existing code
const HEALTHCARE_TOOLS = JSON.parse(fs.readFileSync(path.join(__dirname, '../tools/create-business-tools.json'), 'utf8')).tools;

/**
 * Create a single tool via Hume AI API
 */
async function createTool(toolData) {
  try {
    console.log(`📝 Creating tool: ${toolData.name}`);
    
    const response = await fetch(TOOLS_API, {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toolData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Created: ${result.name} (ID: ${result.id})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create tool "${toolData.name}":`, error.message);
    return null;
  }
}

/**
 * Create configuration with tool IDs
 */
async function createConfiguration(toolIds) {
  // Load and update existing config
  const configPath = path.join(__dirname, '../tools/create-business-config.json');
  let config;
  
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('📖 Using existing configuration template');
  } else {
    throw new Error('create-config.json not found');
  }

  // Update tool IDs in config
  config.tools = toolIds.map(id => ({ id }));
  config.name = 'Business Assistant';
  
  try {
    console.log('📝 Creating EVI configuration...');
    
    const response = await fetch(CONFIGS_API, {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Created configuration: ${result.name} (ID: ${result.id})`);
    return result;
  } catch (error) {
    console.error('❌ Failed to create configuration:', error.message);
    return null;
  }
}

/**
 * Save IDs to files
 */
function saveIds(toolResults, configResult) {
  const outputDir = path.join(__dirname, '../tools');
  
  // Create tools directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save tool IDs
  const toolIds = {};
  toolResults.forEach(result => {
    if (result) {
      toolIds[result.name] = result.id;
    }
  });

  // Save tool IDs as JSON
  fs.writeFileSync(
    path.join(outputDir, 'tool-ids.json'),
    JSON.stringify(toolIds, null, 2)
  );

  // Save configuration ID
  const configIds = {};
  if (configResult) {
    configIds.customer_service = configResult.id;
  }

  fs.writeFileSync(
    path.join(outputDir, 'config-ids.json'),
    JSON.stringify(configIds, null, 2)
  );

  // Update the existing config with new tool IDs
  if (configResult && toolResults.length > 0) {
    const configPath = path.join(__dirname, '../tools/create-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.tools = toolResults.map(result => ({ id: result.id }));
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  // Generate .env additions
  const envAdditions = [
    '\n# Hume AI Configuration IDs',
    `NEXT_PUBLIC_HUME_CONFIG_ID_CUSTOMER=${configResult?.id || 'MISSING'}`,
    `NEXT_PUBLIC_HUME_CONFIG_ID=${configResult?.id || 'MISSING'}`,
    '\n# Tool IDs for reference',
    ...Object.entries(toolIds).map(([name, id]) => 
      `# ${name}: ${id}`
    )
  ].join('\n');

  fs.writeFileSync(path.join(outputDir, 'env-additions.txt'), envAdditions);

  return { toolIds, configIds, envAdditions };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Setting up Hume AI tools and configuration for Health Talk AI...\n');

  const toolResults = [];
  const failedTools = [];

  // Create tools
  console.log('📋 Creating healthcare tools...\n');
  for (const toolData of HEALTHCARE_TOOLS) {
    const result = await createTool(toolData);
    
    if (result) {
      toolResults.push(result);
    } else {
      failedTools.push(toolData.name);
    }
    
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Tools: ${toolResults.length} created, ${failedTools.length} failed\n`);

  // Create configuration if tools were successful
  let configResult = null;
  if (toolResults.length > 0) {
    console.log('🔧 Creating EVI configuration...');
    const toolIds = toolResults.map(result => result.id);
    configResult = await createConfiguration(toolIds);
  }

  // Save all IDs
  if (toolResults.length > 0) {
    console.log('\n💾 Saving IDs and updating files...');
    const { toolIds, configIds, envAdditions } = saveIds(toolResults, configResult);
    
    console.log('\n📁 Files updated:');
    console.log('  • tools/tool-ids.json');
    console.log('  • tools/config-ids.json');
    console.log('  • tools/create-config.json (tool IDs updated)');
    console.log('  • tools/env-additions.txt');
    
    console.log('\n🔧 Created Tools:');
    Object.entries(toolIds).forEach(([name, id]) => {
      console.log(`  • ${name}: ${id}`);
    });
    
    if (configResult) {
      console.log('\n🎛️  Created Configuration:');
      console.log(`  • ${configResult.name}: ${configResult.id}`);
    }

    console.log('\n📝 Add to your .env file:');
    console.log(envAdditions);
    
    console.log('\n✨ Next steps:');
    console.log('  1. Add the configuration ID to your .env file');
    console.log('  2. Restart your development server');
    console.log('  3. Test your application with the new tools');
    if (!configResult) {
      console.log('  4. Create business partner configuration separately');
    }
  }

  if (failedTools.length > 0) {
    console.log('\n⚠️  Failed tools (you may need to create these manually):');
    failedTools.forEach(name => console.log(`  • ${name}`));
  }

  console.log('\n🎉 Setup process complete!');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { createTool, createConfiguration, saveIds, HEALTHCARE_TOOLS };