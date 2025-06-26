
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Play, Pause, Mic, MicOff } from 'lucide-react';
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 sm:hidden">
      <div className="flex items-center justify-between">
        <Button
          onClick={onToggleSession}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </Button>

        <Button
          onClick={onToggleMicrophone}
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 border-white/20 ${
            micEnabled 
              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
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
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-black/95 border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white">Focus States</SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 py-4">
              {focusStates.map((state) => (
                <Button
                  key={state}
                  onClick={() => onFocusTransition(state)}
                  variant={focusState === state ? "default" : "outline"}
                  className={`justify-start ${
                    focusState === state
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {state}
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
