import React, { useEffect, useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { FocusState, DRRNode, AudioConfig, DRREngineState, CreativeFlowState, Focus15State } from '../types/focus';
import { tacticalCues } from '../utils/tactical-cues';

interface AudioEngineProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  drrState?: DRREngineState;
  audioConfig?: AudioConfig;
  creativeFlowState?: CreativeFlowState;
  focus15State?: Focus15State;
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
  focus15State,
  onResonanceUpdate,
  onFocusTransition,
  onBreathCoherenceUpdate
}, ref) => {
  useEffect(() => {
    if (isActive && focusState === 'CRL-T') {
      const interval = setInterval(() => {
        if (Math.random() < 0.2) {
          tacticalCues.subtleBeep();
        }
        if (Math.random() < 0.1) {
          tacticalCues.sharpeningPulse();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, focusState]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const dissonanceOscillatorRef = useRef<OscillatorNode | null>(null);
  const dissonanceGainRef = useRef<GainNode | null>(null);
  
  // Focus 15 infrasonic pulse generators
  const infrasonicOscillatorsRef = useRef<OscillatorNode[]>([]);
  const infrasonicGainsRef = useRef<GainNode[]>([]);

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
      
      // Initialize Focus 15 infrasonic pulse generators
      const infrasonicOscillators: OscillatorNode[] = [];
      const infrasonicGains: GainNode[] = [];
      
      for (let i = 0; i < 2; i++) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.connect(gain);
        gain.connect(merger, 0, 0);
        gain.connect(merger, 0, 1);
        gain.gain.value = 0;
        
        infrasonicOscillators.push(oscillator);
        infrasonicGains.push(gain);
      }
      
      // Store references
      leftOscillatorRef.current = leftOscillator;
      rightOscillatorRef.current = rightOscillator;
      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;
      mergerRef.current = merger;
      masterGainRef.current = masterGain;
      dissonanceOscillatorRef.current = dissonanceOscillator;
      dissonanceGainRef.current = dissonanceGain;
      infrasonicOscillatorsRef.current = infrasonicOscillators;
      infrasonicGainsRef.current = infrasonicGains;
      
      // Set initial parameters
      leftOscillator.type = 'sine';
      rightOscillator.type = 'sine';
      dissonanceOscillator.type = 'sawtooth';
      
      leftGain.gain.value = 0.1;
      rightGain.gain.value = 0.1;
      masterGain.gain.value = 0.3;
      dissonanceGain.gain.value = 0;
      
      console.log('Enhanced binaural audio engine initialized with Focus 15 infrasonic layers');
      
    } catch (error) {
      console.error('Failed to initialize binaural audio:', error);
    }
  };

  const updateBinauralFrequencies = () => {
    if (!audioConfig || !leftOscillatorRef.current || !rightOscillatorRef.current || !audioContextRef.current) {
      return;
    }

    const currentTime = audioContextRef.current.currentTime;
    
    // Focus 15 Time Collapse modulation - detached from user input
    if (focus15State?.timeCollapseEvent && drrState?.timeCollapseActive) {
      // Use DRR-derived resonance memory for modulation instead of breath/voice
      const resonanceModulation = drrState.resonanceMemory.length > 0 
        ? drrState.resonanceMemory[drrState.resonanceMemory.length - 1].amplitude 
        : 0.5;
      
      const memoryPhase = drrState.resonanceMemory.reduce((sum, node) => sum + node.phase, 0) / drrState.resonanceMemory.length;
      
      // Modulate based on internal resonance memory, not external input
      const leftFreq = audioConfig.leftChannel + (Math.sin(memoryPhase) * resonanceModulation * 2);
      const rightFreq = audioConfig.rightChannel + (Math.cos(memoryPhase) * resonanceModulation * 2);
      
      leftOscillatorRef.current.frequency.setTargetAtTime(leftFreq, currentTime, 0.2);
      rightOscillatorRef.current.frequency.setTargetAtTime(rightFreq, currentTime, 0.2);
      
      // Activate infrasonic pulses
      if (audioConfig.infrasonicPulses && infrasonicOscillatorsRef.current.length >= 2) {
        audioConfig.infrasonicPulses.forEach((pulse, i) => {
          if (infrasonicOscillatorsRef.current[i] && infrasonicGainsRef.current[i]) {
            infrasonicOscillatorsRef.current[i].frequency.setTargetAtTime(
              pulse.frequency,
              currentTime,
              0.1
            );
            infrasonicGainsRef.current[i].gain.setTargetAtTime(
              pulse.amplitude,
              currentTime,
              0.5
            );
          }
        });
      }
      
      console.log(`Focus 15 Time Collapse audio: Detached modulation active, resonance memory depth: ${drrState.resonanceMemory.length}`);
    } else {
      // Standard binaural beat operation
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
      
      // Disable infrasonic pulses
      infrasonicGainsRef.current.forEach(gain => {
        gain.gain.setTargetAtTime(0, currentTime, 0.5);
      });
    }

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

    const { vibrationalCoherence, spectralPhaseStability, harmonicConvergence, timeCollapseActive } = drrState;
    
    // Focus 12 → Focus 15: Triggered by Time Collapse Event
    if (focusState === 'Focus 12' && timeCollapseActive) {
      console.log('ONTOLOGICAL BREAK: Transitioning to Focus 15 - Time Collapse Event initiated');
      onFocusTransition('Focus 15');
    }
    
    // Focus 15 → Focus 21: Extended harmonic convergence during time collapse
    if (focusState === 'Focus 15' && 
        timeCollapseActive && 
        vibrationalCoherence > 0.9 && 
        harmonicConvergence &&
        drrState.stabilityDuration > 120) { // 2+ minutes in collapsed time
      console.log('Transitioning to Focus 21 - Sustained nonlinear convergence achieved');
      onFocusTransition('Focus 21');
    }

    onBreathCoherenceUpdate(drrState.breathRhythm);
  };

  const startAudioSession = async () => {
    await initializeBinauralAudio();
    
    if (leftOscillatorRef.current && rightOscillatorRef.current && dissonanceOscillatorRef.current) {
      try {
        leftOscillatorRef.current.start();
        rightOscillatorRef.current.start();
        dissonanceOscillatorRef.current.start();
        
        // Start infrasonic oscillators
        infrasonicOscillatorsRef.current.forEach(osc => osc.start());
        
        console.log('Enhanced binaural audio session started with Focus 15 capabilities');
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
      
      // Stop infrasonic oscillators
      infrasonicOscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      infrasonicOscillatorsRef.current = [];
      infrasonicGainsRef.current = [];
      
      console.log('Enhanced binaural audio session stopped');
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
  }, [audioConfig, isActive, creativeFlowState, focus15State]);

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
});

AudioEngine.displayName = 'AudioEngine';

export default AudioEngine;
