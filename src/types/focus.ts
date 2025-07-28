
export type FocusState = 'Focus 12' | 'Focus 15' | 'Focus 21' | 'CRL-T' | 'CRL-M' | 'CRL-P';

export interface DRRNode {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  stabilityScore: number;
  x: number;
  y: number;
  timestamp: number;
  harmonicIndex?: number;
  resonanceDepth?: number;
}

export interface AudioConfig {
  carrierFreq: number;
  binauralBeat: number;
  infrasonicLayer: number;
  modulationRhythm: number;
  leftChannel: number;
  rightChannel: number;
  infrasonicPulses?: {
    frequency: number;
    amplitude: number;
  }[];
}

export interface SessionLogEntry {
  timestamp: number;
  nodeFrequencies: number[];
  phase: number[];
  amplitude: number[];
  stateLabel: FocusState;
  breathCoherence: number;
  vibrationalCoherence: number;
  spectralPhaseStability: number;
  resonanceGeometry: {
    nodes: DRRNode[];
    mandalaComplexity: number;
    goldenRatioAlignment: number;
  };
  cognitivePerformance?: number;
  stressRegulation?: number;
}

export interface AtemporalEvent {
  randomizedTimestamp: number;
  actualTimestamp: number;
  resonanceSignature: number[];
  symbolicPattern: {
    type: string;
    recursionLevel: number;
    mirrorState: boolean;
    parallaxDepth: number;
  };
  drrMemory: {
    accumulatedVariance: number[];
    trendPrediction: number[];
    resonanceHistory: DRRNode[];
  };
  noTimeMarkers: boolean;
}

export interface ModuleConfig {
  memoryStream: boolean;
  intuitiveForesight: boolean;
  creativeFlow: boolean;
}

export interface DRREngineState {
  isActive: boolean;
  currentPhase: number;
  dominantFrequencies: number[];
  spectralPhaseStability: number;
  vibrationalCoherence: number;
  breathRhythm: number;
  amplitudeVariance: number;
  harmonicConvergence: boolean;
  goldenRatioAlignment: number;
  varianceHistory: number[];
  timeCollapseActive: boolean;
  resonanceMemory: DRRNode[];
  stabilityDuration: number;
  heartRate?: number;
}

export interface CreativeFlowState {
  enabled: boolean;
  dissonanceLevel: number;
  rhythmicInjections: boolean;
  nextInjectionTime: number;
}

export interface IntuitiveForesightState {
  enabled: boolean;
  spiralIntensity: number;
  convergenceDetected: boolean;
  goldenSpiralNodes: Array<{x: number, y: number, intensity: number}>;
}

export interface Focus15State {
  timeCollapseEvent: boolean;
  recursiveGeometries: Array<{
    id: string;
    x: number;
    y: number;
    recursionDepth: number;
    foldingAngle: number;
  }>;
  symbolicTimeDistortion: Array<{
    symbolId: string;
    originalTimestamp: number;
    currentPhase: number;
    futureOverlay: number;
    counterclockwiseRotation: number;
  }>;
  noTimeLayer: {
    active: boolean;
    recursiveSigils: Array<{
      pattern: string;
      mirrorState: boolean;
      parallaxDepth: number;
      resonanceSignature: number[];
    }>;
  };
  atemporalEvents: AtemporalEvent[];
}
