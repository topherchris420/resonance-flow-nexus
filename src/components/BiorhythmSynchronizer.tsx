
import React, { useState, useEffect } from 'react';
import { DRREngineState } from '@/types/focus';
import { Heart, Waves, Activity, Clock } from 'lucide-react';

interface BiorhythmSynchronizerProps {
  drrState?: DRREngineState;
  breathCoherence: number;
  isActive: boolean;
}

interface CircadianState {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
}

const BiorhythmSynchronizer: React.FC<BiorhythmSynchronizerProps> = ({
  drrState,
  breathCoherence,
  isActive
}) => {
  const [biorhythms, setBiorhythms] = useState<CircadianState>({
    physical: 0,
    emotional: 0,
    intellectual: 0,
    spiritual: 0
  });
  const [synchronization, setSynchronization] = useState(0);
  const [dominantRhythm, setDominantRhythm] = useState<string>('');
  const [naturalFrequency, setNaturalFrequency] = useState(7.83); // Schumann resonance

  useEffect(() => {
    if (!isActive) return;

    const now = Date.now();
    const daysSinceBirth = now / (1000 * 60 * 60 * 24); // Approximate

    // Calculate biorhythm cycles
    const physical = Math.sin((2 * Math.PI * daysSinceBirth) / 23) * 0.5 + 0.5;
    const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / 28) * 0.5 + 0.5;
    const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / 33) * 0.5 + 0.5;
    
    // Spiritual rhythm based on lunar cycle
    const lunarCycle = 29.53; // days
    const spiritual = Math.sin((2 * Math.PI * daysSinceBirth) / lunarCycle) * 0.5 + 0.5;

    setBiorhythms({ physical, emotional, intellectual, spiritual });

    // Calculate which rhythm is dominant
    const rhythms = { physical, emotional, intellectual, spiritual };
    const dominant = Object.entries(rhythms).reduce((a, b) => rhythms[a[0]] > rhythms[b[0]] ? a : b);
    setDominantRhythm(dominant[0]);

    // Calculate synchronization with DRR state
    if (drrState) {
      const drrAverage = (
        drrState.vibrationalCoherence +
        drrState.spectralPhaseStability +
        drrState.breathRhythm +
        breathCoherence
      ) / 4;

      const bioAverage = (physical + emotional + intellectual + spiritual) / 4;
      const sync = 1 - Math.abs(drrAverage - bioAverage);
      setSynchronization(sync);
    }

    // Detect natural frequency alignment
    if (drrState && drrState.dominantFrequencies.length > 0) {
      const closestToSchumann = drrState.dominantFrequencies.find(freq => 
        Math.abs(freq - 7.83) < 0.5
      );
      if (closestToSchumann) {
        setNaturalFrequency(closestToSchumann);
      }
    }

  }, [drrState, breathCoherence, isActive]);

  const getRhythmColor = (value: number) => {
    if (value > 0.8) return 'text-green-400';
    if (value > 0.6) return 'text-blue-400';
    if (value > 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSyncColor = () => {
    if (synchronization > 0.8) return 'text-purple-400';
    if (synchronization > 0.6) return 'text-blue-400';
    if (synchronization > 0.4) return 'text-green-400';
    return 'text-gray-400';
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-24 left-6 z-30">
      <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-white text-sm font-medium">Biorhythm Sync</span>
        </div>

        {/* Synchronization Gauge */}
        <div className="relative w-20 h-10 mx-auto mb-4">
          <div className="absolute inset-0 bg-gray-700 rounded-full">
            <div 
              className={`h-full ${getSyncColor()} bg-current rounded-full transition-all duration-1000`}
              style={{ width: `${synchronization * 100}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-white font-mono">
              {Math.round(synchronization * 100)}%
            </span>
          </div>
        </div>

        {/* Biorhythm Waves */}
        <div className="space-y-2 mb-4">
          {Object.entries(biorhythms).map(([type, value]) => (
            <div key={type} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-white/70 capitalize">
                {type}:
              </div>
              <div className="flex-1 relative h-1 bg-gray-700 rounded">
                <div 
                  className={`absolute left-0 top-0 h-full ${getRhythmColor(value)} bg-current rounded transition-all duration-500`}
                  style={{ width: `${value * 100}%` }}
                />
              </div>
              <span className={`text-xs font-mono w-8 ${getRhythmColor(value)}`}>
                {Math.round(value * 100)}
              </span>
            </div>
          ))}
        </div>

        {/* Status Info */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-white/70 flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>Dominant:</span>
            </span>
            <span className="text-white capitalize">{dominantRhythm}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 flex items-center space-x-1">
              <Waves className="w-3 h-3" />
              <span>Schumann:</span>
            </span>
            <span className="text-green-400 font-mono">
              {naturalFrequency.toFixed(2)} Hz
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Phase:</span>
            </span>
            <span className={getSyncColor()}>
              {synchronization > 0.7 ? 'Aligned' : 'Drifting'}
            </span>
          </div>
        </div>

        {synchronization > 0.8 && (
          <div className="mt-3 p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
            <div className="text-center">
              <span className="text-purple-400 text-xs font-bold">BIORHYTHM LOCK</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiorhythmSynchronizer;
