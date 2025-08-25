import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from '@/lib/tools/types';
import { MESSAGE_TEMPLATES } from '@/lib/tools/templates';
import { runTool } from '@/lib/tools';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let parsedParameters: any = null;

  console.log(`🚀 [${requestId}] API Request received:`, {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    },
    body: req.body
  });

  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      console.log(`❌ [${requestId}] Invalid HTTP method: ${req.method}`);
      return res.status(405).json({
        success: false,
        message: '',
        error: MESSAGE_TEMPLATES.ERROR.method_not_allowed
      });
    }

    // Extract tool name and parameters
    const { tool, parameters } = req.body;

    // Parse parameters if they come as a JSON string
    parsedParameters = parameters;
    if (typeof parameters === 'string') {
      try {
        parsedParameters = JSON.parse(parameters);
        console.log(`🔄 [${requestId}] Parsed parameters from JSON string:`, parsedParameters);
      } catch (parseError) {
        console.error(`❌ [${requestId}] Failed to parse parameters JSON:`, parseError);
        return res.status(400).json({
          success: false,
          message: '',
          error: 'Invalid parameters format'
        });
      }
    }

    console.log(`🔧 [${requestId}] Tool call details:`, {
      tool,
      originalParameters: parameters,
      parsedParameters,
      originalType: typeof parameters,
      parsedType: typeof parsedParameters,
      parsedKeys: parsedParameters ? Object.keys(parsedParameters) : 'null'
    });

    if (!tool) {
      console.log(`❌ [${requestId}] Missing tool name`);
      return res.status(400).json({
        success: false,
        message: '',
        error: 'Tool name is required'
      });
    }

    if (!parsedParameters) {
      console.log(`❌ [${requestId}] Missing parameters`);
      return res.status(400).json({
        success: false,
        message: '',
        error: 'Parameters are required'
      });
    }

    console.log(`⚡ [${requestId}] Executing tool: ${tool} with parameters:`, parsedParameters);

    // Run the tool
    const result = await runTool(tool, parsedParameters);

    console.log(`✅ [${requestId}] Tool execution successful:`, {
      tool,
      resultMessage: result.message,
      resultData: result.data
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error(`💥 [${requestId}] Error in tools endpoint:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      tool: req.body?.tool,
      originalParameters: req.body?.parameters,
      parsedParameters: parsedParameters
    });

    // Handle known errors vs unknown errors
    const errorMessage = error instanceof Error
      ? error.message
      : MESSAGE_TEMPLATES.ERROR.generic;

    return res.status(500).json({
      success: false,
      message: '',
      error: errorMessage
    });
  }
}
