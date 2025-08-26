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
    name: 'Business Partner',
    description: 'Healthcare partnerships & collaborations'
  },
  'customer-service': {
    name: 'Patient Care',
    description: 'Appointments & support services'
  }
} as const;

export default function AgentSwitcher({ activeAgent, onSwitch, disabled }: AgentSwitcherProps) {
  return (
    <div className="fixed top-24 right-6 z-50 bg-white/95 backdrop-blur-md border border-emerald-200 rounded-2xl p-3 shadow-xl">
                  <div className="flex flex-col gap-2">
        <Button
          variant={activeAgent === 'customer-service' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSwitch('customer-service')}
          disabled={disabled}
          className={`text-xs font-medium transition-all duration-200 w-28 flex items-center justify-center ${
            activeAgent === 'customer-service'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600'
              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Patient
        </Button>
        <Button
          variant={activeAgent === 'business' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSwitch('business')}
          disabled={disabled}
          className={`text-xs font-medium transition-all duration-200 w-28 flex items-center justify-center ${
            activeAgent === 'business'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:from-blue-600 hover:to-purple-600'
              : 'border-blue-300 text-blue-700 hover:bg-blue-50'
          }`}
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
          </svg>
          Business
        </Button>
      </div>
      <div className="text-xs text-gray-600 text-center mt-2 font-medium leading-tight">
        {activeAgent === 'customer-service' ? 'Patient Care' : 'Business Partner'}
      </div>
    </div>
  );
}

export type { AgentType };
export { AGENTS };
