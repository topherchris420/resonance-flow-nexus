
export type FocusState = 'Focus 12' | 'Focus 15' | 'Focus 21';

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
