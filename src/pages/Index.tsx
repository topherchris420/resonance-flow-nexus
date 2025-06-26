
import React, { useState, useEffect, useRef } from 'react';
import CymaticCanvas from '../components/CymaticCanvas';
import FocusControls from '../components/FocusControls';
import AudioEngine from '../components/AudioEngine';
import DRREngine from '../components/DRREngine';
import { FocusState, DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, SessionLogEntry } from '../types/focus';

const Index = () => {
  const [focusState, setFocusState] = useState<FocusState>('Focus 12');
  const [isActive, setIsActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [resonanceNodes, setResonanceNodes] = useState<DRRNode[]>([]);
  const [sessionLog, setSessionLog] = useState<SessionLogEntry[]>([]);
  const [breathCoherence, setBreathCoherence] = useState(0);
  const [drrState, setDrrState] = useState<DRREngineState | undefined>();
  const [audioConfig, setAudioConfig] = useState<AudioConfig | undefined>();
  const [creativeFlowState, setCreativeFlowState] = useState<CreativeFlowState | undefined>();
  const [intuitiveForesightState, setIntuitiveForesightState] = useState<IntuitiveForesightState | undefined>();
  
  const audioEngineRef = useRef<any>(null);
  const sessionStartTimeRef = useRef<number>(0);

  const handleFocusTransition = (newState: FocusState) => {
    setFocusState(newState);
    console.log(`DRR-driven transition to ${newState}`);
    
    // Enhanced session logging
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
  };

  const handleResonanceUpdate = (nodes: DRRNode[]) => {
    setResonanceNodes(nodes);
  };

  const handleDRRStateUpdate = (state: DRREngineState) => {
    setDrrState(state);
  };

  const handleAudioConfigUpdate = (config: AudioConfig) => {
    setAudioConfig(config);
  };

  const handleCreativeFlowUpdate = (state: CreativeFlowState) => {
    setCreativeFlowState(state);
  };

  const handleIntuitiveForesightUpdate = (state: IntuitiveForesightState) => {
    setIntuitiveForesightState(state);
  };

  const toggleSession = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    if (newActiveState) {
      setFocusState('Focus 12');
      setSessionLog([]);
      sessionStartTimeRef.current = Date.now();
      console.log('DRR session started');
    } else {
      console.log('DRR session ended');
      
      // Final session log entry
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

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Enhanced Cymatic Canvas with DRR visualization */}
        <CymaticCanvas 
          resonanceNodes={resonanceNodes}
          focusState={focusState}
          isActive={isActive}
          breathCoherence={breathCoherence}
          drrState={drrState}
          intuitiveForesightState={intuitiveForesightState}
        />
        
        {/* DRR Engine - Core processing system */}
        <DRREngine
          isActive={isActive}
          micEnabled={micEnabled}
          onDRRStateUpdate={handleDRRStateUpdate}
          onResonanceUpdate={handleResonanceUpdate}
          onAudioConfigUpdate={handleAudioConfigUpdate}
          onCreativeFlowUpdate={handleCreativeFlowUpdate}
          onIntuitiveForesightUpdate={handleIntuitiveForesightUpdate}
        />
        
        {/* Enhanced Audio Engine with binaural beats */}
        <AudioEngine
          ref={audioEngineRef}
          focusState={focusState}
          isActive={isActive}
          micEnabled={micEnabled}
          drrState={drrState}
          audioConfig={audioConfig}
          creativeFlowState={creativeFlowState}
          onResonanceUpdate={handleResonanceUpdate}
          onFocusTransition={handleFocusTransition}
          onBreathCoherenceUpdate={setBreathCoherence}
        />
        
        {/* Enhanced Controls with DRR metrics */}
        <FocusControls
          focusState={focusState}
          isActive={isActive}
          micEnabled={micEnabled}
          sessionLog={sessionLog}
          breathCoherence={breathCoherence}
          drrState={drrState}
          creativeFlowState={creativeFlowState}
          intuitiveForesightState={intuitiveForesightState}
          onToggleSession={toggleSession}
          onToggleMicrophone={toggleMicrophone}
          onFocusTransition={handleFocusTransition}
        />
      </div>
    </div>
  );
};

export default Index;
