
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Play, Pause, Mic, MicOff, Sparkles, Zap, Waves } from 'lucide-react';
import { FocusState } from '@/types/focus';

interface MobileControlsProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  onToggleSession: () => void;
  onToggleMicrophone: () => void;
  onFocusTransition: (state: FocusState) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  focusState,
  isActive,
  micEnabled,
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
      case 'Focus 12': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Focus 15': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'Focus 21': return <Sparkles className="w-5 h-5 text-yellow-400" />;
      default: return <Waves className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/95 to-black/85 backdrop-blur-lg border-t border-white/20 p-4 sm:hidden shadow-2xl">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <Button
          onClick={onToggleSession}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${
            isActive 
              ? 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400/50 text-red-300 hover:from-red-500/40 hover:to-pink-500/40' 
              : 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/50 text-green-300 hover:from-green-500/40 hover:to-emerald-500/40'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="font-medium">{isActive ? 'Pause' : 'Begin'}</span>
          {!isActive && <Sparkles className="w-3 h-3 animate-pulse" />}
        </Button>

        <Button
          onClick={onToggleMicrophone}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 border-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg ${
            micEnabled 
              ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 hover:from-blue-500/40 hover:to-cyan-500/40 ring-2 ring-blue-500/30' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span className="text-xs">{micEnabled ? 'Active' : 'Enable'}</span>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 relative transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Menu className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-gradient-to-t from-black/98 to-gray-900/95 border-white/20 backdrop-blur-lg">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-white flex items-center space-x-3 text-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span>Choose Your Focus State</span>
                </div>
              </SheetTitle>
              <p className="text-white/70 text-sm">Each state offers unique consciousness exploration experiences</p>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {focusStates.map((state) => (
                <Button
                  key={state}
                  onClick={() => onFocusTransition(state)}
                  variant={focusState === state ? "default" : "outline"}
                  className={`justify-start p-6 h-auto flex items-start space-x-4 transition-all duration-300 transform hover:scale-[1.02] ${
                    focusState === state
                      ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white ring-2 ring-blue-400/60 shadow-xl'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getFocusIcon(state)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base mb-1">{state}</div>
                    <div className="text-sm opacity-90">{getFocusDescription(state)}</div>
                  </div>
                  {focusState === state && (
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileControls;
