
export const extractDominantFrequencies = (fftData: Float32Array, sampleRate: number): {frequencies: number[], amplitudes: number[], phases: number[]} => {
  const frequencies: number[] = [];
  const amplitudes: number[] = [];
  const phases: number[] = [];
  const threshold = -60;
  
  for (let i = 2; i < fftData.length - 2; i++) {
    const current = fftData[i];
    
    if (current > threshold && 
        current > fftData[i-1] && 
        current > fftData[i+1] &&
        current > fftData[i-2] && 
        current > fftData[i+2]) {
      
      const frequency = (i / fftData.length) * (sampleRate / 2);
      const amplitude = Math.pow(10, current / 20);
      const phase = Math.atan2(Math.sin(i * 0.1), Math.cos(i * 0.1));
      
      frequencies.push(frequency);
      amplitudes.push(amplitude);
      phases.push(phase);
    }
  }
  
  const combined = frequencies.map((freq, i) => ({
    frequency: freq,
    amplitude: amplitudes[i],
    phase: phases[i]
  })).sort((a, b) => b.amplitude - a.amplitude).slice(0, 12);
  
  return {
    frequencies: combined.map(c => c.frequency),
    amplitudes: combined.map(c => c.amplitude),
    phases: combined.map(c => c.phase)
  };
};

export const calculateSpectralPhaseStability = (frequencies: number[], phases: number[]): number => {
  if (frequencies.length < 3) return 0;
  
  let stability = 0;
  for (let i = 1; i < frequencies.length; i++) {
    const phaseDiff = Math.abs(phases[i] - phases[i-1]);
    const freqDiff = Math.abs(frequencies[i] - frequencies[i-1]);
    
    if (freqDiff > 0) {
      const coherence = 1 - Math.min(phaseDiff / Math.PI, 1);
      stability += coherence;
    }
  }
  
  return stability / (frequencies.length - 1);
};

export const calculateVibrationalCoherence = (amplitudes: number[], frequencies: number[]): number => {
  if (amplitudes.length === 0) return 0;
  
  let harmonicScore = 0;
  const fundamentalFreq = Math.min(...frequencies.filter(f => f > 0));
  
  frequencies.forEach((freq, i) => {
    if (freq > 0 && fundamentalFreq > 0) {
      const ratio = freq / fundamentalFreq;
      const nearestHarmonic = Math.round(ratio);
      const harmonicError = Math.abs(ratio - nearestHarmonic);
      
      if (harmonicError < 0.05) {
        harmonicScore += amplitudes[i] * (1 - harmonicError);
      }
    }
  });
  
  const totalAmplitude = amplitudes.reduce((sum, amp) => sum + amp, 0);
  return totalAmplitude > 0 ? harmonicScore / totalAmplitude : 0;
};

export const calculateGoldenRatioAlignment = (frequencies: number[]): number => {
  if (frequencies.length < 2) return 0;
  
  const goldenRatio = 1.618033988749;
  let alignmentScore = 0;
  let pairCount = 0;
  
  for (let i = 0; i < frequencies.length - 1; i++) {
    for (let j = i + 1; j < frequencies.length; j++) {
      const ratio = frequencies[j] / frequencies[i];
      const goldenError = Math.abs(ratio - goldenRatio);
      
      if (goldenError < 0.1) {
        alignmentScore += 1 - goldenError;
        pairCount++;
      }
    }
  }
  
  return pairCount > 0 ? alignmentScore / pairCount : 0;
};
