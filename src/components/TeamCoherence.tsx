import React from 'react';
import { DRREngineState, DRRNode } from '../types/focus';
import { calculateLocalSignalChannels } from '../utils/sessionMetrics';

interface SignalChannel {
  id: string;
  name: string;
  coherence: number;
}

interface TeamCoherenceProps {
  isActive: boolean;
  drrState?: DRREngineState;
  resonanceNodes: DRRNode[];
  breathCoherence: number;
}

const TeamCoherence: React.FC<TeamCoherenceProps> = ({
  isActive,
  drrState,
  resonanceNodes,
  breathCoherence
}) => {
  if (!isActive || !drrState) return null;

  const signalChannels: SignalChannel[] = calculateLocalSignalChannels(
    drrState,
    resonanceNodes,
    breathCoherence
  );
  const teamCoherence =
    signalChannels.reduce((acc, channel) => acc + channel.coherence, 0) /
    signalChannels.length;

  return (
    <div className="absolute bottom-24 right-6 bg-black/80 p-4 rounded-lg text-white">
      <h3 className="text-lg mb-2">Signal Coherence</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span>{teamCoherence.toFixed(2)}</span>
      </div>
      <div className="mt-4">
        {signalChannels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between gap-6">
            <span>{channel.name}</span>
            <span>{channel.coherence.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCoherence;
