
import type { DRRNode, AtemporalEvent, Focus15State } from '../types/focus';

interface SessionSymbol {
  id: string;
  timestamp: number;
  pattern: {
    frequencies: number[];
    amplitudes: number[];
    phases: number[];
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const deriveEventSignature = (resonanceData: DRRNode[], varianceHistory: number[]) => {
  const averageAmplitude = average(resonanceData.map(node => node.amplitude));
  const averagePhase = average(resonanceData.map(node => node.phase));
  const averageFrequency = average(resonanceData.map(node => node.frequency));
  const recentVariance = average(varianceHistory.slice(-10));
  const phaseComponent = (Math.sin(averagePhase) + 1) / 2;
  const frequencyComponent = (averageFrequency % 64) / 64;
  const signatureStrength = clamp(
    averageAmplitude * 0.5 + recentVariance * 0.25 + phaseComponent * 0.15 + frequencyComponent * 0.1,
    0,
    1
  );

  return {
    averageAmplitude,
    averagePhase,
    recentVariance,
    signatureStrength
  };
};

export const generateRecursiveGeometries = (nodes: DRRNode[]): Focus15State['recursiveGeometries'] => {
  return nodes.map((node, i) => ({
    id: `recursive_${i}_${Date.now()}`,
    x: node.x,
    y: node.y,
    recursionDepth: Math.floor(node.amplitude * 8) + 1,
    foldingAngle: node.phase + (Date.now() * 0.001)
  }));
};

export const generateSymbolicTimeDistortion = (sessionSymbols: SessionSymbol[], varianceHistory: number[]): Focus15State['symbolicTimeDistortion'] => {
  const trendPrediction = varianceHistory.length > 10 
    ? varianceHistory.slice(-10).reduce((sum, v) => sum + v, 0) / 10
    : 0;

  return sessionSymbols.map((symbol, i) => ({
    symbolId: symbol.id,
    originalTimestamp: symbol.timestamp,
    currentPhase: (Date.now() - symbol.timestamp) * 0.001,
    futureOverlay: trendPrediction * (i + 1),
    counterclockwiseRotation: -(Date.now() * 0.002 + i)
  }));
};

export const generateNoTimeLayer = (accumulatedData: DRRNode[]): Focus15State['noTimeLayer'] => {
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
};

export const createAtemporalEvent = (resonanceData: DRRNode[], varianceHistory: number[], resonanceMemory: DRRNode[]): AtemporalEvent => {
  const now = Date.now();
  const { averageAmplitude, averagePhase, recentVariance, signatureStrength } = deriveEventSignature(resonanceData, varianceHistory);
  const temporalOffset = Math.round((signatureStrength - 0.5) * 300000);

  return {
    randomizedTimestamp: now + temporalOffset,
    actualTimestamp: now,
    resonanceSignature: resonanceData.map(n => n.frequency),
    symbolicPattern: {
      type: `pattern_${Math.min(7, Math.floor(signatureStrength * 8))}`,
      recursionLevel: clamp(Math.round(averageAmplitude * 5), 1, 5),
      mirrorState: Math.cos(averagePhase) < 0,
      parallaxDepth: clamp(averageAmplitude * 70 + recentVariance * 30, 0, 100)
    },
    drrMemory: {
      accumulatedVariance: [...varianceHistory],
      trendPrediction: resonanceData.map(n => n.amplitude),
      resonanceHistory: [...resonanceMemory]
    },
    noTimeMarkers: true
  };
};
