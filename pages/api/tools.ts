import { NextApiRequest, NextApiResponse } from 'next';
import { runTool } from '@/lib/tools';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log('\n' + '='.repeat(80));
    console.log(`🚀 [${requestId}] API Request received:`, {
      method: req.method,
      url: req.url,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      },
      body: req.body
    });
    console.log('='.repeat(80));

    const { tool, parameters, toolCallId } = req.body;

    if (!tool) {
      console.log(`❌ [${requestId}] Missing tool parameter`);
      return res.status(400).json({ error: 'Tool parameter is required' });
    }

    // Parse parameters if they come as a JSON string (Hume AI sometimes sends them this way)
    let parsedParameters = parameters;
    let originalType = typeof parameters;

    if (typeof parameters === 'string') {
      try {
        parsedParameters = JSON.parse(parameters);
        console.log(`🔄 [${requestId}] Parsed parameters from JSON string:`, parsedParameters);
      } catch (error) {
        console.log(`❌ [${requestId}] Failed to parse parameters JSON:`, error);
        return res.status(400).json({ error: 'Invalid parameters JSON' });
      }
    }

    console.log(`🔧 [${requestId}] Tool call details:`, {
      tool,
      toolCallId,
      originalParameters: parameters,
      parsedParameters,
      originalType,
      parsedType: typeof parsedParameters,
      parsedKeys: Object.keys(parsedParameters || {})
    });

    console.log(`⚡ [${requestId}] Executing tool: ${tool} with parameters:`, parsedParameters);

    const result = await runTool(tool, parsedParameters);

    console.log(`✅ [${requestId}] Tool execution successful:`, {
      tool,
      toolCallId,
      resultMessage: result.message,
      resultData: result.data
    });
    console.log('='.repeat(80) + '\n');

    // Return result for client-side WebSocket handling
    res.status(200).json({
      ...result,
      toolCallId
    });
  } catch (error: any) {
    console.log(`💥 [${requestId}] Error in tools endpoint:`, {
      error: error.message,
      stack: error.stack,
      tool: req.body?.tool,
      parameters: req.body?.parameters
    });
    console.log('='.repeat(80) + '\n');

    res.status(500).json({
      error: error.message,
      tool: req.body?.tool,
      toolCallId: req.body?.toolCallId
    });
  }
}
