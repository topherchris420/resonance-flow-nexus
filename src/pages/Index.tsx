
import React, { useState, useEffect, useRef } from 'react';
import CymaticCanvas from '../components/CymaticCanvas';
import FocusControls from '../components/FocusControls';
import AudioEngine from '../components/AudioEngine';
import { FocusState, DRRNode } from '../types/focus';

const Index = () => {
  const [focusState, setFocusState] = useState<FocusState>('Focus 12');
  const [isActive, setIsActive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [resonanceNodes, setResonanceNodes] = useState<DRRNode[]>([]);
  const [sessionLog, setSessionLog] = useState<any[]>([]);
  const [breathCoherence, setBreathCoherence] = useState(0);
  
  const audioEngineRef = useRef<any>(null);

  const handleFocusTransition = (newState: FocusState) => {
    setFocusState(newState);
    console.log(`Transitioning to ${newState}`);
    
    // Log transition
    const logEntry = {
      timestamp: Date.now(),
      state: newState,
      resonanceNodes: resonanceNodes,
      breathCoherence: breathCoherence
    };
    setSessionLog(prev => [...prev, logEntry]);
  };

  const handleResonanceUpdate = (nodes: DRRNode[]) => {
    setResonanceNodes(nodes);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setFocusState('Focus 12');
      setSessionLog([]);
    }
  };

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Main Canvas */}
      <div className="relative w-full h-screen">
        <CymaticCanvas 
          resonanceNodes={resonanceNodes}
          focusState={focusState}
          isActive={isActive}
          breathCoherence={breathCoherence}
        />
        
        {/* Audio Engine */}
        <AudioEngine
          ref={audioEngineRef}
          focusState={focusState}
          isActive={isActive}
          micEnabled={micEnabled}
          onResonanceUpdate={handleResonanceUpdate}
          onFocusTransition={handleFocusTransition}
          onBreathCoherenceUpdate={setBreathCoherence}
        />
        
        {/* Controls Overlay */}
        <FocusControls
          focusState={focusState}
          isActive={isActive}
          micEnabled={micEnabled}
          sessionLog={sessionLog}
          breathCoherence={breathCoherence}
          onToggleSession={toggleSession}
          onToggleMicrophone={toggleMicrophone}
          onFocusTransition={handleFocusTransition}
        />
      </div>
    </div>
  );
};

export default Index;
