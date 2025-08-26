import { NextApiRequest, NextApiResponse } from 'next';
import { runTool } from '@/lib/tools';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tool, parameters, toolCallId, agentType } = req.body;

    if (!tool) {
      return res.status(400).json({ error: 'Tool parameter is required' });
    }

    // Parse parameters if they come as a JSON string
    let parsedParameters = parameters;
    if (typeof parameters === 'string') {
      try {
        parsedParameters = JSON.parse(parameters);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid parameters JSON' });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`🤖 EVI → BACKEND: Tool request received`);
    console.log(`🎯 Agent: ${agentType || 'unknown'}`);
    console.log(`📝 Tool: ${tool}`);
    console.log(`📋 Parameters:`, JSON.stringify(parsedParameters, null, 2));
    console.log(`🔑 Call ID: ${toolCallId}`);
    console.log('─'.repeat(80));

    // Optional: Add agent-specific tool restrictions
    const result = await runTool(tool, parsedParameters, agentType);

    console.log(`📤 BACKEND → EVI: Sending response`);
    console.log(`🎯 Agent: ${agentType || 'unknown'}`);
    console.log(`✅ Tool: ${tool} executed successfully`);
    console.log(`📄 Full Response:`, result.message);
    if (result.data) {
      console.log(`📊 Data Returned:`, JSON.stringify(result.data, null, 2));
    }
    console.log('='.repeat(80) + '\n');

    res.status(200).json({
      ...result,
      toolCallId
    });
  } catch (error: any) {
    console.log('\n' + '='.repeat(80));
    console.error(`❌ BACKEND → EVI: Tool execution failed`);
    console.error(`🎯 Agent: ${req.body?.agentType || 'unknown'}`);
    console.error(`🚫 Tool: ${req.body?.tool}`);
    console.error(`💥 Error: ${error.message}`);
    console.log('='.repeat(80) + '\n');

    res.status(500).json({
      error: error.message,
      tool: req.body?.tool,
      toolCallId: req.body?.toolCallId
    });
  }
}
