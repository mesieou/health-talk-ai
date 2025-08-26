"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import React, { ComponentRef, useRef } from "react";

const handleToolCall: ToolCallHandler = async (toolCallMessage, send) => {
  console.log('🔧 onToolCall handler triggered:', toolCallMessage);

  try {
    // Parse parameters
    const args = JSON.parse(toolCallMessage.parameters);
    console.log('📋 Parsed parameters:', args);

    // Handle get_practice_info directly
    if (toolCallMessage.name === 'get_practice_info') {
      const response = `Hello! I'm Rachel from Mindful Mental Health Practice. We're open Monday to Thursday 9:00 AM - 6:00 PM, Friday 9:00 AM - 5:00 PM, Saturday 9:00 AM - 2:00 PM, and closed on Sundays. Our initial sessions are $180 and follow-up sessions are $150, with concession rates available. We're located at 123 Mental Health Street, Sydney NSW 2000, with free parking and just a 5-minute walk from Central Station. We specialize in mood disorders, anxiety, relationship issues, stress management, trauma therapy, and cognitive behavioral therapy. How can I help you today?`;

      console.log('✅ Sending practice info response');
      return send.success(response);
    }

    // Handle other tools via API
    const apiResponse = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: toolCallMessage.name,
        parameters: args,
        toolCallId: toolCallMessage.toolCallId
      })
    });

    const result = await apiResponse.json();
    console.log('✅ API result:', result);

    if (result.success !== false) {
      return send.success(result.message || JSON.stringify(result));
    } else {
      return send.error({
        error: "Tool execution failed",
        code: "execution_error",
        level: "warn",
        content: result.error || "Tool failed to execute",
      });
    }
  } catch (error: any) {
    console.error('💥 Tool call error:', error);
    return send.error({
      error: "Tool execution exception",
      code: "execution_exception",
      level: "warn",
      content: error.message || "Unknown error occurred",
    });
  }
};

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

    // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
            <VoiceProvider
        onMessage={(message) => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onToolCall={handleToolCall}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}
