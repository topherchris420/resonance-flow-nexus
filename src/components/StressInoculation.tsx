import React, { useState, useEffect } from 'react';
import { DRREngineState } from '../types/focus';

interface StressInoculationProps {
  isActive: boolean;
  drrState?: DRREngineState;
}

const StressInoculation: React.FC<StressInoculationProps> = ({ isActive, drrState }) => {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (!isActive || !drrState) {
      setIntensity(0);
      return;
    }

    // Increase intensity based on biometric feedback
    const newIntensity = 1 - drrState.vibrationalCoherence;
    setIntensity(newIntensity);
  }, [isActive, drrState]);

  const conflictSounds = [
    'https://actions.google.com/sounds/v1/wars/distant_gunshots.ogg',
    'https://actions.google.com/sounds/v1/wars/distant_explosion.ogg',
  ];

  return (
    <div>
      {isActive && (
        <>
          {/* Visual cues */}
          <div
            className="absolute inset-0 bg-red-900 opacity-0"
            style={{ opacity: intensity * 0.2, transition: 'opacity 1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500 rounded-full opacity-0"
            style={{
              opacity: intensity * 0.5,
              transform: `scale(${1 + intensity})`,
              transition: 'all 1s',
            }}
          />

          {/* Audio cues */}
          {conflictSounds.map((sound, index) => (
            <audio
              key={index}
              src={sound}
              autoPlay
              loop
              volume={intensity * 0.5}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default StressInoculation;
