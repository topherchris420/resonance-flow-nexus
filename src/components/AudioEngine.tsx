
import React, { useEffect, useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { FocusState, DRRNode, AudioConfig } from '../types/focus';

interface AudioEngineProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  onResonanceUpdate: (nodes: DRRNode[]) => void;
  onFocusTransition: (state: FocusState) => void;
  onBreathCoherenceUpdate: (coherence: number) => void;
}

const AudioEngine = forwardRef<any, AudioEngineProps>(({
  focusState,
  isActive,
  micEnabled,
  onResonanceUpdate,
  onFocusTransition,
  onBreathCoherenceUpdate
}, ref) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const [currentConfig, setCurrentConfig] = useState<AudioConfig>({
    carrierFreq: 440,
    binauralBeat: 10,
    infrasonicLayer: 0,
    modulationRhythm: 1
  });

  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      // Create oscillator for binaural beats
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const analyser = audioContext.createAnalyser();
      
      oscillator.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      analyserRef.current = analyser;
      
      // Configure analyser
      analyser.fftSize = 2048;
      
      console.log('Audio engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 2048;
        
        source.connect(analyser);
        
        // Start DRR analysis
        startDRRAnalysis(analyser);
      }
      
      console.log('Microphone started');
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  const stopMicrophone = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  const startDRRAnalysis = (analyser: AnalyserNode) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const analyze = () => {
      if (!isActive) {
        requestAnimationFrame(analyze);
        return;
      }
      
      analyser.getByteFrequencyData(dataArray);
      
      // Extract dominant frequency clusters
      const nodes = extractResonanceNodes(dataArray);
      onResonanceUpdate(nodes);
      
      // Calculate breath coherence
      const coherence = calculateBreathCoherence(dataArray);
      onBreathCoherenceUpdate(coherence);
      
      // Check for state transitions
      checkStateTransitions(coherence, nodes);
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const extractResonanceNodes = (frequencyData: Uint8Array): DRRNode[] => {
    const nodes: DRRNode[] = [];
    const threshold = 50;
    
    for (let i = 1; i < frequencyData.length - 1; i++) {
      if (frequencyData[i] > threshold && 
          frequencyData[i] > frequencyData[i - 1] && 
          frequencyData[i] > frequencyData[i + 1]) {
        
        const frequency = (i / frequencyData.length) * 22050; // Nyquist frequency
        const amplitude = frequencyData[i] / 255;
        const phase = Math.random() * Math.PI * 2; // Simplified phase calculation
        
        nodes.push({
          id: `node_${i}`,
          frequency,
          amplitude,
          phase,
          stabilityScore: amplitude,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          timestamp: Date.now()
        });
      }
    }
    
    return nodes.slice(0, 12); // Limit to 12 nodes
  };

  const calculateBreathCoherence = (frequencyData: Uint8Array): number => {
    // Simplified breath detection based on low-frequency patterns
    const lowFreqSum = frequencyData.slice(0, 10).reduce((sum, val) => sum + val, 0);
    const avgAmplitude = lowFreqSum / 10;
    return Math.min(avgAmplitude / 100, 1);
  };

  const checkStateTransitions = (coherence: number, nodes: DRRNode[]) => {
    const avgAmplitude = nodes.reduce((sum, node) => sum + node.amplitude, 0) / nodes.length || 0;
    
    // Focus 12 to Focus 15 transition
    if (focusState === 'Focus 12' && avgAmplitude < 0.02 && coherence > 0.3) {
      updateAudioConfig({ ...currentConfig, binauralBeat: 4, infrasonicLayer: 0.9 });
      onFocusTransition('Focus 15');
    }
    
    // Focus 15 to Focus 21 transition
    if (focusState === 'Focus 15' && coherence > 0.8) {
      updateAudioConfig({ 
        ...currentConfig, 
        carrierFreq: 2, 
        binauralBeat: 2 * 1.618 // Golden ratio
      });
      onFocusTransition('Focus 21');
    }
  };

  const updateAudioConfig = (newConfig: AudioConfig) => {
    setCurrentConfig(newConfig);
    
    if (oscillatorRef.current && gainNodeRef.current) {
      // Update oscillator frequency for binaural beat
      oscillatorRef.current.frequency.setValueAtTime(
        newConfig.carrierFreq + newConfig.binauralBeat,
        audioContextRef.current!.currentTime
      );
      
      // Update gain based on focus state
      const volume = focusState === 'Focus 21' ? 0.3 : 0.2;
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioContextRef.current!.currentTime
      );
    }
  };

  const startAudioSession = () => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.start();
      
      // Set initial configuration based on focus state
      const initialConfig = {
        carrierFreq: 440,
        binauralBeat: focusState === 'Focus 12' ? 10 : focusState === 'Focus 15' ? 4 : 2,
        infrasonicLayer: focusState === 'Focus 15' ? 0.9 : 0,
        modulationRhythm: 1
      };
      
      updateAudioConfig(initialConfig);
    }
  };

  const stopAudioSession = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (gainNodeRef.current) {
      gainNodeRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    startSession: startAudioSession,
    stopSession: stopAudioSession,
    updateConfig: updateAudioConfig
  }));

  useEffect(() => {
    if (isActive) {
      initializeAudio().then(() => {
        if (micEnabled) {
          startMicrophone();
        }
        startAudioSession();
      });
    } else {
      stopAudioSession();
      stopMicrophone();
    }

    return () => {
      stopAudioSession();
      stopMicrophone();
    };
  }, [isActive]);

  useEffect(() => {
    if (micEnabled && isActive) {
      startMicrophone();
    } else {
      stopMicrophone();
    }
  }, [micEnabled]);

  return null; // This component doesn't render anything
});

AudioEngine.displayName = 'AudioEngine';

export default AudioEngine;
