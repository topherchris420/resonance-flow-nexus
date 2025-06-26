
import React, { useState } from 'react';
import { FocusState } from '../types/focus';
import { Mic, MicOff, Play, Pause, Settings, Download } from 'lucide-react';

interface FocusControlsProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  sessionLog: any[];
  breathCoherence: number;
  onToggleSession: () => void;
  onToggleMicrophone: () => void;
  onFocusTransition: (state: FocusState) => void;
}

const FocusControls: React.FC<FocusControlsProps> = ({
  focusState,
  isActive,
  micEnabled,
  sessionLog,
  breathCoherence,
  onToggleSession,
  onToggleMicrophone,
  onFocusTransition
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [modules, setModules] = useState({
    memoryStream: false,
    intuitiveForesight: false,
    creativeFlow: false
  });

  const getStateColor = () => {
    switch (focusState) {
      case 'Focus 12': return 'text-blue-400';
      case 'Focus 15': return 'text-orange-400';
      case 'Focus 21': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getStateNumber = () => {
    switch (focusState) {
      case 'Focus 12': return '12';
      case 'Focus 15': return '15';
      case 'Focus 21': return '21';
      default: return '12';
    }
  };

  const exportSessionLog = () => {
    const csvContent = [
      ['Timestamp', 'State', 'Breath Coherence', 'Node Count'],
      ...sessionLog.map(entry => [
        new Date(entry.timestamp).toISOString(),
        entry.state,
        entry.breathCoherence || 0,
        entry.resonanceNodes?.length || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hello_session_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Top Status Bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-light text-white">
            Hello
            <span className="text-sm ml-2 text-gray-400">by Vers3Dynamics</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`text-lg font-mono ${getStateColor()}`}>
            Focus {getStateNumber()}
          </div>
          
          {breathCoherence > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">
                {Math.round(breathCoherence * 100)}% coherence
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Dock */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-lg rounded-full px-6 py-3 flex items-center space-x-6 border border-gray-700">
          {/* Microphone Toggle */}
          <button
            onClick={onToggleMicrophone}
            className={`p-3 rounded-full transition-all duration-200 ${
              micEnabled 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Main Play/Pause */}
          <button
            onClick={onToggleSession}
            className={`p-4 rounded-full transition-all duration-200 ${
              isActive 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 transition-all duration-200"
          >
            <Settings size={20} />
          </button>

          {/* Export/Download */}
          <button
            onClick={exportSessionLog}
            disabled={sessionLog.length === 0}
            className="p-3 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 transition-all duration-200 disabled:opacity-50"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Focus State Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {['Focus 12', 'Focus 15', 'Focus 21'].map((state) => (
            <button
              key={state}
              onClick={() => onFocusTransition(state as FocusState)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                focusState === state
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-black/30 text-gray-400 border border-gray-600 hover:bg-gray-800/50'
              }`}
            >
              {state.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 bg-black/80 backdrop-blur-lg rounded-lg p-6 w-80 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Focus Modules</h3>
          
          <div className="space-y-4">
            {Object.entries(modules).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => setModules(prev => ({ ...prev, [key]: !enabled }))}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    enabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Session Time: {isActive ? '00:00' : 'Not Started'}
            </div>
            <div className="text-sm text-gray-400">
              Log Entries: {sessionLog.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FocusControls;
