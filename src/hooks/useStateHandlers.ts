
import { useCallback, useRef } from 'react';
import { FocusState, DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, SessionLogEntry, Focus15State, AtemporalEvent } from '../types/focus';

interface UseStateHandlersProps {
  focusState: FocusState;
  resonanceNodes: DRRNode[];
  breathCoherence: number;
  drrState?: DRREngineState;
  focus15State?: Focus15State;
  setSessionLog: (updater: (prev: SessionLogEntry[]) => SessionLogEntry[]) => void;
  setResonanceNodes: (nodes: DRRNode[]) => void;
  setDrrState: (state: DRREngineState) => void;
  setAudioConfig: (config: AudioConfig) => void;
  setCreativeFlowState: (state: CreativeFlowState) => void;
  setIntuitiveForesightState: (state: IntuitiveForesightState) => void;
  setFocus15State: (state: Focus15State) => void;
  setFocusState: (state: FocusState) => void;
}

export const useStateHandlers = ({
  focusState,
  resonanceNodes,
  breathCoherence,
  drrState,
  focus15State,
  setSessionLog,
  setResonanceNodes,
  setDrrState,
  setAudioConfig,
  setCreativeFlowState,
  setIntuitiveForesightState,
  setFocus15State,
  setFocusState
}: UseStateHandlersProps) => {
  
  const handleFocusTransition = useCallback((newState: FocusState) => {
    setFocusState(newState);
    console.log(`DRR-driven transition to ${newState}`);
    
    // Enhanced session logging with Focus 15 atemporal events
    if (newState === 'Focus 15' && focus15State?.timeCollapseEvent) {
      // Create atemporal event entry instead of normal log entry
      const atemporalEvent: AtemporalEvent = {
        randomizedTimestamp: Date.now() + (Math.random() - 0.5) * 600000, // ±10 minutes
        actualTimestamp: Date.now(),
        resonanceSignature: resonanceNodes.map(node => node.frequency),
        symbolicPattern: {
          type: 'ontological_break',
          recursionLevel: Math.floor(Math.random() * 7) + 1,
          mirrorState: true,
          parallaxDepth: Math.random() * 150
        },
        drrMemory: {
          accumulatedVariance: drrState?.varianceHistory || [],
          trendPrediction: resonanceNodes.map(n => n.amplitude),
          resonanceHistory: drrState?.resonanceMemory || []
        },
        noTimeMarkers: true
      };
      
      console.log('ATEMPORAL EVENT LOGGED: Focus 15 ontological break recorded');
    } else {
      // Standard session logging for other states
      const logEntry: SessionLogEntry = {
        timestamp: Date.now(),
        stateLabel: newState,
        nodeFrequencies: resonanceNodes.map(node => node.frequency),
        phase: resonanceNodes.map(node => node.phase),
        amplitude: resonanceNodes.map(node => node.amplitude),
        breathCoherence: breathCoherence,
        vibrationalCoherence: drrState?.vibrationalCoherence || 0,
        spectralPhaseStability: drrState?.spectralPhaseStability || 0,
        resonanceGeometry: {
          nodes: resonanceNodes,
          mandalaComplexity: resonanceNodes.length,
          goldenRatioAlignment: drrState?.goldenRatioAlignment || 0
        }
      };
      
      setSessionLog(prev => [...prev, logEntry]);
    }
  }, [
    setFocusState, focus15State?.timeCollapseEvent, resonanceNodes, drrState, 
    breathCoherence, setSessionLog
  ]);

  const handleResonanceUpdate = useCallback((nodes: DRRNode[]) => {
    setResonanceNodes(nodes);
  }, [setResonanceNodes]);

  const handleDRRStateUpdate = useCallback((state: DRREngineState) => {
    setDrrState(state);
  }, [setDrrState]);

  const handleAudioConfigUpdate = useCallback((config: AudioConfig) => {
    setAudioConfig(config);
  }, [setAudioConfig]);

  const handleCreativeFlowUpdate = useCallback((state: CreativeFlowState) => {
    setCreativeFlowState(state);
  }, [setCreativeFlowState]);

  const handleIntuitiveForesightUpdate = useCallback((state: IntuitiveForesightState) => {
    setIntuitiveForesightState(state);
  }, [setIntuitiveForesightState]);

  const handleFocus15StateUpdate = useCallback((state: Focus15State) => {
    setFocus15State(state);
    console.log('Focus 15 Time Collapse State updated:', {
      timeCollapseEvent: state.timeCollapseEvent,
      recursiveGeometries: state.recursiveGeometries.length,
      symbolicDistortions: state.symbolicTimeDistortion.length,
      noTimeLayerActive: state.noTimeLayer.active,
      atemporalEvents: state.atemporalEvents.length
    });
  }, [setFocus15State]);

  return {
    handleFocusTransition,
    handleResonanceUpdate,
    handleDRRStateUpdate,
    handleAudioConfigUpdate,
    handleCreativeFlowUpdate,
    handleIntuitiveForesightUpdate,
    handleFocus15StateUpdate
  };
};
