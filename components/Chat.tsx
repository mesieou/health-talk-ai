"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import React, { ComponentRef, useRef } from "react";

const handleToolCall: ToolCallHandler = async (toolCallMessage, send) => {
  console.log(`🔧 Tool: ${toolCallMessage.name}`);

  try {
    const args = JSON.parse(toolCallMessage.parameters);

    // Handle ALL tools via API to show in server logs
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

    if (result.success !== false) {
      console.log(`✅ ${toolCallMessage.name} completed`);
      return send.success(result.message || JSON.stringify(result));
    } else {
      console.log(`❌ ${toolCallMessage.name} failed`);
      return send.error({
        error: "Tool execution failed",
        code: "execution_error",
        level: "warn",
        content: result.error || "Tool failed to execute",
      });
    }
  } catch (error: any) {
    console.error(`💥 ${toolCallMessage.name} error:`, error.message);
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
