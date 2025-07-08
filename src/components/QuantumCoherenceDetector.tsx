
import React, { useState, useEffect } from 'react';
import { DRREngineState } from '@/types/focus';
import { Atom, Waves, Zap, Eye } from 'lucide-react';

interface QuantumCoherenceDetectorProps {
  drrState?: DRREngineState;
  isActive: boolean;
  onQuantumEvent?: (intensity: number) => void;
}

const QuantumCoherenceDetector: React.FC<QuantumCoherenceDetectorProps> = ({
  drrState,
  isActive,
  onQuantumEvent
}) => {
  const [quantumField, setQuantumField] = useState(0);
  const [entanglementLevel, setEntanglementLevel] = useState(0);
  const [coherenceHistory, setCoherenceHistory] = useState<number[]>([]);
  const [quantumEvent, setQuantumEvent] = useState(false);
  const [fieldStability, setFieldStability] = useState(0);

  useEffect(() => {
    if (!isActive || !drrState) {
      setQuantumField(0);
      setEntanglementLevel(0);
      return;
    }

    // Calculate quantum field strength based on multiple coherence factors
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const goldenHarmonic = Math.abs(drrState.goldenRatioAlignment - (1/phi));
    const quantumStrength = (
      drrState.vibrationalCoherence * 0.3 +
      drrState.spectralPhaseStability * 0.3 +
      (1 - goldenHarmonic) * 0.4 // Closer to golden ratio = higher quantum field
    );

    setQuantumField(quantumStrength);

    // Calculate entanglement based on phase correlations
    const phaseEntanglement = drrState.spectralPhaseStability * drrState.breathRhythm;
    setEntanglementLevel(phaseEntanglement);

    // Track coherence history for stability analysis
    setCoherenceHistory(prev => {
      const newHistory = [...prev, quantumStrength].slice(-50);
      
      // Calculate field stability (variance in recent history)
      if (newHistory.length > 10) {
        const mean = newHistory.reduce((a, b) => a + b) / newHistory.length;
        const variance = newHistory.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / newHistory.length;
        setFieldStability(1 - Math.min(variance * 10, 1)); // Higher stability = lower variance
      }
      
      return newHistory;
    });

    // Detect quantum coherence events
    const isQuantumEvent = (
      quantumStrength > 0.85 &&
      phaseEntanglement > 0.75 &&
      drrState.goldenRatioAlignment > 0.8 &&
      fieldStability > 0.7
    );

    if (isQuantumEvent && !quantumEvent) {
      setQuantumEvent(true);
      onQuantumEvent?.(quantumStrength);
      setTimeout(() => setQuantumEvent(false), 3000);
    }

  }, [drrState, isActive, fieldStability, quantumEvent, onQuantumEvent]);

  const getFieldColor = () => {
    if (quantumEvent) return 'text-yellow-400';
    if (quantumField > 0.8) return 'text-purple-400';
    if (quantumField > 0.6) return 'text-blue-400';
    if (quantumField > 0.3) return 'text-green-400';
    return 'text-gray-400';
  };

  const getEntanglementColor = () => {
    if (entanglementLevel > 0.8) return 'text-pink-400';
    if (entanglementLevel > 0.6) return 'text-purple-400';
    if (entanglementLevel > 0.3) return 'text-blue-400';
    return 'text-gray-400';
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-24 right-6 z-30">
      <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <Atom className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm font-medium">Quantum Field</span>
        </div>

        {/* Quantum Field Visualization */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          {/* Outer ring - Field strength */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray={`${quantumField * 100}, 100`}
                className={`transition-all duration-500 ${quantumEvent ? 'animate-pulse' : ''}`}
                style={{ 
                  filter: quantumEvent ? 'drop-shadow(0 0 10px currentColor)' : 'none'
                }}
              />
            </svg>
          </div>

          {/* Inner ring - Entanglement */}
          <div className="absolute inset-3 rounded-full border border-white/10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(236, 72, 153, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray={`${entanglementLevel * 100}, 100`}
                className="transition-all duration-500"
              />
            </svg>
          </div>

          {/* Center atom */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Atom 
              className={`w-6 h-6 ${getFieldColor()} transition-all duration-500 ${quantumEvent ? 'animate-spin' : ''}`}
              style={{ 
                filter: quantumEvent ? 'drop-shadow(0 0 15px currentColor)' : 'none'
              }}
            />
          </div>

          {/* Quantum particles */}
          {quantumField > 0.5 && (
            <>
              <div 
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                style={{ 
                  top: '20%', 
                  left: '80%',
                  animationDelay: '0s',
                  animationDuration: '2s'
                }}
              />
              <div 
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                style={{ 
                  top: '70%', 
                  left: '30%',
                  animationDelay: '0.7s',
                  animationDuration: '2s'
                }}
              />
              <div 
                className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
                style={{ 
                  top: '40%', 
                  left: '10%',
                  animationDelay: '1.3s',
                  animationDuration: '2s'
                }}
              />
            </>
          )}
        </div>

        {/* Metrics */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-white/70 flex items-center space-x-1">
              <Waves className="w-3 h-3" />
              <span>Field:</span>
            </span>
            <span className={`font-mono ${getFieldColor()}`}>
              {Math.round(quantumField * 100)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70 flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Entangled:</span>
            </span>
            <span className={`font-mono ${getEntanglementColor()}`}>
              {Math.round(entanglementLevel * 100)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Stability:</span>
            <span className="font-mono text-green-400">
              {Math.round(fieldStability * 100)}%
            </span>
          </div>

          {quantumEvent && (
            <div className="mt-3 p-2 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-lg border border-yellow-400/30">
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-xs font-bold">QUANTUM EVENT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantumCoherenceDetector;
