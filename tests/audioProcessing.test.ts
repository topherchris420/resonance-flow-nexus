import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateGoldenRatioAlignment,
  calculateVibrationalCoherence,
} from '../src/utils/audioProcessing.ts';

test('golden ratio alignment is independent of frequency order', () => {
  const ascending = calculateGoldenRatioAlignment([100, 161.8033988749]);
  const descending = calculateGoldenRatioAlignment([161.8033988749, 100]);

  assert.ok(ascending > 0.99);
  assert.equal(descending, ascending);
});

test('vibrational coherence returns zero when there are no positive frequencies', () => {
  assert.equal(calculateVibrationalCoherence([0.5, 0.25], [0, -4]), 0);
});
