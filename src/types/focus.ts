
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
}

export interface AudioConfig {
  carrierFreq: number;
  binauralBeat: number;
  infrasonicLayer: number;
  modulationRhythm: number;
}

export interface SessionLogEntry {
  timestamp: number;
  nodeFrequencies: number[];
  phase: number[];
  amplitude: number[];
  stateLabel: FocusState;
  breathCoherence: number;
}

export interface ModuleConfig {
  memoryStream: boolean;
  intuitiveForesight: boolean;
  creativeFlow: boolean;
}
