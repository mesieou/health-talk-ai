"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import AgentSwitcher, { AgentType, AGENTS } from "./AgentSwitcher";
import React, { ComponentRef, useRef, useState } from "react";

const handleToolCall = (activeAgent: AgentType): ToolCallHandler => async (toolCallMessage, send) => {
  console.log(`🔧 Tool: ${toolCallMessage.name} (Agent: ${activeAgent})`);

  try {
    const args = JSON.parse(toolCallMessage.parameters);

    // Handle ALL tools via API to show in server logs
    const apiResponse = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: toolCallMessage.name,
        parameters: args,
        toolCallId: toolCallMessage.toolCallId,
        agentType: activeAgent
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
  const [activeAgent, setActiveAgent] = useState<AgentType>('customer-service');
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Get configId based on active agent
  const getConfigId = (agentType: AgentType): string | undefined => {
    switch (agentType) {
      case 'business':
        return process.env['NEXT_PUBLIC_HUME_CONFIG_ID_BUSINESS'];
      case 'customer-service':
        return process.env['NEXT_PUBLIC_HUME_CONFIG_ID_CUSTOMER'] || process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
      default:
        return process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
    }
  };

  const configId = getConfigId(activeAgent);

    return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50"
      }
    >
      {/* Health Talk AI Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 6.26L18 5L16.74 9.26L22 10L17.74 12L22 14L16.74 14.74L18 19L13.09 17.74L12 22L10.91 17.74L6 19L7.26 14.74L2 14L6.26 12L2 10L7.26 9.26L6 5L10.91 6.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Health Talk AI</h1>
              <p className="text-sm text-white/80">Your Empathic Healthcare Assistant</p>
            </div>
          </div>
        </div>
      </div>

      <AgentSwitcher
        activeAgent={activeAgent}
        onSwitch={setActiveAgent}
      />

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
        onToolCall={handleToolCall(activeAgent)}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />

      </VoiceProvider>
    </div>
  );
}
