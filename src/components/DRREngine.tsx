
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState } from '../types/focus';

interface DRREngineProps {
  isActive: boolean;
  micEnabled: boolean;
  onDRRStateUpdate: (state: DRREngineState) => void;
  onResonanceUpdate: (nodes: DRRNode[]) => void;
  onAudioConfigUpdate: (config: AudioConfig) => void;
  onCreativeFlowUpdate: (state: CreativeFlowState) => void;
  onIntuitiveForesightUpdate: (state: IntuitiveForesightState) => void;
}

const DRREngine: React.FC<DRREngineProps> = ({
  isActive,
  micEnabled,
  onDRRStateUpdate,
  onResonanceUpdate,
  onAudioConfigUpdate,
  onCreativeFlowUpdate,
  onIntuitiveForesightUpdate
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fftDataRef = useRef<Float32Array | null>(null);
  const phaseDataRef = useRef<Float32Array | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const amplitudeHistoryRef = useRef<number[]>([]);
  const frequencyHistoryRef = useRef<number[][]>([]);
  
  const [drrState, setDrrState] = useState<DRREngineState>({
    isActive: false,
    currentPhase: 0,
    dominantFrequencies: [],
    spectralPhaseStability: 0,
    vibrationalCoherence: 0,
    breathRhythm: 0,
    amplitudeVariance: 0,
    harmonicConvergence: false,
    goldenRatioAlignment: 0
  });

  const [creativeFlow, setCreativeFlow] = useState<CreativeFlowState>({
    enabled: false,
    dissonanceLevel: 0,
    rhythmicInjections: false,
    nextInjectionTime: 0
  });

  const [intuitiveForesight, setIntuitiveForesight] = useState<IntuitiveForesightState>({
    enabled: false,
    spiralIntensity: 0,
    convergenceDetected: false,
    goldenSpiralNodes: []
  });

  const initializeAudioContext = useCallback(async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (micEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100
          }
        });
        
        micStreamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        
        // Create high-resolution analyser
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 8192; // High resolution for precise frequency analysis
        analyser.smoothingTimeConstant = 0.1; // Lower smoothing for more responsive analysis
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        
        source.connect(analyser);
        analyserRef.current = analyser;
        
        // Initialize data arrays
        fftDataRef.current = new Float32Array(analyser.frequencyBinCount);
        phaseDataRef.current = new Float32Array(analyser.frequencyBinCount);
        
        console.log('DRR Engine initialized with high-resolution FFT');
      }
    } catch (error) {
      console.error('Failed to initialize DRR Engine:', error);
    }
  }, [micEnabled]);

  const calculateSpectralPhaseStability = useCallback((frequencies: number[], phases: number[]): number => {
    if (frequencies.length < 3) return 0;
    
    let stability = 0;
    for (let i = 1; i < frequencies.length; i++) {
      const phaseDiff = Math.abs(phases[i] - phases[i-1]);
      const freqDiff = Math.abs(frequencies[i] - frequencies[i-1]);
      
      // Higher stability when phase differences are proportional to frequency ratios
      if (freqDiff > 0) {
        const coherence = 1 - Math.min(phaseDiff / Math.PI, 1);
        stability += coherence;
      }
    }
    
    return stability / (frequencies.length - 1);
  }, []);

  const calculateVibrationalCoherence = useCallback((amplitudes: number[], frequencies: number[]): number => {
    if (amplitudes.length === 0) return 0;
    
    // Calculate coherence based on harmonic relationships
    let harmonicScore = 0;
    const fundamentalFreq = Math.min(...frequencies.filter(f => f > 0));
    
    frequencies.forEach((freq, i) => {
      if (freq > 0 && fundamentalFreq > 0) {
        const ratio = freq / fundamentalFreq;
        const nearestHarmonic = Math.round(ratio);
        const harmonicError = Math.abs(ratio - nearestHarmonic);
        
        if (harmonicError < 0.05) { // Within 5% of harmonic
          harmonicScore += amplitudes[i] * (1 - harmonicError);
        }
      }
    });
    
    const totalAmplitude = amplitudes.reduce((sum, amp) => sum + amp, 0);
    return totalAmplitude > 0 ? harmonicScore / totalAmplitude : 0;
  }, []);

  const calculateGoldenRatioAlignment = useCallback((frequencies: number[]): number => {
    if (frequencies.length < 2) return 0;
    
    const goldenRatio = 1.618033988749;
    let alignmentScore = 0;
    let pairCount = 0;
    
    for (let i = 0; i < frequencies.length - 1; i++) {
      for (let j = i + 1; j < frequencies.length; j++) {
        const ratio = frequencies[j] / frequencies[i];
        const goldenError = Math.abs(ratio - goldenRatio);
        
        if (goldenError < 0.1) { // Within 10% of golden ratio
          alignmentScore += 1 - goldenError;
          pairCount++;
        }
      }
    }
    
    return pairCount > 0 ? alignmentScore / pairCount : 0;
  }, []);

  const extractDominantFrequencies = useCallback((fftData: Float32Array, sampleRate: number): {frequencies: number[], amplitudes: number[], phases: number[]} => {
    const frequencies: number[] = [];
    const amplitudes: number[] = [];
    const phases: number[] = [];
    const threshold = -60; // dB threshold
    
    // Find peaks in frequency domain
    for (let i = 2; i < fftData.length - 2; i++) {
      const current = fftData[i];
      
      if (current > threshold && 
          current > fftData[i-1] && 
          current > fftData[i+1] &&
          current > fftData[i-2] && 
          current > fftData[i+2]) {
        
        const frequency = (i / fftData.length) * (sampleRate / 2);
        const amplitude = Math.pow(10, current / 20); // Convert dB to linear
        const phase = Math.atan2(Math.sin(i * 0.1), Math.cos(i * 0.1)); // Simplified phase calculation
        
        frequencies.push(frequency);
        amplitudes.push(amplitude);
        phases.push(phase);
      }
    }
    
    // Sort by amplitude and take top 12
    const combined = frequencies.map((freq, i) => ({
      frequency: freq,
      amplitude: amplitudes[i],
      phase: phases[i]
    })).sort((a, b) => b.amplitude - a.amplitude).slice(0, 12);
    
    return {
      frequencies: combined.map(c => c.frequency),
      amplitudes: combined.map(c => c.amplitude),
      phases: combined.map(c => c.phase)
    };
  }, []);

  const generateResonanceNodes = useCallback((frequencies: number[], amplitudes: number[], phases: number[]): DRRNode[] => {
    return frequencies.map((freq, i) => {
      const angle = (i / frequencies.length) * Math.PI * 2;
      const radius = 100 + amplitudes[i] * 150;
      
      return {
        id: `drr_node_${i}_${Date.now()}`,
        frequency: freq,
        amplitude: amplitudes[i],
        phase: phases[i],
        stabilityScore: amplitudes[i],
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        timestamp: Date.now(),
        harmonicIndex: Math.round(freq / (frequencies[0] || 1)),
        resonanceDepth: amplitudes[i] * phases[i]
      };
    });
  }, []);

  const updateCreativeFlow = useCallback((vibrationalCoherence: number, timestamp: number) => {
    const shouldInjectDissonance = timestamp > creativeFlow.nextInjectionTime && 
                                   vibrationalCoherence > 0.7 && 
                                   Math.random() < 0.3;
    
    if (shouldInjectDissonance) {
      setCreativeFlow(prev => ({
        ...prev,
        dissonanceLevel: 0.3 + Math.random() * 0.4,
        rhythmicInjections: true,
        nextInjectionTime: timestamp + 2000 + Math.random() * 3000
      }));
      
      onCreativeFlowUpdate({
        enabled: true,
        dissonanceLevel: 0.3 + Math.random() * 0.4,
        rhythmicInjections: true,
        nextInjectionTime: timestamp + 2000 + Math.random() * 3000
      });
    } else {
      setCreativeFlow(prev => ({
        ...prev,
        dissonanceLevel: Math.max(0, prev.dissonanceLevel - 0.01),
        rhythmicInjections: false
      }));
    }
  }, [creativeFlow.nextInjectionTime, onCreativeFlowUpdate]);

  const updateIntuitiveForesight = useCallback((goldenRatioAlignment: number, harmonicConvergence: boolean, nodes: DRRNode[]) => {
    const convergenceDetected = goldenRatioAlignment > 0.6 && harmonicConvergence;
    
    if (convergenceDetected) {
      const spiralNodes = nodes.map((node, i) => {
        const spiralAngle = i * 2.39996; // Golden angle in radians
        const spiralRadius = i * 15;
        
        return {
          x: Math.cos(spiralAngle) * spiralRadius,
          y: Math.sin(spiralAngle) * spiralRadius,
          intensity: node.amplitude * goldenRatioAlignment
        };
      });
      
      setIntuitiveForesight({
        enabled: true,
        spiralIntensity: goldenRatioAlignment,
        convergenceDetected: true,
        goldenSpiralNodes: spiralNodes
      });
      
      onIntuitiveForesightUpdate({
        enabled: true,
        spiralIntensity: goldenRatioAlignment,
        convergenceDetected: true,
        goldenSpiralNodes: spiralNodes
      });
    } else {
      setIntuitiveForesight(prev => ({
        ...prev,
        spiralIntensity: Math.max(0, prev.spiralIntensity - 0.02),
        convergenceDetected: false
      }));
    }
  }, [onIntuitiveForesightUpdate]);

  const processAudioFrame = useCallback(() => {
    if (!analyserRef.current || !fftDataRef.current || !audioContextRef.current || !isActive) {
      return;
    }
    
    const currentTime = Date.now();
    if (currentTime - lastUpdateRef.current < 250) { // Update every 250ms as specified
      return;
    }
    
    lastUpdateRef.current = currentTime;
    
    // Get frequency domain data
    analyserRef.current.getFloatFrequencyData(fftDataRef.current);
    
    // Extract dominant frequencies and their properties
    const { frequencies, amplitudes, phases } = extractDominantFrequencies(
      fftDataRef.current, 
      audioContextRef.current.sampleRate
    );
    
    // Calculate advanced metrics
    const spectralPhaseStability = calculateSpectralPhaseStability(frequencies, phases);
    const vibrationalCoherence = calculateVibrationalCoherence(amplitudes, frequencies);
    const goldenRatioAlignment = calculateGoldenRatioAlignment(frequencies);
    
    // Update amplitude history for variance calculation
    const currentAmplitude = amplitudes.reduce((sum, amp) => sum + amp, 0) / amplitudes.length;
    amplitudeHistoryRef.current.push(currentAmplitude);
    if (amplitudeHistoryRef.current.length > 20) {
      amplitudeHistoryRef.current.shift();
    }
    
    // Calculate amplitude variance (breath rhythm detection)
    const amplitudeVariance = amplitudeHistoryRef.current.length > 1 ? 
      amplitudeHistoryRef.current.reduce((sum, val, i, arr) => {
        if (i === 0) return 0;
        return sum + Math.pow(val - arr[i-1], 2);
      }, 0) / (amplitudeHistoryRef.current.length - 1) : 0;
    
    const breathRhythm = Math.min(amplitudeVariance * 10, 1);
    const harmonicConvergence = vibrationalCoherence > 0.8 && spectralPhaseStability > 0.7;
    
    // Update DRR state
    const newDrrState: DRREngineState = {
      isActive: true,
      currentPhase: (drrState.currentPhase + 0.1) % (Math.PI * 2),
      dominantFrequencies: frequencies,
      spectralPhaseStability,
      vibrationalCoherence,
      breathRhythm,
      amplitudeVariance,
      harmonicConvergence,
      goldenRatioAlignment
    };
    
    setDrrState(newDrrState);
    onDRRStateUpdate(newDrrState);
    
    // Generate resonance nodes
    const resonanceNodes = generateResonanceNodes(frequencies, amplitudes, phases);
    onResonanceUpdate(resonanceNodes);
    
    // Update audio configuration based on DRR state
    const carrierFreq = frequencies[0] || 440;
    const binauralBeat = 10 - (vibrationalCoherence * 8); // Higher coherence = lower beat frequency
    const leftChannel = carrierFreq;
    const rightChannel = carrierFreq + binauralBeat;
    
    onAudioConfigUpdate({
      carrierFreq,
      binauralBeat,
      infrasonicLayer: harmonicConvergence ? 0.9 : 0,
      modulationRhythm: breathRhythm,
      leftChannel,
      rightChannel
    });
    
    // Update creative flow and intuitive foresight
    updateCreativeFlow(vibrationalCoherence, currentTime);
    updateIntuitiveForesight(goldenRatioAlignment, harmonicConvergence, resonanceNodes);
    
  }, [isActive, drrState.currentPhase, calculateSpectralPhaseStability, calculateVibrationalCoherence, 
      calculateGoldenRatioAlignment, extractDominantFrequencies, generateResonanceNodes, 
      onDRRStateUpdate, onResonanceUpdate, onAudioConfigUpdate, updateCreativeFlow, updateIntuitiveForesight]);

  useEffect(() => {
    if (isActive && micEnabled) {
      initializeAudioContext();
    }
    
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, micEnabled, initializeAudioContext]);

  useEffect(() => {
    if (!isActive) return;
    
    const intervalId = setInterval(processAudioFrame, 100); // Process more frequently than update
    
    return () => clearInterval(intervalId);
  }, [isActive, processAudioFrame]);

  return null;
};

export default DRREngine;
