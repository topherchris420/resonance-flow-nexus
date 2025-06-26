import React, { useState } from 'react';
import { FocusState, DRREngineState, CreativeFlowState, IntuitiveForesightState, SessionLogEntry } from '../types/focus';
import { Mic, MicOff, Play, Pause, Settings, Download, Activity, Zap, Eye } from 'lucide-react';

interface FocusControlsProps {
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  sessionLog: SessionLogEntry[];
  breathCoherence: number;
  drrState?: DRREngineState;
  creativeFlowState?: CreativeFlowState;
  intuitiveForesightState?: IntuitiveForesightState;
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
  drrState,
  creativeFlowState,
  intuitiveForesightState,
  onToggleSession,
  onToggleMicrophone,
  onFocusTransition
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [modules, setModules] = useState({
    memoryStream: false,
    intuitiveForesight: intuitiveForesightState?.enabled || false,
    creativeFlow: creativeFlowState?.enabled || false
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

  const exportSessionData = () => {
    const csvContent = [
      ['Timestamp', 'State', 'Vibrational Coherence', 'Spectral Phase Stability', 'Breath Coherence', 
       'Golden Ratio Alignment', 'Harmonic Convergence', 'Node Count', 'Dominant Frequencies', 'Phase Data'],
      ...sessionLog.map(entry => [
        new Date(entry.timestamp).toISOString(),
        entry.stateLabel,
        entry.vibrationalCoherence?.toFixed(3) || '0',
        entry.spectralPhaseStability?.toFixed(3) || '0',
        entry.breathCoherence?.toFixed(3) || '0',
        entry.resonanceGeometry?.goldenRatioAlignment?.toFixed(3) || '0',
        entry.resonanceGeometry?.nodes?.some(n => n.harmonicIndex && n.harmonicIndex > 1) ? '1' : '0',
        entry.nodeFrequencies?.length || 0,
        entry.nodeFrequencies?.map(f => f.toFixed(1)).join(';') || '',
        entry.phase?.map(p => p.toFixed(3)).join(';') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drr_session_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportGeometrySnapshot = () => {
    if (!drrState || sessionLog.length === 0) return;
    
    const latestEntry = sessionLog[sessionLog.length - 1];
    const geometryData = {
      timestamp: Date.now(),
      focusState,
      drrMetrics: {
        vibrationalCoherence: drrState.vibrationalCoherence,
        spectralPhaseStability: drrState.spectralPhaseStability,
        goldenRatioAlignment: drrState.goldenRatioAlignment,
        harmonicConvergence: drrState.harmonicConvergence
      },
      resonanceGeometry: latestEntry.resonanceGeometry,
      creativeFlow: creativeFlowState,
      intuitiveForesight: intuitiveForesightState
    };

    const jsonContent = JSON.stringify(geometryData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resonance_geometry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Enhanced Top Status Bar with DRR Metrics */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-light text-white">
            Hello
            <span className="text-sm ml-2 text-gray-400">DRR Engine</span>
          </div>
          
          {drrState && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Activity size={16} className="text-blue-400" />
                <span className="text-blue-400">
                  {Math.round(drrState.vibrationalCoherence * 100)}%
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-yellow-400">
                  {Math.round(drrState.spectralPhaseStability * 100)}%
                </span>
              </div>
              
              {drrState.harmonicConvergence && (
                <div className="flex items-center space-x-1">
                  <Eye size={16} className="text-purple-400" />
                  <span className="text-purple-400">Convergence</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`text-lg font-mono ${getStateColor()}`}>
            Focus {getStateNumber()}
          </div>
          
          {breathCoherence > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">
                {Math.round(breathCoherence * 100)}% breath
              </span>
            </div>
          )}
          
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="text-xs px-2 py-1 bg-gray-800/50 rounded text-gray-300 hover:bg-gray-700/50"
          >
            Metrics
          </button>
        </div>
      </div>

      {/* DRR Metrics Panel */}
      {showMetrics && drrState && (
        <div className="absolute top-20 right-6 bg-black/80 backdrop-blur-lg rounded-lg p-4 w-72 border border-gray-700">
          <h3 className="text-sm font-semibold mb-3 text-white">DRR Engine Metrics</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Vibrational Coherence:</span>
              <span className="text-blue-400">{(drrState.vibrationalCoherence * 100).toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Phase Stability:</span>
              <span className="text-yellow-400">{(drrState.spectralPhaseStability * 100).toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Golden Ratio Alignment:</span>
              <span className="text-purple-400">{(drrState.goldenRatioAlignment * 100).toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Breath Rhythm:</span>
              <span className="text-green-400">{(drrState.breathRhythm * 100).toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Dominant Frequencies:</span>
              <span className="text-white">{drrState.dominantFrequencies.length}</span>
            </div>
            
            {creativeFlowState?.enabled && (
              <div className="flex justify-between">
                <span className="text-gray-400">Creative Dissonance:</span>
                <span className="text-orange-400">{(creativeFlowState.dissonanceLevel * 100).toFixed(1)}%</span>
              </div>
            )}
            
            {intuitiveForesightState?.convergenceDetected && (
              <div className="flex justify-between">
                <span className="text-gray-400">Spiral Intensity:</span>
                <span className="text-gold-400">{(intuitiveForesightState.spiralIntensity * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Bottom Control Dock */}
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
            onClick={exportSessionData}
            disabled={sessionLog.length === 0}
            className="p-3 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 transition-all duration-200 disabled:opacity-50"
            title="Export CSV Data"
          >
            <Download size={20} />
          </button>
          
          <button
            onClick={exportGeometrySnapshot}
            disabled={!drrState || sessionLog.length === 0}
            className="p-3 rounded-full bg-purple-700/50 text-purple-400 hover:bg-purple-600/50 transition-all duration-200 disabled:opacity-50"
            title="Export Geometry Snapshot"
          >
            <Eye size={20} />
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
