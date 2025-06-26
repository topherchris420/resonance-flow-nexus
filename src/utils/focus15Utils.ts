
import { DRRNode, AtemporalEvent, DRREngineState } from '../types/focus';

export const generateRecursiveGeometries = (nodes: DRRNode[]): any[] => {
  return nodes.map((node, i) => ({
    id: `recursive_${i}_${Date.now()}`,
    x: node.x,
    y: node.y,
    recursionDepth: Math.floor(node.amplitude * 8) + 1,
    foldingAngle: node.phase + (Date.now() * 0.001)
  }));
};

export const generateSymbolicTimeDistortion = (sessionSymbols: Array<{id: string, timestamp: number, pattern: any}>, varianceHistory: number[]): any[] => {
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

export const generateNoTimeLayer = (accumulatedData: DRRNode[]): any => {
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
  return {
    randomizedTimestamp: Date.now() + (Math.random() - 0.5) * 300000,
    actualTimestamp: Date.now(),
    resonanceSignature: resonanceData.map(n => n.frequency),
    symbolicPattern: {
      type: `pattern_${Math.floor(Math.random() * 8)}`,
      recursionLevel: Math.floor(Math.random() * 5) + 1,
      mirrorState: Math.random() > 0.5,
      parallaxDepth: Math.random() * 100
    },
    drrMemory: {
      accumulatedVariance: [...varianceHistory],
      trendPrediction: resonanceData.map(n => n.amplitude),
      resonanceHistory: [...resonanceMemory]
    },
    noTimeMarkers: true
  };
};
