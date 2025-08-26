"use client";

import { Button } from "./ui/button";

type AgentType = 'business' | 'customer-service';

interface AgentSwitcherProps {
  activeAgent: AgentType;
  onSwitch: (agentType: AgentType) => void;
  disabled?: boolean;
}

const AGENTS = {
  'business': {
    name: 'Business Agent',
    description: 'Handles business inquiries and partnerships'
  },
  'customer-service': {
    name: 'Customer Service Agent', 
    description: 'Handles customer support and appointments'
  }
} as const;

export default function AgentSwitcher({ activeAgent, onSwitch, disabled }: AgentSwitcherProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-card border border-border rounded-lg p-2 shadow-lg">
      <div className="flex gap-2">
        <Button 
          variant={activeAgent === 'customer-service' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSwitch('customer-service')}
          disabled={disabled}
          className="text-xs"
        >
          Customer Service
        </Button>
        <Button 
          variant={activeAgent === 'business' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSwitch('business')}
          disabled={disabled}
          className="text-xs"
        >
          Business
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-1">
        {AGENTS[activeAgent].description}
      </div>
    </div>
  );
}

export type { AgentType };
export { AGENTS };