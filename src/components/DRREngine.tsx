import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, Focus15State, AtemporalEvent } from '../types/focus';

interface DRREngineProps {
  isActive: boolean;
  micEnabled: boolean;
  onDRRStateUpdate: (state: DRREngineState) => void;
  onResonanceUpdate: (nodes: DRRNode[]) => void;
  onAudioConfigUpdate: (config: AudioConfig) => void;
  onCreativeFlowUpdate: (state: CreativeFlowState) => void;
  onIntuitiveForesightUpdate: (state: IntuitiveForesightState) => void;
  onFocus15StateUpdate: (state: Focus15State) => void;
}

const DRREngine: React.FC<DRREngineProps> = ({
  isActive,
  micEnabled,
  onDRRStateUpdate,
  onResonanceUpdate,
  onAudioConfigUpdate,
  onCreativeFlowUpdate,
  onIntuitiveForesightUpdate,
  onFocus15StateUpdate
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fftDataRef = useRef<Float32Array | null>(null);
  const phaseDataRef = useRef<Float32Array | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const amplitudeHistoryRef = useRef<number[]>([]);
  const frequencyHistoryRef = useRef<number[][]>([]);
  const varianceHistoryRef = useRef<number[]>([]);
  const stabilityStartTimeRef = useRef<number | null>(null);
  const sessionSymbolsRef = useRef<Array<{id: string, timestamp: number, pattern: any}>>([]);
  
  const [drrState, setDrrState] = useState<DRREngineState>({
    isActive: false,
    currentPhase: 0,
    dominantFrequencies: [],
    spectralPhaseStability: 0,
    vibrationalCoherence: 0,
    breathRhythm: 0,
    amplitudeVariance: 0,
    harmonicConvergence: false,
    goldenRatioAlignment: 0,
    varianceHistory: [],
    timeCollapseActive: false,
    resonanceMemory: [],
    stabilityDuration: 0
  });

  const [focus15State, setFocus15State] = useState<Focus15State>({
    timeCollapseEvent: false,
    recursiveGeometries: [],
    symbolicTimeDistortion: [],
    noTimeLayer: {
      active: false,
      recursiveSigils: []
    },
    atemporalEvents: []
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
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
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
        const source = audioContext.createMediaStreamSource(stream);
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 8192;
        analyser.smoothingTimeConstant = 0.1;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        
        source.connect(analyser);
        analyserRef.current = analyser;
        
        fftDataRef.current = new Float32Array(analyser.frequencyBinCount);
        phaseDataRef.current = new Float32Array(analyser.frequencyBinCount);
        
        console.log('DRR Engine initialized with Focus 15 Time Collapse detection');
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
      
      if (freqDiff > 0) {
        const coherence = 1 - Math.min(phaseDiff / Math.PI, 1);
        stability += coherence;
      }
    }
    
    return stability / (frequencies.length - 1);
  }, []);

  const calculateVibrationalCoherence = useCallback((amplitudes: number[], frequencies: number[]): number => {
    if (amplitudes.length === 0) return 0;
    
    let harmonicScore = 0;
    const fundamentalFreq = Math.min(...frequencies.filter(f => f > 0));
    
    frequencies.forEach((freq, i) => {
      if (freq > 0 && fundamentalFreq > 0) {
        const ratio = freq / fundamentalFreq;
        const nearestHarmonic = Math.round(ratio);
        const harmonicError = Math.abs(ratio - nearestHarmonic);
        
        if (harmonicError < 0.05) {
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
        
        if (goldenError < 0.1) {
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
    const threshold = -60;
    
    for (let i = 2; i < fftData.length - 2; i++) {
      const current = fftData[i];
      
      if (current > threshold && 
          current > fftData[i-1] && 
          current > fftData[i+1] &&
          current > fftData[i-2] && 
          current > fftData[i+2]) {
        
        const frequency = (i / fftData.length) * (sampleRate / 2);
        const amplitude = Math.pow(10, current / 20);
        const phase = Math.atan2(Math.sin(i * 0.1), Math.cos(i * 0.1));
        
        frequencies.push(frequency);
        amplitudes.push(amplitude);
        phases.push(phase);
      }
    }
    
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

  const detectTimeCollapseEvent = useCallback((variance: number, currentTime: number): boolean => {
    // Track variance history for stability detection
    varianceHistoryRef.current.push(variance);
    if (varianceHistoryRef.current.length > 200) { // Keep last 200 readings (~50 seconds at 4Hz)
      varianceHistoryRef.current.shift();
    }

    // Check if variance is below threshold
    if (variance < 0.01) {
      if (stabilityStartTimeRef.current === null) {
        stabilityStartTimeRef.current = currentTime;
      }
      
      const stabilityDuration = currentTime - stabilityStartTimeRef.current;
      
      // Trigger Time Collapse Event after 45 seconds of stability
      if (stabilityDuration >= 45000 && !drrState.timeCollapseActive) {
        console.log('TIME COLLAPSE EVENT: Initiating Focus 15 transition');
        return true;
      }
    } else {
      stabilityStartTimeRef.current = null;
    }
    
    return false;
  }, [drrState.timeCollapseActive]);

  const generateRecursiveGeometries = useCallback((nodes: DRRNode[]): any[] => {
    return nodes.map((node, i) => ({
      id: `recursive_${i}_${Date.now()}`,
      x: node.x,
      y: node.y,
      recursionDepth: Math.floor(node.amplitude * 8) + 1,
      foldingAngle: node.phase + (Date.now() * 0.001)
    }));
  }, []);

  const generateSymbolicTimeDistortion = useCallback((currentNodes: DRRNode[]): any[] => {
    // Predict future forms based on DRR trends
    const trendPrediction = varianceHistoryRef.current.length > 10 
      ? varianceHistoryRef.current.slice(-10).reduce((sum, v) => sum + v, 0) / 10
      : 0;

    return sessionSymbolsRef.current.map((symbol, i) => ({
      symbolId: symbol.id,
      originalTimestamp: symbol.timestamp,
      currentPhase: (Date.now() - symbol.timestamp) * 0.001,
      futureOverlay: trendPrediction * (i + 1),
      counterclockwiseRotation: -(Date.now() * 0.002 + i)
    }));
  }, []);

  const generateNoTimeLayer = useCallback((accumulatedData: DRRNode[]): any => {
    const recursiveSigils = accumulatedData.map((node, i) => {
      const pattern = `sigil_${Math.floor(node.frequency)}_${Math.floor(node.amplitude * 100)}`;
      
      return {
        pattern,
        mirrorState: i % 2 === 0,
        parallaxDepth: (i / accumulatedData.length) * 100,
        resonanceSignature: [node.frequency, node.amplitude, node.phase]
      };
    });

    return {
      active: true,
      recursiveSigils
    };
  }, []);

  const createAtemporalEvent = useCallback((resonanceData: DRRNode[]): AtemporalEvent => {
    return {
      randomizedTimestamp: Date.now() + (Math.random() - 0.5) * 300000, // ±5 minutes random offset
      actualTimestamp: Date.now(),
      resonanceSignature: resonanceData.map(n => n.frequency),
      symbolicPattern: {
        type: `pattern_${Math.floor(Math.random() * 8)}`,
        recursionLevel: Math.floor(Math.random() * 5) + 1,
        mirrorState: Math.random() > 0.5,
        parallaxDepth: Math.random() * 100
      },
      drrMemory: {
        accumulatedVariance: [...varianceHistoryRef.current],
        trendPrediction: resonanceData.map(n => n.amplitude),
        resonanceHistory: [...drrState.resonanceMemory]
      },
      noTimeMarkers: true
    };
  }, [drrState.resonanceMemory]);

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
    if (currentTime - lastUpdateRef.current < 250) {
      return;
    }
    
    lastUpdateRef.current = currentTime;
    
    analyserRef.current.getFloatFrequencyData(fftDataRef.current);
    
    const { frequencies, amplitudes, phases } = extractDominantFrequencies(
      fftDataRef.current, 
      audioContextRef.current.sampleRate
    );
    
    const spectralPhaseStability = calculateSpectralPhaseStability(frequencies, phases);
    const vibrationalCoherence = calculateVibrationalCoherence(amplitudes, frequencies);
    const goldenRatioAlignment = calculateGoldenRatioAlignment(frequencies);
    
    const currentAmplitude = amplitudes.reduce((sum, amp) => sum + amp, 0) / amplitudes.length;
    amplitudeHistoryRef.current.push(currentAmplitude);
    if (amplitudeHistoryRef.current.length > 20) {
      amplitudeHistoryRef.current.shift();
    }
    
    const amplitudeVariance = amplitudeHistoryRef.current.length > 1 ? 
      amplitudeHistoryRef.current.reduce((sum, val, i, arr) => {
        if (i === 0) return 0;
        return sum + Math.pow(val - arr[i-1], 2);
      }, 0) / (amplitudeHistoryRef.current.length - 1) : 0;
    
    const breathRhythm = Math.min(amplitudeVariance * 10, 1);
    const harmonicConvergence = vibrationalCoherence > 0.8 && spectralPhaseStability > 0.7;
    
    // Store session symbols for time distortion
    if (harmonicConvergence) {
      sessionSymbolsRef.current.push({
        id: `symbol_${Date.now()}`,
        timestamp: currentTime,
        pattern: { frequencies, amplitudes, phases }
      });
    }
    
    // Detect Time Collapse Event
    const timeCollapseTriggered = detectTimeCollapseEvent(amplitudeVariance, currentTime);
    
    const resonanceNodes = generateResonanceNodes(frequencies, amplitudes, phases);
    
    // Update resonance memory for Focus 15
    const updatedResonanceMemory = [...drrState.resonanceMemory, ...resonanceNodes].slice(-100); // Keep last 100
    
    const stabilityDuration = stabilityStartTimeRef.current 
      ? currentTime - stabilityStartTimeRef.current 
      : 0;

    const newDrrState: DRREngineState = {
      isActive: true,
      currentPhase: (drrState.currentPhase + 0.1) % (Math.PI * 2),
      dominantFrequencies: frequencies,
      spectralPhaseStability,
      vibrationalCoherence,
      breathRhythm,
      amplitudeVariance,
      harmonicConvergence,
      goldenRatioAlignment,
      varianceHistory: [...varianceHistoryRef.current],
      timeCollapseActive: timeCollapseTriggered || drrState.timeCollapseActive,
      resonanceMemory: updatedResonanceMemory,
      stabilityDuration: Math.floor(stabilityDuration / 1000)
    };
    
    setDrrState(newDrrState);
    onDRRStateUpdate(newDrrState);
    
    // Generate Focus 15 state if Time Collapse is active
    if (newDrrState.timeCollapseActive) {
      const newFocus15State: Focus15State = {
        timeCollapseEvent: true,
        recursiveGeometries: generateRecursiveGeometries(resonanceNodes),
        symbolicTimeDistortion: generateSymbolicTimeDistortion(resonanceNodes),
        noTimeLayer: generateNoTimeLayer(updatedResonanceMemory),
        atemporalEvents: [...focus15State.atemporalEvents, createAtemporalEvent(resonanceNodes)]
      };
      
      setFocus15State(newFocus15State);
      onFocus15StateUpdate(newFocus15State);
    }
    
    onResonanceUpdate(resonanceNodes);
    
    // Update audio configuration based on DRR state
    const carrierFreq = frequencies[0] || 440;
    let binauralBeat = 10 - (vibrationalCoherence * 8);
    
    // Focus 15 Time Collapse audio modulation
    if (newDrrState.timeCollapseActive) {
      const collapseProgress = Math.min(stabilityDuration / 180000, 1); // 3 minutes to full collapse
      binauralBeat = 4 - (collapseProgress * 3.5); // Descend from 4 Hz to 0.5 Hz
    }
    
    const audioConfig: AudioConfig = {
      carrierFreq,
      binauralBeat,
      infrasonicLayer: harmonicConvergence ? 0.9 : 0,
      modulationRhythm: newDrrState.timeCollapseActive ? 0 : breathRhythm, // Detach from breath in Focus 15
      leftChannel: carrierFreq,
      rightChannel: carrierFreq + binauralBeat,
      infrasonicPulses: newDrrState.timeCollapseActive ? [
        { frequency: 0.9, amplitude: 0.3 },
        { frequency: 1.618, amplitude: 0.2 }
      ] : undefined
    };
    
    onAudioConfigUpdate(audioConfig);
    
    updateCreativeFlow(vibrationalCoherence, currentTime);
    updateIntuitiveForesight(goldenRatioAlignment, harmonicConvergence, resonanceNodes);
    
  }, [isActive, drrState, focus15State, detectTimeCollapseEvent, generateRecursiveGeometries, 
      generateSymbolicTimeDistortion, generateNoTimeLayer, createAtemporalEvent, 
      calculateSpectralPhaseStability, calculateVibrationalCoherence, 
      calculateGoldenRatioAlignment, extractDominantFrequencies, generateResonanceNodes, 
      onDRRStateUpdate, onResonanceUpdate, onAudioConfigUpdate, onFocus15StateUpdate,
      updateCreativeFlow, updateIntuitiveForesight, creativeFlow.nextInjectionTime]);

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
    
    const intervalId = setInterval(processAudioFrame, 100);
    
    return () => clearInterval(intervalId);
  }, [isActive, processAudioFrame]);

  return null;
};

export default DRREngine;
