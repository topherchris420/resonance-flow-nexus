
import React, { useState, useRef, useEffect } from 'react';
import MainCanvas from '../components/MainCanvas';
import Header from '../components/Header';
import ResponsiveLayout from '../components/ResponsiveLayout';
import MobileControls from '../components/MobileControls';
import DesktopSidebar from '../components/DesktopSidebar';
import WelcomeOverlay from '../components/WelcomeOverlay';
import FloatingHelp from '../components/FloatingHelp';
import ConsciousnessCompass from '../components/ConsciousnessCompass';
import QuantumCoherenceDetector from '../components/QuantumCoherenceDetector';
import BiorhythmSynchronizer from '../components/BiorhythmSynchronizer';
import { useStateHandlers } from '../hooks/useStateHandlers';
import { useSessionManager } from '../components/SessionManager';
import { FocusState, DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, SessionLogEntry, Focus15State } from '../types/focus';

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
  const [showWelcome, setShowWelcome] = useState(false);
  
  const audioEngineRef = useRef<any>(null);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hello-app-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hello-app-visited', 'true');
    }
  }, []);

  const stateHandlers = useStateHandlers({
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
  });

  const { toggleSession } = useSessionManager({
    isActive,
    focusState,
    drrState,
    resonanceNodes,
    breathCoherence,
    setIsActive,
    setFocusState,
    setSessionLog,
    setFocus15State
  });

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
  };

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    toggleSession();
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleQuantumEvent = (intensity: number) => {
    console.log(`QUANTUM COHERENCE EVENT: Intensity ${intensity.toFixed(3)}`);
    // Add quantum event to session log
    setSessionLog(prev => [...prev, {
      timestamp: Date.now(),
      stateLabel: `${focusState} - Quantum Event`,
      vibrationalCoherence: drrState?.vibrationalCoherence || 0,
      spectralPhaseStability: drrState?.spectralPhaseStability || 0,
      breathCoherence,
      resonanceGeometry: {
        nodes: resonanceNodes,
        mandalaComplexity: resonanceNodes.length,
        goldenRatioAlignment: drrState?.goldenRatioAlignment || 0
      },
      nodeFrequencies: drrState?.dominantFrequencies || [],
      phase: resonanceNodes.map(node => node.phase),
      amplitude: resonanceNodes.map(node => node.amplitude)
    }]);
  };

  return (
    <ResponsiveLayout>
      <Header />
      
      <MainCanvas
        resonanceNodes={resonanceNodes}
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        breathCoherence={breathCoherence}
        drrState={drrState}
        audioConfig={audioConfig}
        creativeFlowState={creativeFlowState}
        intuitiveForesightState={intuitiveForesightState}
        focus15State={focus15State}
        audioEngineRef={audioEngineRef}
        onDRRStateUpdate={stateHandlers.handleDRRStateUpdate}
        onResonanceUpdate={stateHandlers.handleResonanceUpdate}
        onAudioConfigUpdate={stateHandlers.handleAudioConfigUpdate}
        onCreativeFlowUpdate={stateHandlers.handleCreativeFlowUpdate}
        onIntuitiveForesightUpdate={stateHandlers.handleIntuitiveForesightUpdate}
        onFocus15StateUpdate={stateHandlers.handleFocus15StateUpdate}
        onFocusTransition={stateHandlers.handleFocusTransition}
        onBreathCoherenceUpdate={setBreathCoherence}
      />
      
      {/* Enhanced Consciousness Widgets */}
      <ConsciousnessCompass
        drrState={drrState}
        focus15State={focus15State}
        isActive={isActive}
      />
      
      <QuantumCoherenceDetector
        drrState={drrState}
        isActive={isActive}
        onQuantumEvent={handleQuantumEvent}
      />
      
      <BiorhythmSynchronizer
        drrState={drrState}
        breathCoherence={breathCoherence}
        isActive={isActive}
      />
      
      {/* Mobile Controls */}
      <MobileControls
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        onToggleSession={toggleSession}
        onToggleMicrophone={toggleMicrophone}
        onFocusTransition={stateHandlers.handleFocusTransition}
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
        onFocusTransition={stateHandlers.handleFocusTransition}
      />

      {/* Welcome Overlay for new users */}
      {showWelcome && (
        <WelcomeOverlay
          onStart={handleWelcomeStart}
          onClose={handleWelcomeClose}
        />
      )}

      {/* Floating Help Button */}
      <FloatingHelp />
    </ResponsiveLayout>
  );
};

export default Index;
