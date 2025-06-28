
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Mic, MicOff, Sparkles, Brain, Waves } from 'lucide-react';
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

  const getFocusDescription = (state: FocusState) => {
    switch (state) {
      case 'Focus 12': return 'Relaxed awareness & light meditation';
      case 'Focus 15': return 'Deep states & time perception shifts';
      case 'Focus 21': return 'Advanced consciousness exploration';
      default: return '';
    }
  };

  const getFocusIcon = (state: FocusState) => {
    switch (state) {
      case 'Focus 12': return <Waves className="w-4 h-4 text-blue-400" />;
      case 'Focus 15': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'Focus 21': return <Sparkles className="w-4 h-4 text-yellow-400" />;
      default: return <Waves className="w-4 h-4" />;
    }
  };

  return (
    <div className="hidden sm:flex fixed right-0 top-16 bottom-0 w-80 bg-black/80 backdrop-blur-sm border-l border-white/10 p-4 flex-col space-y-4 overflow-y-auto">
      {/* Main Controls */}
      <Card className="bg-white/5 border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Experience Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onToggleSession}
            variant="outline"
            className={`w-full flex items-center space-x-2 transition-all duration-200 ${
              isActive 
                ? 'bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30' 
                : 'bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Session' : 'Begin Experience'}</span>
            {!isActive && <Sparkles className="w-3 h-3 animate-pulse" />}
          </Button>

          <Button
            onClick={onToggleMicrophone}
            variant="outline"
            className={`w-full flex items-center space-x-2 border-white/20 transition-all duration-200 ${
              micEnabled 
                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 ring-2 ring-blue-500/20' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>{micEnabled ? 'Mic Active' : 'Enable Microphone'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Focus States */}
      <Card className="bg-white/5 border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Focus States</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {focusStates.map((state) => (
            <Button
              key={state}
              onClick={() => onFocusTransition(state)}
              variant={focusState === state ? "default" : "outline"}
              className={`w-full justify-start p-3 h-auto flex-col items-start transition-all duration-200 ${
                focusState === state
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400/50'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2 w-full">
                {getFocusIcon(state)}
                <span className="font-medium">{state}</span>
                {focusState === state && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </div>
              <span className="text-xs opacity-80 mt-1 text-left">{getFocusDescription(state)}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card className="bg-white/5 border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Waves className="w-5 h-5 text-green-400" />
            <span>Live Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-white/80">
            <div className="flex justify-between items-center">
              <span>Breath Coherence:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${breathCoherence > 0.5 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-blue-300 font-mono">{breathCoherence.toFixed(2)}</span>
              </div>
            </div>
            {drrState && (
              <>
                <div className="flex justify-between items-center">
                  <span>Vibrational:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${drrState.vibrationalCoherence > 0.5 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-green-300 font-mono">{drrState.vibrationalCoherence.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phase Stability:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${drrState.spectralPhaseStability > 0.5 ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-purple-300 font-mono">{drrState.spectralPhaseStability.toFixed(2)}</span>
                  </div>
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
