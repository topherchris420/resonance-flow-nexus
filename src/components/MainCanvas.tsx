
import React from 'react';
import CymaticCanvas from './CymaticCanvas';
import TacticalDisplay from './TacticalDisplay';
import AudioEngine from './AudioEngine';
import DRREngine from './DRREngine';
import CognitiveTest from './CognitiveTest';
import { FocusState, DRRNode, DRREngineState, AudioConfig, CreativeFlowState, IntuitiveForesightState, Focus15State } from '../types/focus';

interface MainCanvasProps {
  resonanceNodes: DRRNode[];
  focusState: FocusState;
  isActive: boolean;
  micEnabled: boolean;
  breathCoherence: number;
  drrState?: DRREngineState;
  audioConfig?: AudioConfig;
  creativeFlowState?: CreativeFlowState;
  intuitiveForesightState?: IntuitiveForesightState;
  focus15State?: Focus15State;
  audioEngineRef: React.RefObject<any>;
  onDRRStateUpdate: (state: DRREngineState) => void;
  onResonanceUpdate: (nodes: DRRNode[]) => void;
  onAudioConfigUpdate: (config: AudioConfig) => void;
  onCreativeFlowUpdate: (state: CreativeFlowState) => void;
  onIntuitiveForesightUpdate: (state: IntuitiveForesightState) => void;
  onFocus15StateUpdate: (state: Focus15State) => void;
  onFocusTransition: (state: FocusState) => void;
  onBreathCoherenceUpdate: (coherence: number) => void;
  onTestComplete: (score: number) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = ({
  resonanceNodes,
  focusState,
  isActive,
  micEnabled,
  breathCoherence,
  drrState,
  audioConfig,
  creativeFlowState,
  intuitiveForesightState,
  focus15State,
  audioEngineRef,
  onDRRStateUpdate,
  onResonanceUpdate,
  onAudioConfigUpdate,
  onCreativeFlowUpdate,
  onIntuitiveForesightUpdate,
  onFocus15StateUpdate,
  onFocusTransition,
  onBreathCoherenceUpdate,
  onTestComplete
}) => {
  return (
    <div className="pt-16 pb-20 sm:pb-0 sm:pr-80 flex-1 relative">
      {/* Enhanced Cymatic Canvas with Focus 15 visualization */}
      {focusState === 'CRL-T' ? (
        <TacticalDisplay isActive={isActive} />
      ) : (
        <CymaticCanvas
          resonanceNodes={resonanceNodes}
          focusState={focusState}
          isActive={isActive}
          breathCoherence={breathCoherence}
          drrState={drrState}
          intuitiveForesightState={intuitiveForesightState}
          focus15State={focus15State}
        />
      )}
      
      {(focusState === 'CRL-M' || focusState === 'CRL-P') && (
        <CognitiveTest
          isActive={isActive}
          focusState={focusState}
          onTestComplete={onTestComplete}
        />
      )}

      {/* Enhanced DRR Engine with Focus 15 detection */}
      <DRREngine
        isActive={isActive}
        micEnabled={micEnabled}
        audioStream={audioStream}
        onDRRStateUpdate={onDRRStateUpdate}
        onResonanceUpdate={onResonanceUpdate}
        onAudioConfigUpdate={onAudioConfigUpdate}
        onCreativeFlowUpdate={onCreativeFlowUpdate}
        onIntuitiveForesightUpdate={onIntuitiveForesightUpdate}
        onFocus15StateUpdate={onFocus15StateUpdate}
      />
      
      {/* Enhanced Audio Engine with Focus 15 infrasonic layers */}
      <AudioEngine
        ref={audioEngineRef}
        focusState={focusState}
        isActive={isActive}
        micEnabled={micEnabled}
        audioStream={audioStream}
        drrState={drrState}
        audioConfig={audioConfig}
        creativeFlowState={creativeFlowState}
        focus15State={focus15State}
        onResonanceUpdate={onResonanceUpdate}
        onFocusTransition={onFocusTransition}
        onBreathCoherenceUpdate={onBreathCoherenceUpdate}
      />
    </div>
  );
};

export default MainCanvas;
