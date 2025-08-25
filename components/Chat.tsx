"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";

type ToolMeta = {
  endpoint: string;
  error: {
    error: string;
    code: string;
    level: "warn" | "error";
    content: string;
  };
};

// Tool factory
const createTool = (name: string, errorMessage: string): ToolMeta => ({
  endpoint: "/api/tools",
  error: {
    error: `${name} tool error`,
    code: `${name.replace(/_/g, '_')}_error`,
    level: "warn" as const,
    content: errorMessage,
  },
});

// Tool definitions
const tools: Record<string, ToolMeta> = {
  get_practice_info: createTool("Practice info", "There was an error retrieving practice information"),
  check_availability: createTool("Availability", "There was an error checking availability"),
  book_appointment: createTool("Booking", "There was an error booking the appointment"),
  save_patient_info: createTool("Patient info", "There was an error saving patient information"),
  log_risk_assessment: createTool("Risk assessment", "There was an error logging the risk assessment"),
  send_confirmation: createTool("Confirmation", "There was an error sending the confirmation"),
};

const handleToolCall: ToolCallHandler = async (message, send) => {
  console.log('🔧 Tool call received:', message.name, message.parameters);

  const tool = tools[message.name];

  if (!tool) {
    console.error('❌ Tool not found:', message.name);
    return send.error({
      error: "Tool not found",
      code: "tool_not_found",
      level: "warn",
      content: `The tool '${message.name}' was not found`,
    });
  }

  try {
    console.log('📋 Calling API:', tool.endpoint);

    const response = await fetch(tool.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: message.name,
        parameters: message.parameters
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ API result:', result);

    return result.success
      ? send.success(result.message || JSON.stringify(result))
      : send.error({
          error: result.error || "Tool execution failed",
          code: "execution_error",
          level: "warn",
          content: result.error || "The tool failed to execute properly",
        });
  } catch (err) {
    console.error('💥 Tool error:', err);
    return send.error(tool.error);
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
        onToolCall={handleToolCall}
        onMessage={() => {
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
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}
