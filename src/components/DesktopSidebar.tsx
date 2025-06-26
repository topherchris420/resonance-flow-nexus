
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Mic, MicOff } from 'lucide-react';
import { FocusState, DRREngineState, CreativeFlowState, IntuitiveForesightState } from '@/types/focus';

interface DesktopSidebarProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  breathCoherence: number;
  drrState?: DRREngineState;
  creativeFlowState?: CreativeFlowState;
  intuitiveForesightState?: IntuitiveForesightState;
  onToggleSession: () => void;
  onToggleMicrophone: () => void;
  onFocusTransition: (state: FocusState) => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  focusState,
  isActive,
  micEnabled,
  breathCoherence,
  drrState,
  creativeFlowState,
  intuitiveForesightState,
  onToggleSession,
  onToggleMicrophone,
  onFocusTransition
}) => {
  const focusStates: FocusState[] = ['Focus 12', 'Focus 15', 'Focus 21'];

  return (
    <div className="hidden sm:flex fixed right-0 top-16 bottom-0 w-80 bg-black/80 backdrop-blur-sm border-l border-white/10 p-4 flex-col space-y-4 overflow-y-auto">
      {/* Main Controls */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onToggleSession}
            variant="outline"
            className="w-full flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Session' : 'Start Session'}</span>
          </Button>

          <Button
            onClick={onToggleMicrophone}
            variant="outline"
            className={`w-full flex items-center space-x-2 border-white/20 ${
              micEnabled 
                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>{micEnabled ? 'Mic On' : 'Mic Off'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Focus States */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Focus States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {focusStates.map((state) => (
            <Button
              key={state}
              onClick={() => onFocusTransition(state)}
              variant={focusState === state ? "default" : "outline"}
              className={`w-full justify-start ${
                focusState === state
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {state}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-white/80">
            <div className="flex justify-between">
              <span>Breath Coherence:</span>
              <span className="text-blue-300">{breathCoherence.toFixed(2)}</span>
            </div>
            {drrState && (
              <>
                <div className="flex justify-between">
                  <span>Vibrational:</span>
                  <span className="text-green-300">{drrState.vibrationalCoherence.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase Stability:</span>
                  <span className="text-purple-300">{drrState.spectralPhaseStability.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopSidebar;
