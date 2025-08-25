import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from '@/lib/tools/types';
import { MESSAGE_TEMPLATES } from '@/lib/tools/templates';
import { runTool } from '@/lib/tools';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: '',
        error: MESSAGE_TEMPLATES.ERROR.method_not_allowed
      });
    }

    // Extract tool name and parameters
    const { tool, parameters } = req.body;

    if (!tool) {
      return res.status(400).json({
        success: false,
        message: '',
        error: 'Tool name is required'
      });
    }

    if (!parameters) {
      return res.status(400).json({
        success: false,
        message: '',
        error: 'Parameters are required'
      });
    }

    // Run the tool
    const result = await runTool(tool, parameters);

    // Send success response
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error('Error in tools endpoint:', error);

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
