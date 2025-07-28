
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Mic, MicOff, Sparkles, Brain, Waves, Zap, Activity, Eye, Crosshair, AlertTriangle, Shield, ShieldOff, MemoryStick, ScanLine, Users } from 'lucide-react';
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
  onToggleStressInoculation: () => void;
  stressInoculationActive: boolean;
  onToggleTeamCoherence: () => void;
  teamCoherenceActive: boolean;
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
  onFocusTransition,
  onToggleStressInoculation,
  stressInoculationActive,
  onToggleTeamCoherence,
  teamCoherenceActive
}) => {
  const focusStates: FocusState[] = ['Focus 12', 'Focus 15', 'Focus 21', 'CRL-T', 'CRL-M', 'CRL-P'];

  const getFocusDescription = (state: FocusState) => {
    switch (state) {
      case 'Focus 12': return 'Relaxed awareness & light meditation';
      case 'Focus 15': return 'Deep states & time perception shifts';
      case 'Focus 21': return 'Advanced cognitive readiness training';
      case 'CRL-T': return 'Tactical focus for high-stress environments';
      case 'CRL-M': return 'Memory retention drills';
      case 'CRL-P': return 'Pattern recognition exercises';
      default: return '';
    }
  };

  const getFocusIcon = (state: FocusState) => {
    switch (state) {
      case 'Focus 12': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Focus 15': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'Focus 21': return <Sparkles className="w-5 h-5 text-yellow-400" />;
      case 'CRL-T': return <Crosshair className="w-5 h-5 text-red-400" />;
      case 'CRL-M': return <MemoryStick className="w-5 h-5 text-green-400" />;
      case 'CRL-P': return <ScanLine className="w-5 h-5 text-indigo-400" />;
      default: return <Waves className="w-5 h-5" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value > 0.7) return 'text-green-400';
    if (value > 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMetricDot = (value: number) => {
    const colorClass = value > 0.5 ? 'bg-green-400' : 'bg-gray-500';
    return <div className={`w-2 h-2 rounded-full ${colorClass} ${value > 0.5 ? 'animate-pulse' : ''}`}></div>;
  };

  return (
    <div className="hidden sm:flex fixed right-0 top-16 bottom-0 w-80 bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-lg border-l border-white/20 p-6 flex-col space-y-6 overflow-y-auto shadow-2xl">
      {/* Main Controls */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <span>Experience Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onToggleSession}
            variant="outline"
            className={`w-full flex items-center space-x-3 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-base py-6 ${
              isActive 
                ? 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400/50 text-red-300 hover:from-red-500/40 hover:to-pink-500/40' 
                : 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/50 text-green-300 hover:from-green-500/40 hover:to-emerald-500/40'
            }`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{isActive ? 'Pause Session' : 'Begin Experience'}</span>
            {!isActive && <Sparkles className="w-4 h-4 animate-pulse ml-auto" />}
          </Button>

          <Button
            onClick={onToggleMicrophone}
            variant="outline"
            className={`w-full flex items-center space-x-3 border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-base py-6 ${
              micEnabled 
                ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 hover:from-blue-500/40 hover:to-cyan-500/40 ring-2 ring-blue-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{micEnabled ? 'Microphone Active' : 'Enable Microphone'}</span>
            {micEnabled && <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse ml-auto"></div>}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span>Team Coherence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onToggleTeamCoherence}
            variant="outline"
            className={`w-full flex items-center space-x-3 border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-base py-6 ${
              teamCoherenceActive
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 hover:from-blue-500/40 hover:to-purple-500/40 ring-2 ring-blue-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              {teamCoherenceActive ? <Users className="w-5 h-5 text-red-400" /> : <Users className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{teamCoherenceActive ? 'Deactivate' : 'Activate'}</span>
            {teamCoherenceActive && <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse ml-auto"></div>}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <span>Stress Inoculation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onToggleStressInoculation}
            variant="outline"
            className={`w-full flex items-center space-x-3 border-white/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-base py-6 ${
              stressInoculationActive
                ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-300 hover:from-red-500/40 hover:to-orange-500/40 ring-2 ring-red-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              {stressInoculationActive ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{stressInoculationActive ? 'Deactivate' : 'Activate'}</span>
            {stressInoculationActive && <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse ml-auto"></div>}
          </Button>
        </CardContent>
      </Card>

      {/* Focus States */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <span>Focus States</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {focusStates.map((state) => (
            <Button
              key={state}
              onClick={() => onFocusTransition(state)}
              variant={focusState === state ? "default" : "outline"}
              className={`w-full justify-start p-4 h-auto flex items-center space-x-4 transition-all duration-300 transform hover:scale-[1.02] ${
                focusState === state
                  ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white ring-2 ring-blue-400/60 shadow-xl'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="p-2 bg-white/10 rounded-lg">
                {getFocusIcon(state)}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">{state}</div>
                <div className="text-sm opacity-90 mt-1">{getFocusDescription(state)}</div>
              </div>
              {focusState === state && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Metrics */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <span>Live Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-white/90 font-medium">Breath Coherence:</span>
              <div className="flex items-center space-x-2">
                {getMetricDot(breathCoherence)}
                <span className={`font-mono font-bold ${getMetricColor(breathCoherence)}`}>
                  {(breathCoherence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            {drrState && (
              <>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-white/90 font-medium">Vibrational:</span>
                  <div className="flex items-center space-x-2">
                    {getMetricDot(drrState.vibrationalCoherence)}
                    <span className={`font-mono font-bold ${getMetricColor(drrState.vibrationalCoherence)}`}>
                      {(drrState.vibrationalCoherence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-white/90 font-medium">Phase Stability:</span>
                  <div className="flex items-center space-x-2">
                    {getMetricDot(drrState.spectralPhaseStability)}
                    <span className={`font-mono font-bold ${getMetricColor(drrState.spectralPhaseStability)}`}>
                      {(drrState.spectralPhaseStability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {drrState.goldenRatioAlignment > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-400/20">
                    <span className="text-yellow-300 font-medium flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Golden Ratio:</span>
                    </span>
                    <span className="font-mono font-bold text-yellow-400">
                      {(drrState.goldenRatioAlignment * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </>
            )}

            {creativeFlowState?.enabled && (
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-400/20">
                <span className="text-orange-300 font-medium">Creative Flow:</span>
                <span className="font-mono font-bold text-orange-400">
                  {(creativeFlowState.dissonanceLevel * 100).toFixed(0)}%
                </span>
              </div>
            )}

            {intuitiveForesightState?.convergenceDetected && (
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                <span className="text-purple-300 font-medium">Intuitive Spiral:</span>
                <span className="font-mono font-bold text-purple-400">
                  {(intuitiveForesightState.spiralIntensity * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopSidebar;
