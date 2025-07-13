import React from 'react';
import { FocusState, DRREngineState } from '../types/focus';

interface SacredGeometryOverlayProps {
  focusState: FocusState;
  isActive: boolean;
  drrState?: DRREngineState;
}

const SacredGeometryOverlay: React.FC<SacredGeometryOverlayProps> = ({
  focusState,
  isActive,
  drrState
}) => {
  if (!isActive || !drrState) return null;

  const getGeometryPattern = () => {
    switch (focusState) {
      case 'Focus 12':
        return (
          <div className="fixed inset-0 pointer-events-none z-5">
            <svg className="w-full h-full opacity-10 animate-sacred-rotation">
              <defs>
                <pattern id="focus12" patternUnits="userSpaceOnUse" width="100" height="100">
                  <circle cx="50" cy="50" r="30" fill="none" stroke="hsl(var(--focus-12))" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="hsl(var(--focus-12))" strokeWidth="1" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="hsl(var(--focus-12))" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#focus12)" />
            </svg>
          </div>
        );
      
      case 'Focus 15':
        return (
          <div className="fixed inset-0 pointer-events-none z-5">
            <svg className="w-full h-full opacity-15 animate-mandala-expand">
              <defs>
                <pattern id="focus15" patternUnits="userSpaceOnUse" width="150" height="150">
                  <polygon points="75,25 100,65 125,75 100,85 75,125 50,85 25,75 50,65" 
                           fill="none" stroke="hsl(var(--focus-15))" strokeWidth="2" />
                  <circle cx="75" cy="75" r="40" fill="none" stroke="hsl(var(--focus-15))" strokeWidth="1" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#focus15)" />
            </svg>
          </div>
        );
      
      case 'Focus 21':
        return (
          <div className="fixed inset-0 pointer-events-none z-5">
            <svg className="w-full h-full opacity-20">
              <defs>
                <pattern id="focus21" patternUnits="userSpaceOnUse" width="200" height="200">
                  <path d="M100,20 L180,100 L100,180 L20,100 Z" 
                        fill="none" stroke="hsl(var(--focus-21))" strokeWidth="3" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--focus-21))" strokeWidth="2" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(var(--focus-21))" strokeWidth="1" />
                  <circle cx="100" cy="100" r="20" fill="none" stroke="hsl(var(--focus-21))" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#focus21)" 
                    className="animate-quantum-shimmer" />
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {getGeometryPattern()}
      
      {/* Golden Ratio Spiral for high coherence */}
      {drrState.vibrationalCoherence > 0.7 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        pointer-events-none z-5 opacity-30">
          <svg width="400" height="400" className="animate-sacred-rotation">
            <path d="M200,200 Q300,200 300,100 Q300,0 200,0 Q100,0 100,100 Q100,200 200,200"
                  fill="none" stroke="hsl(var(--golden-ratio))" strokeWidth="3" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(var(--golden-ratio))" 
                    strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      )}
    </>
  );
};

export default SacredGeometryOverlay;