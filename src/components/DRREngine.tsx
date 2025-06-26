
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, Focus15State } from '../types/focus';
import { useAudioContext } from '../hooks/useAudioContext';
import { useTimeCollapseDetection } from '../hooks/useTimeCollapseDetection';
import { extractDominantFrequencies, calculateSpectralPhaseStability, calculateVibrationalCoherence, calculateGoldenRatioAlignment } from '../utils/audioProcessing';
import { generateResonanceNodes } from '../utils/resonanceUtils';
import { generateRecursiveGeometries, generateSymbolicTimeDistortion, generateNoTimeLayer, createAtemporalEvent } from '../utils/focus15Utils';

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
  const { audioContextRef, analyserRef, fftDataRef, initializeAudioContext, cleanup, getSampleRate } = useAudioContext();
  const { detectTimeCollapseEvent, getVarianceHistory, getStabilityDuration } = useTimeCollapseDetection();
  
  const lastUpdateRef = useRef<number>(0);
  const amplitudeHistoryRef = useRef<number[]>([]);
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

  const updateCreativeFlow = useCallback((vibrationalCoherence: number, timestamp: number) => {
    const shouldInjectDissonance = timestamp > creativeFlow.nextInjectionTime && 
                                   vibrationalCoherence > 0.7 && 
                                   Math.random() < 0.3;
    
    if (shouldInjectDissonance) {
      const newState = {
        enabled: true,
        dissonanceLevel: 0.3 + Math.random() * 0.4,
        rhythmicInjections: true,
        nextInjectionTime: timestamp + 2000 + Math.random() * 3000
      };
      
      setCreativeFlow(newState);
      onCreativeFlowUpdate(newState);
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
        const spiralAngle = i * 2.39996;
        const spiralRadius = i * 15;
        
        return {
          x: Math.cos(spiralAngle) * spiralRadius,
          y: Math.sin(spiralAngle) * spiralRadius,
          intensity: node.amplitude * goldenRatioAlignment
        };
      });
      
      const newState = {
        enabled: true,
        spiralIntensity: goldenRatioAlignment,
        convergenceDetected: true,
        goldenSpiralNodes: spiralNodes
      };
      
      setIntuitiveForesight(newState);
      onIntuitiveForesightUpdate(newState);
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
      getSampleRate()
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
    
    if (harmonicConvergence) {
      sessionSymbolsRef.current.push({
        id: `symbol_${Date.now()}`,
        timestamp: currentTime,
        pattern: { frequencies, amplitudes, phases }
      });
    }
    
    const timeCollapseTriggered = detectTimeCollapseEvent(amplitudeVariance, currentTime, drrState.timeCollapseActive);
    
    const resonanceNodes = generateResonanceNodes(frequencies, amplitudes, phases);
    const updatedResonanceMemory = [...drrState.resonanceMemory, ...resonanceNodes].slice(-100);
    const stabilityDuration = Math.floor(getStabilityDuration(currentTime) / 1000);

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
      varianceHistory: getVarianceHistory(),
      timeCollapseActive: timeCollapseTriggered || drrState.timeCollapseActive,
      resonanceMemory: updatedResonanceMemory,
      stabilityDuration
    };
    
    setDrrState(newDrrState);
    onDRRStateUpdate(newDrrState);
    
    if (newDrrState.timeCollapseActive) {
      const newFocus15State: Focus15State = {
        timeCollapseEvent: true,
        recursiveGeometries: generateRecursiveGeometries(resonanceNodes),
        symbolicTimeDistortion: generateSymbolicTimeDistortion(sessionSymbolsRef.current, getVarianceHistory()),
        noTimeLayer: generateNoTimeLayer(updatedResonanceMemory),
        atemporalEvents: [...focus15State.atemporalEvents, createAtemporalEvent(resonanceNodes, getVarianceHistory(), updatedResonanceMemory)]
      };
      
      setFocus15State(newFocus15State);
      onFocus15StateUpdate(newFocus15State);
    }
    
    onResonanceUpdate(resonanceNodes);
    
    const carrierFreq = frequencies[0] || 440;
    let binauralBeat = 10 - (vibrationalCoherence * 8);
    
    if (newDrrState.timeCollapseActive) {
      const collapseProgress = Math.min(getStabilityDuration(currentTime) / 180000, 1);
      binauralBeat = 4 - (collapseProgress * 3.5);
    }
    
    const audioConfig: AudioConfig = {
      carrierFreq,
      binauralBeat,
      infrasonicLayer: harmonicConvergence ? 0.9 : 0,
      modulationRhythm: newDrrState.timeCollapseActive ? 0 : breathRhythm,
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
    
  }, [isActive, drrState, focus15State, detectTimeCollapseEvent, getSampleRate, getVarianceHistory, getStabilityDuration,
      onDRRStateUpdate, onResonanceUpdate, onAudioConfigUpdate, onFocus15StateUpdate,
      updateCreativeFlow, updateIntuitiveForesight, creativeFlow.nextInjectionTime]);

  useEffect(() => {
    if (isActive && micEnabled) {
      initializeAudioContext(micEnabled);
    }
    
    return cleanup;
  }, [isActive, micEnabled, initializeAudioContext, cleanup]);

  useEffect(() => {
    if (!isActive) return;
    
    const intervalId = setInterval(processAudioFrame, 100);
    
    return () => clearInterval(intervalId);
  }, [isActive, processAudioFrame]);

  return null;
};

export default DRREngine;
