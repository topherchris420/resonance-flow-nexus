
import React, { useRef } from 'react';
import { FocusState, DRREngineState, SessionLogEntry } from '../types/focus';

interface SessionManagerProps {
  isActive: boolean;
  focusState: FocusState;
  drrState?: DRREngineState;
  resonanceNodes: any[];
  breathCoherence: number;
  setIsActive: (active: boolean) => void;
  setFocusState: (state: FocusState) => void;
  setSessionLog: (updater: (prev: SessionLogEntry[]) => SessionLogEntry[]) => void;
  setFocus15State: (state: any) => void;
}

export const useSessionManager = ({
  isActive,
  focusState,
  drrState,
  resonanceNodes,
  breathCoherence,
  setIsActive,
  setFocusState,
  setSessionLog,
  setFocus15State
}: SessionManagerProps) => {
  const sessionStartTimeRef = useRef<number>(0);

  const toggleSession = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    if (newActiveState) {
      setFocusState('Focus 12');
      setSessionLog(() => []);
      setFocus15State(undefined);
      sessionStartTimeRef.current = Date.now();
      console.log('DRR session started - Focus 15 Time Collapse detection active');
    } else {
      console.log('DRR session ended');
      
      // Final session log entry (standard format even if coming from Focus 15)
      if (drrState) {
        const finalEntry: SessionLogEntry = {
          timestamp: Date.now(),
          stateLabel: focusState,
          nodeFrequencies: resonanceNodes.map(node => node.frequency),
          phase: resonanceNodes.map(node => node.phase),
          amplitude: resonanceNodes.map(node => node.amplitude),
          breathCoherence: breathCoherence,
          vibrationalCoherence: drrState.vibrationalCoherence,
          spectralPhaseStability: drrState.spectralPhaseStability,
          resonanceGeometry: {
            nodes: resonanceNodes,
            mandalaComplexity: resonanceNodes.length,
            goldenRatioAlignment: drrState.goldenRatioAlignment
          }
        };
        
        setSessionLog(prev => [...prev, finalEntry]);
      }
    }
  };

  return { toggleSession };
};
