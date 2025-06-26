
import React, { useState, useEffect, useRef } from 'react';
import CymaticCanvas from '../components/CymaticCanvas';
import AudioEngine from '../components/AudioEngine';
import DRREngine from '../components/DRREngine';
import Header from '../components/Header';
import ResponsiveLayout from '../components/ResponsiveLayout';
import MobileControls from '../components/MobileControls';
import DesktopSidebar from '../components/DesktopSidebar';
import { FocusState, DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, SessionLogEntry, Focus15State, AtemporalEvent } from '../types/focus';

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
  const [focus15State, setFocus15State] = useState<Focus15State | undefined>();
  
  const audioEngineRef = useRef<any>(null);
  const sessionStartTimeRef = useRef<number>(0);

  const handleFocusTransition = (newState: FocusState) => {
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

  const handleFocus15StateUpdate = (state: Focus15State) => {
    setFocus15State(state);
    console.log('Focus 15 Time Collapse State updated:', {
      timeCollapseEvent: state.timeCollapseEvent,
      recursiveGeometries: state.recursiveGeometries.length,
      symbolicDistortions: state.symbolicTimeDistortion.length,
      noTimeLayerActive: state.noTimeLayer.active,
      atemporalEvents: state.atemporalEvents.length
    });
  };

  const toggleSession = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    if (newActiveState) {
      setFocusState('Focus 12');
      setSessionLog([]);
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

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <ResponsiveLayout>
      <Header />
      
      <div className="pt-16 pb-20 sm:pb-0 sm:pr-80 flex-1 relative">
        {/* Enhanced Cymatic Canvas with Focus 15 visualization */}
        <CymaticCanvas 
          resonanceNodes={resonanceNodes}
          focusState={focusState}
          isActive={isActive}
          breathCoherence={breathCoherence}
          drrState={drrState}
          intuitiveForesightState={intuitiveForesightState}
          focus15State={focus15State}
        />
        
        {/* Enhanced DRR Engine with Focus 15 detection */}
        <DRREngine
          isActive={isActive}
          micEnabled={micEnabled}
          onDRRStateUpdate={handleDRRStateUpdate}
          onResonanceUpdate={handleResonanceUpdate}
          onAudioConfigUpdate={handleAudioConfigUpdate}
          onCreativeFlowUpdate={handleCreativeFlowUpdate}
          onIntuitiveForesightUpdate={handleIntuitiveForesightUpdate}
          onFocus15StateUpdate={handleFocus15StateUpdate}
        />
        
        {/* Enhanced Audio Engine with Focus 15 infrasonic layers */}
        <AudioEngine
          ref={audioEngineRef}
          focusState={focusState}
          isActive={isActive}
          micEnabled={micEnabled}
          drrState={drrState}
          audioConfig={audioConfig}
          creativeFlowState={creativeFlowState}
          focus15State={focus15State}
          onResonanceUpdate={handleResonanceUpdate}
          onFocusTransition={handleFocusTransition}
          onBreathCoherenceUpdate={setBreathCoherence}
        />
      </div>
      
      {/* Mobile Controls */}
      <MobileControls
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        onToggleSession={toggleSession}
        onToggleMicrophone={toggleMicrophone}
        onFocusTransition={handleFocusTransition}
      />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        breathCoherence={breathCoherence}
        drrState={drrState}
        creativeFlowState={creativeFlowState}
        intuitiveForesightState={intuitiveForesightState}
        onToggleSession={toggleSession}
        onToggleMicrophone={toggleMicrophone}
        onFocusTransition={handleFocusTransition}
      />
    </ResponsiveLayout>
  );
};

export default Index;
