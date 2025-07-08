
import React, { useState, useEffect } from 'react';
import { DRREngineState, Focus15State } from '@/types/focus';
import { Compass, Navigation, Target, Zap } from 'lucide-react';

interface ConsciousnessCompassProps {
  drrState?: DRREngineState;
  focus15State?: Focus15State;
  isActive: boolean;
}

const ConsciousnessCompass: React.FC<ConsciousnessCompassProps> = ({
  drrState,
  focus15State,
  isActive
}) => {
  const [compassAngle, setCompassAngle] = useState(0);
  const [coherenceLevel, setCoherenceLevel] = useState(0);
  const [isQuantumAligned, setIsQuantumAligned] = useState(false);

  useEffect(() => {
    if (!isActive || !drrState) return;

    // Calculate consciousness direction based on multiple metrics
    const vibrationalWeight = drrState.vibrationalCoherence * 120;
    const phaseWeight = drrState.spectralPhaseStability * 90;
    const goldenWeight = drrState.goldenRatioAlignment * 150;
    
    const newAngle = (vibrationalWeight + phaseWeight + goldenWeight) % 360;
    setCompassAngle(newAngle);

    // Calculate overall coherence level
    const totalCoherence = (
      drrState.vibrationalCoherence + 
      drrState.spectralPhaseStability + 
      drrState.goldenRatioAlignment +
      drrState.breathRhythm
    ) / 4;
    
    setCoherenceLevel(totalCoherence);

    // Detect quantum alignment moments
    setIsQuantumAligned(
      drrState.goldenRatioAlignment > 0.8 && 
      drrState.vibrationalCoherence > 0.7 &&
      drrState.spectralPhaseStability > 0.75
    );
  }, [drrState, isActive]);

  const getCompassColor = () => {
    if (isQuantumAligned) return 'text-yellow-400';
    if (coherenceLevel > 0.7) return 'text-green-400';
    if (coherenceLevel > 0.4) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getDirectionLabel = () => {
    if (isQuantumAligned) return 'Quantum Aligned';
    if (compassAngle < 45 || compassAngle > 315) return 'Focus North';
    if (compassAngle < 135) return 'Creative East';
    if (compassAngle < 225) return 'Intuitive South';
    return 'Wisdom West';
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-24 left-6 z-30">
      <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <Compass className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm font-medium">Consciousness Compass</span>
        </div>
        
        {/* Main Compass */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="absolute inset-0  rounded-full border-2 border-white/20">
            {/* Cardinal directions */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-white/60">N</div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-white/60">E</div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-white/60">S</div>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs text-white/60">W</div>
          </div>
          
          {/* Compass Needle */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
            style={{ transform: `rotate(${compassAngle}deg)` }}
          >
            <Navigation 
              className={`w-6 h-6 ${getCompassColor()} transition-colors duration-500`}
              style={{ filter: isQuantumAligned ? 'drop-shadow(0 0 10px currentColor)' : 'none' }}
            />
          </div>

          {/* Coherence Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isQuantumAligned ? '#fbbf24' : '#3b82f6'}
                strokeWidth="2"
                strokeDasharray={`${coherenceLevel * 100}, 100`}
                className="transition-all duration-500"
                style={{ 
                  filter: isQuantumAligned ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Status Info */}
        <div className="text-center space-y-1">
          <div className={`text-xs font-medium ${getCompassColor()}`}>
            {getDirectionLabel()}
          </div>
          <div className="text-xs text-white/70">
            {Math.round(coherenceLevel * 100)}% aligned
          </div>
          
          {focus15State?.timeCollapseEvent && (
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Zap className="w-3 h-3 text-orange-400 animate-pulse" />
              <span className="text-xs text-orange-400">Time Collapse</span>
            </div>
          )}
          
          {isQuantumAligned && (
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Target className="w-3 h-3 text-yellow-400 animate-pulse" />
              <span className="text-xs text-yellow-400">Quantum Lock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessCompass;
