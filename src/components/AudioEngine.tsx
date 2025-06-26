
import React, { useEffect, useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { FocusState, DRRNode, AudioConfig, DRREngineState, CreativeFlowState } from '../types/focus';

interface AudioEngineProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  drrState?: DRREngineState;
  audioConfig?: AudioConfig;
  creativeFlowState?: CreativeFlowState;
  onResonanceUpdate: (nodes: DRRNode[]) => void;
  onFocusTransition: (state: FocusState) => void;
  onBreathCoherenceUpdate: (coherence: number) => void;
}

const AudioEngine = forwardRef<any, AudioEngineProps>(({
  focusState,
  isActive,
  micEnabled,
  drrState,
  audioConfig,
  creativeFlowState,
  onResonanceUpdate,
  onFocusTransition,
  onBreathCoherenceUpdate
}, ref) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const dissonanceOscillatorRef = useRef<OscillatorNode | null>(null);
  const dissonanceGainRef = useRef<GainNode | null>(null);

  const initializeBinauralAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      // Create binaural beat generators
      const leftOscillator = audioContext.createOscillator();
      const rightOscillator = audioContext.createOscillator();
      const leftGain = audioContext.createGain();
      const rightGain = audioContext.createGain();
      const merger = audioContext.createChannelMerger(2);
      const masterGain = audioContext.createGain();
      
      // Create dissonance generator for Creative Flow
      const dissonanceOscillator = audioContext.createOscillator();
      const dissonanceGain = audioContext.createGain();
      
      // Set up binaural routing
      leftOscillator.connect(leftGain);
      rightOscillator.connect(rightGain);
      leftGain.connect(merger, 0, 0); // Left channel
      rightGain.connect(merger, 0, 1); // Right channel
      
      // Set up dissonance routing
      dissonanceOscillator.connect(dissonanceGain);
      dissonanceGain.connect(merger, 0, 0);
      dissonanceGain.connect(merger, 0, 1);
      
      merger.connect(masterGain);
      masterGain.connect(audioContext.destination);
      
      // Store references
      leftOscillatorRef.current = leftOscillator;
      rightOscillatorRef.current = rightOscillator;
      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;
      mergerRef.current = merger;
      masterGainRef.current = masterGain;
      dissonanceOscillatorRef.current = dissonanceOscillator;
      dissonanceGainRef.current = dissonanceGain;
      
      // Set initial parameters
      leftOscillator.type = 'sine';
      rightOscillator.type = 'sine';
      dissonanceOscillator.type = 'sawtooth';
      
      leftGain.gain.value = 0.1;
      rightGain.gain.value = 0.1;
      masterGain.gain.value = 0.3;
      dissonanceGain.gain.value = 0;
      
      console.log('Binaural audio engine initialized');
      
    } catch (error) {
      console.error('Failed to initialize binaural audio:', error);
    }
  };

  const updateBinauralFrequencies = () => {
    if (!audioConfig || !leftOscillatorRef.current || !rightOscillatorRef.current || !audioContextRef.current) {
      return;
    }

    const currentTime = audioContextRef.current.currentTime;
    
    // Smooth frequency transitions
    leftOscillatorRef.current.frequency.setTargetAtTime(
      audioConfig.leftChannel,
      currentTime,
      0.1
    );
    
    rightOscillatorRef.current.frequency.setTargetAtTime(
      audioConfig.rightChannel,
      currentTime,
      0.1
    );

    // Update Creative Flow dissonance
    if (creativeFlowState?.enabled && dissonanceOscillatorRef.current && dissonanceGainRef.current) {
      const dissonanceFreq = audioConfig.carrierFreq * (1 + creativeFlowState.dissonanceLevel * 0.1);
      dissonanceOscillatorRef.current.frequency.setTargetAtTime(
        dissonanceFreq,
        currentTime,
        0.05
      );
      
      dissonanceGainRef.current.gain.setTargetAtTime(
        creativeFlowState.dissonanceLevel * 0.05,
        currentTime,
        0.1
      );
    }

    console.log(`Updated binaural: L=${audioConfig.leftChannel.toFixed(1)}Hz, R=${audioConfig.rightChannel.toFixed(1)}Hz, Beat=${audioConfig.binauralBeat.toFixed(1)}Hz`);
  };

  const checkStateTransitions = () => {
    if (!drrState) return;

    const { vibrationalCoherence, spectralPhaseStability, harmonicConvergence } = drrState;
    
    // Focus 12 → Focus 15: Low mental chatter + moderate coherence
    if (focusState === 'Focus 12' && 
        vibrationalCoherence > 0.4 && 
        spectralPhaseStability > 0.3) {
      console.log('Transitioning to Focus 15 - Enhanced awareness detected');
      onFocusTransition('Focus 15');
    }
    
    // Focus 15 → Focus 21: High coherence + harmonic convergence
    if (focusState === 'Focus 15' && 
        vibrationalCoherence > 0.8 && 
        harmonicConvergence) {
      console.log('Transitioning to Focus 21 - Harmonic convergence achieved');
      onFocusTransition('Focus 21');
    }

    // Update breath coherence for visual feedback
    onBreathCoherenceUpdate(drrState.breathRhythm);
  };

  const startAudioSession = async () => {
    await initializeBinauralAudio();
    
    if (leftOscillatorRef.current && rightOscillatorRef.current && dissonanceOscillatorRef.current) {
      try {
        leftOscillatorRef.current.start();
        rightOscillatorRef.current.start();
        dissonanceOscillatorRef.current.start();
        console.log('Binaural audio session started');
      } catch (error) {
        console.error('Error starting oscillators:', error);
      }
    }
  };

  const stopAudioSession = () => {
    try {
      if (leftOscillatorRef.current) {
        leftOscillatorRef.current.stop();
        leftOscillatorRef.current = null;
      }
      if (rightOscillatorRef.current) {
        rightOscillatorRef.current.stop();
        rightOscillatorRef.current = null;
      }
      if (dissonanceOscillatorRef.current) {
        dissonanceOscillatorRef.current.stop();
        dissonanceOscillatorRef.current = null;
      }
      console.log('Binaural audio session stopped');
    } catch (error) {
      console.error('Error stopping audio session:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    startSession: startAudioSession,
    stopSession: stopAudioSession
  }));

  // Update frequencies when audio config changes
  useEffect(() => {
    if (isActive && audioConfig) {
      updateBinauralFrequencies();
    }
  }, [audioConfig, isActive, creativeFlowState]);

  // Check for state transitions when DRR state changes
  useEffect(() => {
    if (isActive && drrState) {
      checkStateTransitions();
    }
  }, [drrState, focusState, isActive]);

  // Start/stop session based on activity
  useEffect(() => {
    if (isActive) {
      startAudioSession();
    } else {
      stopAudioSession();
    }

    return () => {
      stopAudioSession();
    };
  }, [isActive]);

  return null;
};

AudioEngine.displayName = 'AudioEngine';

export default AudioEngine;
