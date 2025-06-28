
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Play, Pause, Mic, MicOff, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 sm:hidden">
      <div className="flex items-center justify-between">
        <Button
          onClick={onToggleSession}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 transition-all duration-200 ${
            isActive 
              ? 'bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30' 
              : 'bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Begin'}</span>
          {!isActive && <Sparkles className="w-3 h-3 animate-pulse" />}
        </Button>

        <Button
          onClick={onToggleMicrophone}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 border-white/20 transition-all duration-200 ${
            micEnabled 
              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 ring-2 ring-blue-500/20' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 relative"
            >
              <Menu className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-black/95 border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Choose Your Focus State</span>
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 py-4">
              {focusStates.map((state) => (
                <Button
                  key={state}
                  onClick={() => onFocusTransition(state)}
                  variant={focusState === state ? "default" : "outline"}
                  className={`justify-start p-4 h-auto flex-col items-start transition-all duration-200 ${
                    focusState === state
                      ? 'bg-blue-500 text-white ring-2 ring-blue-400/50'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{state}</span>
                  <span className="text-xs opacity-80 mt-1">{getFocusDescription(state)}</span>
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
