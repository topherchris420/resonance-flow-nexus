import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCognitivePerformance,
  calculateStressRegulation,
  estimateHeartRateFromSignal,
} from '../src/utils/sessionMetrics.ts';
import type { DRREngineState } from '../src/types/focus.ts';

const baseState: DRREngineState = {
  isActive: true,
  currentPhase: 0,
  dominantFrequencies: [110, 220, 330],
  spectralPhaseStability: 0.8,
  vibrationalCoherence: 0.75,
  breathRhythm: 0.6,
  amplitudeVariance: 0.02,
  harmonicConvergence: false,
  goldenRatioAlignment: 0.4,
  varianceHistory: [],
  timeCollapseActive: false,
  resonanceMemory: [],
  stabilityDuration: 0,
};

test('session scores are bounded local signal composites', () => {
  const cognitive = calculateCognitivePerformance(baseState, 8);
  const stress = calculateStressRegulation(baseState, 0.7);

  assert.ok(cognitive > 0);
  assert.ok(cognitive <= 1);
  assert.ok(stress > 0);
  assert.ok(stress <= 1);
});

test('estimated heart rate is stable and bounded from amplitude history', () => {
  const heartRate = estimateHeartRateFromSignal([0.12, 0.13, 0.15, 0.16], 60);

  assert.ok(heartRate >= 45);
  assert.ok(heartRate <= 110);
});
