
import React, { useState, useRef, useEffect } from 'react';
import MainCanvas from '../components/MainCanvas';
import Header from '../components/Header';
import ResponsiveLayout from '../components/ResponsiveLayout';
import MobileControls from '../components/MobileControls';
import DesktopSidebar from '../components/DesktopSidebar';
import WelcomeOverlay from '../components/WelcomeOverlay';
import FloatingHelp from '../components/FloatingHelp';
import CognitiveReadinessCompass from '../components/CognitiveReadinessCompass';
import QuantumCoherenceDetector from '../components/QuantumCoherenceDetector';
import BiorhythmSynchronizer from '../components/BiorhythmSynchronizer';
import EnhancedVisualEffects from '../components/EnhancedVisualEffects';
import CognitiveReadinessStatusBar from '../components/CognitiveReadinessStatusBar';
import SacredGeometryOverlay from '../components/SacredGeometryOverlay';
import StressInoculation from '../components/StressInoculation';
import AAR from '../components/AAR';
import TeamCoherence from '../components/TeamCoherence';
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
  const [stressInoculationActive, setStressInoculationActive] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [showAAR, setShowAAR] = useState(false);
  const [teamCoherenceActive, setTeamCoherenceActive] = useState(false);
  
  const audioEngineRef = useRef<any>(null);

  const handleTestComplete = (score: number) => {
    setTestScore(score);
    // TODO: Adjust difficulty based on score
  };

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
    setFocus15State,
    setShowAAR
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
      stateLabel: focusState, // Use focusState directly to match SessionLogEntry type
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
      
      {/* Enhanced Visual Layers */}
      <SacredGeometryOverlay 
        focusState={focusState}
        isActive={isActive}
        drrState={drrState}
      />
      
      <EnhancedVisualEffects
        focusState={focusState}
        isActive={isActive}
        drrState={drrState}
      />
      
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
        onTestComplete={handleTestComplete}
      />
      
      {/* Enhanced Consciousness Widgets */}
      <CognitiveReadinessCompass
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
      
      <StressInoculation
        isActive={stressInoculationActive}
        drrState={drrState}
      />

      {/* Enhanced Status Bar */}
      <CognitiveReadinessStatusBar
        focusState={focusState}
        isActive={isActive}
        breathCoherence={breathCoherence}
        drrState={drrState}
      />
      
      {/* Mobile Controls */}
      <MobileControls
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        onToggleSession={toggleSession}
        onToggleMicrophone={toggleMicrophone}
        onFocusTransition={stateHandlers.handleFocusTransition}
        onToggleStressInoculation={() => setStressInoculationActive(!stressInoculationActive)}
        stressInoculationActive={stressInoculationActive}
        onToggleTeamCoherence={() => setTeamCoherenceActive(!teamCoherenceActive)}
        teamCoherenceActive={teamCoherenceActive}
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
        onToggleStressInoculation={() => setStressInoculationActive(!stressInoculationActive)}
        stressInoculationActive={stressInoculationActive}
        onToggleTeamCoherence={() => setTeamCoherenceActive(!teamCoherenceActive)}
        teamCoherenceActive={teamCoherenceActive}
      />

      {/* Welcome Overlay for new users */}
      {showWelcome && (
        <WelcomeOverlay
          onStart={handleWelcomeStart}
          onClose={handleWelcomeClose}
        />
      )}

      {showAAR && (
        <AAR sessionLog={sessionLog} onClose={() => setShowAAR(false)} />
      )}

      {teamCoherenceActive && (
        <TeamCoherence isActive={teamCoherenceActive} />
      )}

      {/* Floating Help Button */}
      <FloatingHelp />
    </ResponsiveLayout>
  );
};

export default Index;
