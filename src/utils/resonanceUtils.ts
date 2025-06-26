
import { DRRNode } from '../types/focus';

export const generateResonanceNodes = (frequencies: number[], amplitudes: number[], phases: number[]): DRRNode[] => {
  return frequencies.map((freq, i) => {
    const angle = (i / frequencies.length) * Math.PI * 2;
    const radius = 100 + amplitudes[i] * 150;
    
    return {
      id: `drr_node_${i}_${Date.now()}`,
      frequency: freq,
      amplitude: amplitudes[i],
      phase: phases[i],
      stabilityScore: amplitudes[i],
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      timestamp: Date.now(),
      harmonicIndex: Math.round(freq / (frequencies[0] || 1)),
      resonanceDepth: amplitudes[i] * phases[i]
    };
  });
};
