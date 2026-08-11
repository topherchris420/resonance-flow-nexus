import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PROJECT SENTINEL — COGNITIVE READINESS & RESONANCE SESSION
 * Webflow-grade kinetic motion, audio-reactive Cymatic canvas, binaural synth & bio-telemetry
 */
export const Session = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [focusState, setFocusState] = useState<'focus10' | 'focus12' | 'focus15' | 'focus21'>('focus10');
  const [carrierFreq, setCarrierFreq] = useState(216);
  const [binauralOffset, setBinauralOffset] = useState(7.83);
  const [noiseType, setNoiseType] = useState<'off' | 'pink' | 'brown'>('off');
  const [micEnabled, setMicEnabled] = useState(false);
  const [stressActive, setStressActive] = useState(false);
  const [teamActive, setTeamActive] = useState(false);
  const [breathPattern, setBreathPattern] = useState<'box' | 'relax' | 'coherence'>('coherence');
  
  // Telemetry metrics state
  const [coherenceIndex, setCoherenceIndex] = useState(0.942);
  const [phaseStability, setPhaseStability] = useState('98.4');
  const [phiAlignment, setPhiAlignment] = useState('1.618');
  const [heartRate, setHeartRate] = useState(68);
  const [events, setEvents] = useState<Array<{ timestamp: string; message: string }>>([
    { timestamp: '[00:00]', message: 'Session initialized. Ready for Carrier Sync.' }
  ]);
  const [showAAR, setShowAAR] = useState(false);
  const [breathCue, setBreathCue] = useState('INHALE');

  // Web Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioCtx();
    masterGainRef.current = audioCtxRef.current.createGain();
    masterGainRef.current.gain.setValueAtTime(0.4, audioCtxRef.current.currentTime);
    masterGainRef.current.connect(audioCtxRef.current.destination);
  };

  const toggleSession = async () => {
    initAudio();
    if (!audioCtxRef.current) return;

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (!isSessionActive) {
      const leftFreq = carrierFreq - (binauralOffset / 2);
      const rightFreq = carrierFreq + (binauralOffset / 2);

      const oscL = audioCtxRef.current.createOscillator();
      const oscR = audioCtxRef.current.createOscillator();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(leftFreq, audioCtxRef.current.currentTime);
      oscR.frequency.setValueAtTime(rightFreq, audioCtxRef.current.currentTime);

      const pannerL = audioCtxRef.current.createStereoPanner ? audioCtxRef.current.createStereoPanner() : null;
      const pannerR = audioCtxRef.current.createStereoPanner ? audioCtxRef.current.createStereoPanner() : null;

      if (pannerL && pannerR) {
        pannerL.pan.setValueAtTime(-1, audioCtxRef.current.currentTime);
        pannerR.pan.setValueAtTime(1, audioCtxRef.current.currentTime);
        oscL.connect(pannerL);
        pannerL.connect(masterGainRef.current!);
        oscR.connect(pannerR);
        pannerR.connect(masterGainRef.current!);
      } else {
        oscL.connect(masterGainRef.current!);
        oscR.connect(masterGainRef.current!);
      }

      oscL.start();
      oscR.start();
      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;

      setIsSessionActive(true);
      logEvent('Carrier sync engaged. Binaural alignment locked.');
    } else {
      if (oscLeftRef.current) { oscLeftRef.current.stop(); oscLeftRef.current.disconnect(); }
      if (oscRightRef.current) { oscRightRef.current.stop(); oscRightRef.current.disconnect(); }
      setIsSessionActive(false);
      logEvent('Session paused.');
    }
  };

  const logEvent = (msg: string) => {
    const mins = '00';
    const secs = String(Math.floor(Math.random() * 50)).padStart(2, '0');
    setEvents(prev => [{ timestamp: `[${mins}:${secs}]`, message: msg }, ...prev.slice(0, 20)]);
  };

  // Canvas Cymatic Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(w, h) * 0.38;

      ctx.fillStyle = 'rgba(7, 9, 14, 0.25)';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);

      rotation += 0.005;
      ctx.rotate(rotation);

      // Cymatic Golden Ratio Ring Layers
      const layers = 6;
      for (let l = 1; l <= layers; l++) {
        const radius = (maxRadius / layers) * l;
        const points = 8 + l * 4;

        ctx.strokeStyle = l % 2 === 0 ? '#00f3ff' : '#6366f1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let i = 0; i <= points; i++) {
          const angle = (Math.PI * 2 / points) * i;
          const r = radius + Math.sin(rotation * 2 + i) * 6;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [focusState]);

  // Breath Pacer Loop
  useEffect(() => {
    const phases = breathPattern === 'box' 
      ? ['INHALE', 'HOLD', 'EXHALE', 'HOLD']
      : breathPattern === 'relax'
      ? ['INHALE', 'HOLD', 'EXHALE']
      : ['INHALE', 'EXHALE'];

    let idx = 0;
    const interval = setInterval(() => {
      setBreathCue(phases[idx % phases.length]);
      idx++;
    }, 4000);

    return () => clearInterval(interval);
  }, [breathPattern]);

  return (
    <div className="relative w-full h-screen bg-[#07090e] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Background Cymatic Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />

      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-white uppercase group-hover:text-cyan-400 transition-colors">PROJECT SENTINEL</span>
              <span className="block text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">Cognitive Readiness Session</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isSessionActive ? 'RESONANCE SYNCED' : 'SYSTEM STANDBY'}</span>
          </div>
        </div>

        {/* Focus State Tabs */}
        <div className="hidden lg:flex items-center bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-lg font-mono text-xs gap-1">
          {(['focus10', 'focus12', 'focus15', 'focus21'] as const).map(st => (
            <button
              key={st}
              onClick={() => { setFocusState(st); logEvent(`Shifted to ${st.toUpperCase()}`); }}
              className={`px-3 py-1.5 rounded-full transition-all ${focusState === st ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAAR(true)}
            className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs hover:bg-cyan-500/20 transition-all flex items-center gap-2"
          >
            AAR Analytics
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="relative z-10 w-full h-screen pt-20 pb-24 px-6 flex items-center justify-between gap-6 pointer-events-none">
        
        {/* Left Telemetry Panel */}
        <aside className="w-80 max-h-full flex flex-col gap-4 pointer-events-auto overflow-y-auto">
          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Dynamic Resonance</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">OPTIMAL</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-white tracking-tight">{coherenceIndex.toFixed(3)}</span>
              <span className="text-xs font-mono text-cyan-400">Coherence Index</span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-4 border border-white/10">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400" style={{ width: `${coherenceIndex * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Phase Stability</span>
                <span className="font-bold text-slate-100">{phaseStability}%</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Golden Ratio</span>
                <span className="font-bold text-emerald-400">{phiAlignment} φ</span>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[200px]">
            <h2 className="text-xs font-semibold tracking-wider text-purple-400 uppercase mb-3">Coherence Event Log</h2>
            <div className="flex-1 space-y-2 overflow-y-auto font-mono text-[11px] text-slate-300 pr-1">
              {events.map((ev, i) => (
                <div key={i} className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <span className="opacity-60">{ev.timestamp}</span> {ev.message}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Breath Pacer Overlay */}
        <div className="flex-1 h-full flex flex-col items-center justify-center relative pointer-events-none">
          <div className="relative flex items-center justify-center pointer-events-auto">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm animate-pulse" />
            <div className="relative z-20 w-48 h-48 md:w-64 md:h-64 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 shadow-2xl shadow-cyan-500/10">
              <span className="font-bold text-xs tracking-widest text-cyan-400 uppercase mb-1">BREATH PACER</span>
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight my-1">{breathCue}</span>
              <span className="text-xs text-slate-400 mt-2">Coherence Sync (5.5s)</span>
            </div>
          </div>
        </div>

        {/* Right Audio Synthesizer Controls */}
        <aside className="w-80 max-h-full flex flex-col gap-4 pointer-events-auto overflow-y-auto">
          <div className="bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Binaural Synthesizer</h2>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Carrier Freq</span>
                <span className="text-cyan-400 font-bold">{carrierFreq} Hz</span>
              </div>
              <input 
                type="range" min="60" max="528" value={carrierFreq} 
                onChange={e => setCarrierFreq(Number(e.target.value))}
                className="w-full accent-cyan-400" 
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Binaural Offset</span>
                <span className="text-indigo-400 font-bold">{binauralOffset} Hz</span>
              </div>
              <input 
                type="range" min="0.5" max="40" step="0.1" value={binauralOffset} 
                onChange={e => setBinauralOffset(Number(e.target.value))}
                className="w-full accent-indigo-400" 
              />
            </div>
          </div>
        </aside>

      </main>

      {/* Bottom Floating Control Dock */}
      <footer className="fixed bottom-6 inset-x-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="px-6 py-3 rounded-full bg-black/80 border border-white/15 backdrop-blur-2xl shadow-2xl pointer-events-auto flex items-center gap-6">
          <button 
            onClick={toggleSession}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-3"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>{isSessionActive ? 'PAUSE SESSION' : 'BEGIN SESSION'}</span>
          </button>
        </div>
      </footer>

      {/* AAR Modal */}
      {showAAR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="bg-black/90 p-8 rounded-2xl border border-white/20 max-w-2xl w-full mx-4 shadow-2xl relative">
            <button onClick={() => setShowAAR(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">✕</button>
            <h2 className="font-bold text-xl text-white uppercase tracking-wider mb-4">After-Action Report (AAR)</h2>
            <p className="text-sm text-slate-300 mb-6">Session Duration: 08:42 | Avg Coherence: 92.6% | Peak: 98.4%</p>
            <button onClick={() => setShowAAR(false)} className="px-6 py-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/40">Close Report</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Session;
