import type { DRREngineState, DRRNode } from '../types/focus';

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const calculateCognitivePerformance = (
  drrState: DRREngineState,
  nodeCount: number
): number => {
  const nodeDensity = clamp01(nodeCount / 12);

  return clamp01(
    drrState.vibrationalCoherence * 0.35 +
      drrState.spectralPhaseStability * 0.3 +
      drrState.goldenRatioAlignment * 0.2 +
      nodeDensity * 0.15
  );
};

export const calculateStressRegulation = (
  drrState: DRREngineState,
  breathCoherence: number
): number => {
  const variancePenalty = clamp01(drrState.amplitudeVariance * 8);

  return clamp01(
    breathCoherence * 0.35 +
      drrState.vibrationalCoherence * 0.3 +
      drrState.spectralPhaseStability * 0.2 +
      (1 - variancePenalty) * 0.15
  );
};

export const estimateHeartRateFromSignal = (
  amplitudeHistory: number[],
  fallbackRate = 60
): number => {
  if (amplitudeHistory.length < 4) return fallbackRate;

  const latest = amplitudeHistory[amplitudeHistory.length - 1];
  const baseline =
    amplitudeHistory.reduce((sum, value) => sum + value, 0) /
    amplitudeHistory.length;
  const variance =
    amplitudeHistory.reduce((sum, value) => sum + Math.abs(value - baseline), 0) /
    amplitudeHistory.length;

  const trend = latest - amplitudeHistory[0];
  const estimated = fallbackRate + trend * 320 + variance * 180;

  return Math.round(Math.max(45, Math.min(110, estimated)));
};

export const calculateLocalSignalChannels = (
  drrState: DRREngineState,
  nodes: DRRNode[],
  breathCoherence: number
) => [
  {
    id: 'phase',
    name: 'Phase Lock',
    coherence: clamp01(drrState.spectralPhaseStability),
  },
  {
    id: 'breath',
    name: 'Breath Signal',
    coherence: clamp01(breathCoherence || drrState.breathRhythm),
  },
  {
    id: 'harmonic',
    name: 'Harmonic Fit',
    coherence: clamp01(drrState.vibrationalCoherence),
  },
  {
    id: 'resonance',
    name: 'Node Stability',
    coherence: clamp01(
      nodes.length === 0
        ? 0
        : nodes.reduce((sum, node) => sum + node.stabilityScore, 0) /
            nodes.length
    ),
  },
];
