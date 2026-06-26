import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { DRRNode } from '../src/types/focus.ts';
import { createAtemporalEvent } from '../src/utils/focus15Utils.ts';

const makeNode = (id: string, amplitude: number, phase: number, frequency: number): DRRNode => ({
  id,
  amplitude,
  phase,
  frequency,
  stabilityScore: 0.8,
  x: 50,
  y: 50,
  timestamp: 1_700_000_000_000,
});

describe('focus 15 event derivation', () => {
  it('derives symbolic event fields from signal data instead of demo randomness', () => {
    const nodes = [
      makeNode('a', 0.2, 0.4, 144),
      makeNode('b', 0.6, 1.2, 233),
    ];

    const quietEvent = createAtemporalEvent(nodes, [0.1, 0.2], nodes);
    const strongEvent = createAtemporalEvent(
      nodes.map(node => ({ ...node, amplitude: node.amplitude + 0.3 })),
      [0.7, 0.8],
      nodes
    );

    assert.match(quietEvent.symbolicPattern.type, /^pattern_[0-7]$/);
    assert.ok(quietEvent.symbolicPattern.recursionLevel >= 1);
    assert.ok(quietEvent.symbolicPattern.recursionLevel <= 5);
    assert.notEqual(strongEvent.symbolicPattern.type, quietEvent.symbolicPattern.type);
    assert.ok(strongEvent.symbolicPattern.parallaxDepth > quietEvent.symbolicPattern.parallaxDepth);
  });
});
