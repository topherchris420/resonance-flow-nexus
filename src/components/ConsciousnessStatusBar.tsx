import React from 'react';
import { FocusState, DRREngineState } from '../types/focus';
import { Activity, Brain, Zap, Circle } from 'lucide-react';

interface ConsciousnessStatusBarProps {
  focusState: FocusState;
  isActive: boolean;
  breathCoherence: number;
  drrState?: DRREngineState;
}

const ConsciousnessStatusBar: React.FC<ConsciousnessStatusBarProps> = ({
  focusState,
  isActive,
  breathCoherence,
  drrState
}) => {
  const getStateColor = (state: FocusState) => {
    switch (state) {
      case 'Focus 12': return 'consciousness-focus-12';
      case 'Focus 15': return 'consciousness-focus-15';
      case 'Focus 21': return 'consciousness-focus-21';
      default: return 'muted';
    }
  };

  const formatValue = (value: number) => (value * 100).toFixed(1);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 
                    bg-background/80 backdrop-blur-md border border-border/50 
                    rounded-full px-6 py-3 shadow-consciousness">
      <div className="flex items-center space-x-6 text-sm">
        {/* Focus State Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-${getStateColor(focusState)} 
                          ${isActive ? 'animate-consciousness-pulse' : 'opacity-50'}`} />
          <span className="font-medium text-foreground">{focusState}</span>
        </div>

        {/* Breath Coherence */}
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-consciousness-drr" />
          <span className="text-muted-foreground">Breath:</span>
          <span className="font-mono text-consciousness-drr">
            {formatValue(breathCoherence)}%
          </span>
        </div>

        {/* Vibrational Coherence */}
        {drrState && (
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-consciousness-quantum" />
            <span className="text-muted-foreground">Coherence:</span>
            <span className="font-mono text-consciousness-quantum">
              {formatValue(drrState.vibrationalCoherence)}%
            </span>
          </div>
        )}

        {/* Spectral Phase Stability */}
        {drrState && (
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-consciousness-golden" />
            <span className="text-muted-foreground">Stability:</span>
            <span className="font-mono text-consciousness-golden">
              {formatValue(drrState.spectralPhaseStability)}%
            </span>
          </div>
        )}

        {/* DRR Active Indicator */}
        {drrState?.harmonicConvergence && (
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-consciousness-sacred animate-consciousness-pulse" />
            <span className="text-consciousness-sacred font-medium">Convergence</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsciousnessStatusBar;