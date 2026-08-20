import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Sliders, 
  Wind, 
  Activity, 
  Eye, 
  FileText, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  Headphones, 
  CheckCircle2, 
  ChevronRight,
  BarChart3,
  X,
  Flame,
  Download,
  Share2
} from 'lucide-react';

type FocusPreset = {
  id: string;
  name: string;
  category: string;
  carrier: number;
  offset: number;
  waveType: 'sine' | 'triangle';
  description: string;
  color: string;
};

const PRESETS: FocusPreset[] = [
  {
    id: 'schumann',
    name: 'Schumann Resonance',
    category: 'Earth Grounding',
    carrier: 136.1, // Earth OM frequency
    offset: 7.83,   // Fundamental Schumann frequency
    waveType: 'sine',
    description: 'Grounding 7.83 Hz theta-alpha bridge aligned with Earth ionospheric resonance.',
    color: '#38bdf8'
  },
  {
    id: 'alpha-flow',
    name: 'Alpha Flow 432Hz',
    category: 'Creativity & Focus',
    carrier: 432,
    offset: 10.0,
    waveType: 'sine',
    description: 'Solfeggio 432 Hz carrier with 10 Hz alpha wave for relaxed concentration.',
    color: '#06b6d4'
  },
  {
    id: 'solfeggio-528',
    name: 'Solfeggio 528Hz Clarity',
    category: 'Transformation',
    carrier: 528,
    offset: 12.0,
    waveType: 'sine',
    description: '528 Hz miracle tone with 12 Hz focus entrainment for cognitive rejuvenation.',
    color: '#10b981'
  },
  {
    id: 'lucid-theta',
    name: 'Deep Theta 6Hz',
    category: 'Meditation & Insight',
    carrier: 216,
    offset: 6.0,
    waveType: 'sine',
    description: '6 Hz theta wave for deep hypnagogic meditation and memory consolidation.',
    color: '#818cf8'
  },
  {
    id: 'deep-delta',
    name: 'Delta Restore 2Hz',
    category: 'Deep Recovery',
    carrier: 108,
    offset: 2.0,
    waveType: 'sine',
    description: '2 Hz delta pulse for somatic recovery, nervous system decompression, and calm.',
    color: '#a855f7'
  },
  {
    id: 'gamma-sharpness',
    name: 'Gamma Sync 40Hz',
    category: 'Peak Synthesis',
    carrier: 256,
    offset: 40.0,
    waveType: 'triangle',
    description: '40 Hz gamma binding frequency for high-order cognitive integration and binding.',
    color: '#ec4899'
  }
];

type BreathPattern = {
  id: string;
  name: string;
  phases: Array<{ label: string; duration: number }>;
};

const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: 'coherence',
    name: 'Coherence Flow (5.5s)',
    phases: [
      { label: 'INHALE', duration: 5.5 },
      { label: 'EXHALE', duration: 5.5 }
    ]
  },
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    phases: [
      { label: 'INHALE', duration: 4 },
      { label: 'HOLD', duration: 4 },
      { label: 'EXHALE', duration: 4 },
      { label: 'HOLD', duration: 4 }
    ]
  },
  {
    id: 'relax',
    name: 'Deep Parasympathetic (4-7-8)',
    phases: [
      { label: 'INHALE', duration: 4 },
      { label: 'HOLD', duration: 7 },
      { label: 'EXHALE', duration: 8 }
    ]
  },
  {
    id: 'energize',
    name: 'Prana Recharge (4-2-4-2)',
    phases: [
      { label: 'INHALE', duration: 4 },
      { label: 'HOLD', duration: 2 },
      { label: 'EXHALE', duration: 4 },
      { label: 'HOLD', duration: 2 }
    ]
  }
];

type VisualMode = 'chladni' | 'lissajous' | 'phi-vortex' | 'particles';
type MobileTab = 'none' | 'synth' | 'breath' | 'telemetry' | 'visuals' | 'log';

export const Session: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [carrierFreq, setCarrierFreq] = useState(136.1);
  const [binauralOffset, setBinauralOffset] = useState(7.83);
  const [activePreset, setActivePreset] = useState<string>('schumann');
  const [masterVolume, setMasterVolume] = useState(0.45);
  const [noiseType, setNoiseType] = useState<'off' | 'pink' | 'brown'>('pink');
  const [noiseVolume, setNoiseVolume] = useState(0.15);
  const [isochronicPulse, setIsochronicPulse] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioChimeEnabled, setAudioChimeEnabled] = useState(true);

  // Visualizer mode
  const [visualMode, setVisualMode] = useState<VisualMode>('chladni');
  const [interactiveMod, setInteractiveMod] = useState({ x: 0, y: 0 });

  // Breath pacer state
  const [breathPatternId, setBreathPatternId] = useState<string>('coherence');
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 1

  // Telemetry metrics
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [coherenceIndex, setCoherenceIndex] = useState(0.942);
  const [phaseStability, setPhaseStability] = useState(98.4);
  const [phiAlignment, setPhiAlignment] = useState(1.618);
  const [events, setEvents] = useState<Array<{ timestamp: string; message: string; type: 'info' | 'sync' | 'alert' }>>([
    { timestamp: '00:00', message: 'Project Sentinel Workstation initialized.', type: 'info' }
  ]);

  // Mobile Drawer Tab selection
  const [mobileTab, setMobileTab] = useState<MobileTab>('none');
  const [showAAR, setShowAAR] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Web Audio Context & Nodes Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainMasterRef = useRef<GainNode | null>(null);
  const gainLeftRef = useRef<GainNode | null>(null);
  const gainRightRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const isochronicLfoRef = useRef<OscillatorNode | null>(null);
  const isochronicGainRef = useRef<GainNode | null>(null);

  // Log event helper
  const logEvent = useCallback((message: string, type: 'info' | 'sync' | 'alert' = 'info') => {
    const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
    const secs = String(sessionSeconds % 60).padStart(2, '0');
    const timestamp = `${mins}:${secs}`;
    setEvents(prev => [{ timestamp, message, type }, ...prev.slice(0, 40)]);
  }, [sessionSeconds]);

  // -------------------------------------------------------------
  // Web Audio Engine: Precision Synthesis with Soft Ramping
  // -------------------------------------------------------------
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(audioMuted ? 0 : masterVolume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainMasterRef.current = masterGain;
  };

  // Generate Pink and Brown Noise buffers
  const createNoiseBuffer = (type: 'pink' | 'brown') => {
    if (!audioCtxRef.current) return null;
    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 4; // 4 second loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // Brown Noise (integrated white noise)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Scale for audibility
      }
    }
    return buffer;
  };

  // Play subtle bell chime on breath transition
  const playChimeTone = useCallback(() => {
    if (!audioChimeEnabled || !audioCtxRef.current || audioMuted || !isSessionActive) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 chime
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.04 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(gainMasterRef.current || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore audio context errors if suspended
    }
  }, [audioChimeEnabled, audioMuted, isSessionActive, masterVolume]);

  // Start Binaural & Ambient Engine
  const startAudioSynthesis = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || !gainMasterRef.current) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const leftFreq = Math.max(20, carrierFreq - (binauralOffset / 2));
    const rightFreq = Math.max(20, carrierFreq + (binauralOffset / 2));

    // Left Channel
    const oscL = ctx.createOscillator();
    const gainL = ctx.createGain();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(leftFreq, now);
    gainL.gain.setValueAtTime(0.001, now);
    gainL.gain.exponentialRampToValueAtTime(0.5, now + 0.5);

    // Right Channel
    const oscR = ctx.createOscillator();
    const gainR = ctx.createGain();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(rightFreq, now);
    gainR.gain.setValueAtTime(0.001, now);
    gainR.gain.exponentialRampToValueAtTime(0.5, now + 0.5);

    // Stereo Panning
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    if (pannerL && pannerR) {
      pannerL.pan.setValueAtTime(-1, now);
      pannerR.pan.setValueAtTime(1, now);
      oscL.connect(gainL);
      gainL.connect(pannerL);
      pannerL.connect(gainMasterRef.current);

      oscR.connect(gainR);
      gainR.connect(pannerR);
      pannerR.connect(gainMasterRef.current);
    } else {
      oscL.connect(gainL);
      gainL.connect(gainMasterRef.current);
      oscR.connect(gainR);
      gainR.connect(gainMasterRef.current);
    }

    oscL.start();
    oscR.start();
    oscLeftRef.current = oscL;
    oscRightRef.current = oscR;
    gainLeftRef.current = gainL;
    gainRightRef.current = gainR;

    // Start Noise Bed if enabled
    if (noiseType !== 'off') {
      const buffer = createNoiseBuffer(noiseType);
      if (buffer) {
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = buffer;
        noiseSrc.loop = true;
        const noiseG = ctx.createGain();
        noiseG.gain.setValueAtTime(0.001, now);
        noiseG.gain.exponentialRampToValueAtTime(noiseVolume, now + 0.5);
        noiseSrc.connect(noiseG);
        noiseG.connect(gainMasterRef.current);
        noiseSrc.start();
        noiseSourceRef.current = noiseSrc;
        noiseGainRef.current = noiseG;
      }
    }

    logEvent(`Resonance lock engaged: ${carrierFreq.toFixed(1)}Hz carrier with ${binauralOffset.toFixed(2)}Hz beat.`, 'sync');
  };

  // Stop Audio Synthesis
  const stopAudioSynthesis = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (gainLeftRef.current) {
      gainLeftRef.current.gain.setValueAtTime(gainLeftRef.current.gain.value, now);
      gainLeftRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    }
    if (gainRightRef.current) {
      gainRightRef.current.gain.setValueAtTime(gainRightRef.current.gain.value, now);
      gainRightRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    }
    if (noiseGainRef.current) {
      noiseGainRef.current.gain.setValueAtTime(noiseGainRef.current.gain.value, now);
      noiseGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    }

    window.setTimeout(() => {
      try {
        if (oscLeftRef.current) { oscLeftRef.current.stop(); oscLeftRef.current.disconnect(); }
        if (oscRightRef.current) { oscRightRef.current.stop(); oscRightRef.current.disconnect(); }
        if (noiseSourceRef.current) { noiseSourceRef.current.stop(); noiseSourceRef.current.disconnect(); }
      } catch {
        // Safe cleanup
      }
      oscLeftRef.current = null;
      oscRightRef.current = null;
      noiseSourceRef.current = null;
    }, 350);

    logEvent('Carrier engine placed in standby.', 'info');
  };

  // Toggle Session
  const toggleSession = async () => {
    if (!isSessionActive) {
      startAudioSynthesis();
      setIsSessionActive(true);
    } else {
      stopAudioSynthesis();
      setIsSessionActive(false);
    }
  };

  // Update Frequencies smoothly on slider change
  useEffect(() => {
    if (isSessionActive && audioCtxRef.current && oscLeftRef.current && oscRightRef.current) {
      const now = audioCtxRef.current.currentTime;
      const leftFreq = Math.max(20, carrierFreq - (binauralOffset / 2));
      const rightFreq = Math.max(20, carrierFreq + (binauralOffset / 2));
      oscLeftRef.current.frequency.setTargetAtTime(leftFreq, now, 0.05);
      oscRightRef.current.frequency.setTargetAtTime(rightFreq, now, 0.05);
    }
  }, [carrierFreq, binauralOffset, isSessionActive]);

  // Master Volume update
  useEffect(() => {
    if (audioCtxRef.current && gainMasterRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainMasterRef.current.gain.setTargetAtTime(audioMuted ? 0 : masterVolume, now, 0.05);
    }
  }, [masterVolume, audioMuted]);

  // Noise volume & type update
  useEffect(() => {
    if (audioCtxRef.current && noiseGainRef.current) {
      const now = audioCtxRef.current.currentTime;
      noiseGainRef.current.gain.setTargetAtTime(noiseType === 'off' ? 0 : noiseVolume, now, 0.05);
    }
  }, [noiseVolume, noiseType]);

  // Apply Preset
  const applyPreset = (preset: FocusPreset) => {
    setActivePreset(preset.id);
    setCarrierFreq(preset.carrier);
    setBinauralOffset(preset.offset);
    logEvent(`Preset applied: ${preset.name} (${preset.carrier}Hz ± ${preset.offset}Hz)`, 'sync');
  };

  // -------------------------------------------------------------
  // Session Timer & Telemetry Drift Simulation
  // -------------------------------------------------------------
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionSeconds(s => s + 1);
        
        // Coherence calculation simulation with natural biological micro-fluctuations
        setCoherenceIndex(prev => {
          const delta = (Math.random() - 0.48) * 0.012;
          return Math.min(0.995, Math.max(0.85, prev + delta));
        });
        setPhaseStability(prev => {
          const delta = (Math.random() - 0.48) * 0.25;
          return Number(Math.min(99.9, Math.max(92.0, prev + delta)).toFixed(1));
        });
        setPhiAlignment(prev => {
          const delta = (Math.random() - 0.5) * 0.004;
          return Number((1.618 + delta).toFixed(3));
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  // -------------------------------------------------------------
  // Breath Pacer Animation & Audio Cue Engine
  // -------------------------------------------------------------
  const activeBreathPattern = BREATH_PATTERNS.find(p => p.id === breathPatternId) || BREATH_PATTERNS[0];
  const currentPhase = activeBreathPattern.phases[breathPhaseIndex] || activeBreathPattern.phases[0];

  useEffect(() => {
    let animId: number;
    let startTime = performance.now();
    let currentIdx = 0;

    const tick = (now: number) => {
      const pattern = BREATH_PATTERNS.find(p => p.id === breathPatternId) || BREATH_PATTERNS[0];
      const phase = pattern.phases[currentIdx];
      const phaseDurationMs = phase.duration * 1000;
      const elapsed = now - startTime;

      if (elapsed >= phaseDurationMs) {
        currentIdx = (currentIdx + 1) % pattern.phases.length;
        setBreathPhaseIndex(currentIdx);
        startTime = now;
        setBreathProgress(0);

        // Haptic feedback on mobile if supported
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(35);
          } catch {
            // Ignore
          }
        }

        // Chime audio cue
        playChimeTone();
      } else {
        setBreathProgress(elapsed / phaseDurationMs);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [breathPatternId, playChimeTone]);

  // -------------------------------------------------------------
  // High-DPI Retina Cymatics Canvas Renderer
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let particleArr: Array<{ x: number; y: number; vx: number; vy: number; size: number; hue: number }> = [];

    const initParticles = (count: number, w: number, h: number) => {
      particleArr = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * Math.min(w, h) * 0.4;
        const a = Math.random() * Math.PI * 2;
        particleArr.push({
          x: Math.cos(a) * radius,
          y: Math.sin(a) * radius,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 0.8,
          hue: 180 + Math.random() * 100
        });
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(120, rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark fade trail
      ctx.fillStyle = 'rgba(8, 11, 18, 0.28)';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);

      angle += 0.008 * (isSessionActive ? 1.4 : 0.6);
      const basePulse = isSessionActive ? Math.sin(angle * 3) * 6 : 0;
      const harmonicScale = 1 + (coherenceIndex - 0.85) * 0.6;

      if (visualMode === 'chladni') {
        // Cymatic Chladni Resonator
        const rings = 7;
        const maxR = Math.min(w, h) * 0.36 * harmonicScale;

        for (let r = 1; r <= rings; r++) {
          const radius = (maxR / rings) * r + basePulse * (r / rings);
          const nodes = 6 + r * 3;
          const harmonicFreq = (carrierFreq / 40) * 0.5;

          ctx.beginPath();
          ctx.strokeStyle = r % 2 === 0 ? `rgba(56, 189, 248, ${0.35 + r * 0.08})` : `rgba(168, 85, 247, ${0.3 + r * 0.08})`;
          ctx.lineWidth = 1.5;

          for (let i = 0; i <= nodes; i++) {
            const a = (Math.PI * 2 / nodes) * i + (r % 2 === 0 ? angle : -angle);
            const wave = Math.sin(a * (r + 2) + angle * harmonicFreq) * (8 + r * 2.5);
            const pr = radius + wave + (interactiveMod.x * 20);
            const px = Math.cos(a) * pr;
            const py = Math.sin(a) * pr;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }

      } else if (visualMode === 'lissajous') {
        // Lissajous Neuro-Harmonics (Left/Right Frequency interference)
        const aCoeff = (carrierFreq / 50);
        const bCoeff = (binauralOffset * 2);
        const radius = Math.min(w, h) * 0.32 * harmonicScale;

        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;

        const steps = 300;
        for (let i = 0; i <= steps; i++) {
          const t = (Math.PI * 2 / steps) * i;
          const lx = Math.sin(aCoeff * t + angle) * radius;
          const ly = Math.sin(bCoeff * t) * radius;
          if (i === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (visualMode === 'phi-vortex') {
        // Sacred Golden Ratio Vortex
        const phi = 1.6180339887;
        const totalPoints = 140;
        const maxR = Math.min(w, h) * 0.38 * harmonicScale;

        for (let i = 1; i < totalPoints; i++) {
          const theta = i * phi * Math.PI * 2 + angle;
          const r = Math.sqrt(i / totalPoints) * maxR;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;

          const dotSize = 1.2 + (i / totalPoints) * 3;
          ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#818cf8' : '#c084fc';
          ctx.beginPath();
          ctx.arc(px, py, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (visualMode === 'particles') {
        // Quantum Particle Stream
        particleArr.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          // Pull towards center with orbital velocity
          const dist = Math.sqrt(p.x * p.x + p.y * p.y);
          const maxR = Math.min(w, h) * 0.42;
          if (dist > maxR || dist < 20) {
            p.vx *= -1;
            p.vy *= -1;
          }

          ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, 0.75)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isSessionActive, visualMode, carrierFreq, binauralOffset, coherenceIndex, interactiveMod]);

  // Touch/Mouse drag modulation on canvas
  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setInteractiveMod({ x, y });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative w-full h-dvh bg-[#080b12] text-slate-100 overflow-hidden font-sans select-none flex flex-col justify-between">
      
      {/* Background Interactive Cymatics Canvas */}
      <canvas 
        ref={canvasRef} 
        onPointerMove={handlePointerMove}
        className="fixed inset-0 w-full h-full z-0 touch-none pointer-events-auto cursor-crosshair"
      />

      {/* Subtle Micro-Grid & Ambient Vignette */}
      <div className="fixed inset-0 bg-grid-subtle pointer-events-none z-[1] opacity-40" />
      <div className="fixed inset-0 bg-radial-gradient from-transparent via-transparent to-black/80 pointer-events-none z-[2]" />

      {/* ------------------------------------------------------------- */}
      {/* Top Header & Session Status Bar */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-30 px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-xl bg-[#090d16]/70 border-b border-white/10 safe-area-top">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img 
              src="/sentinel_logo.svg" 
              alt="Sentinel Logo" 
              className="w-8 h-8 rounded-lg object-contain ring-1 ring-cyan-500/40 p-0.5 group-hover:scale-105 transition-transform bg-black/40"
            />
            <div className="hidden xs:block">
              <span className="font-['Syne',sans-serif] font-bold text-sm sm:text-base tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent uppercase">
                PROJECT SENTINEL
              </span>
              <span className="block text-[9px] font-mono text-cyan-400/90 tracking-widest uppercase">
                Neuro-Acoustic Studio
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10">
            <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="font-mono text-xs font-medium text-slate-300">
              {isSessionActive ? 'RESONATING' : 'STANDBY'}
            </span>
            <span className="hidden sm:inline-block font-mono text-xs text-cyan-400/80 font-bold ml-1">
              [{formatTimer(sessionSeconds)}]
            </span>
          </div>
        </div>

        {/* Preset Selector Dropdown / Pills (Desktop) */}
        <div className="hidden lg:flex items-center bg-black/50 p-1 rounded-full border border-white/10 font-mono text-xs gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1 rounded-full transition-all text-[11px] font-medium ${
                activePreset === p.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Action Controls Top-Right */}
        <div className="flex items-center space-x-2">
          {/* Mute/Unmute */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={audioMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Mute"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* AAR Summary Report */}
          <button 
            onClick={() => setShowAAR(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AAR Report</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Main Viewport Content & Modular Wings (Desktop) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-6 pointer-events-none overflow-hidden">
        
        {/* Left Modular Panel: Telemetry & Log (Desktop) */}
        <aside className="hidden xl:flex w-80 max-h-[calc(100vh-180px)] flex-col gap-4 pointer-events-auto overflow-y-auto pr-1">
          
          {/* Real-time Dynamic Telemetry Card */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Live Telemetry
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PHASE LOCKED
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-3xl font-bold font-mono tracking-tight text-white">{coherenceIndex.toFixed(3)}</span>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Coherence Index</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-emerald-400">{phiAlignment} φ</span>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Golden Ratio</span>
              </div>
            </div>

            {/* Coherence progress bar */}
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden mb-4 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-700" 
                style={{ width: `${coherenceIndex * 100}%` }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 font-mono text-xs">
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <span className="block text-[10px] text-slate-400 uppercase">Stability</span>
                <span className="font-bold text-cyan-300">{phaseStability}%</span>
              </div>
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <span className="block text-[10px] text-slate-400 uppercase">Frequency</span>
                <span className="font-bold text-purple-300">{binauralOffset.toFixed(1)} Hz</span>
              </div>
            </div>
          </div>

          {/* Visual Mode Switcher */}
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2.5 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Cymatic Visualizer Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {[
                { id: 'chladni', label: 'Chladni Plate' },
                { id: 'lissajous', label: 'Lissajous' },
                { id: 'phi-vortex', label: 'Phi Vortex' },
                { id: 'particles', label: 'Particles' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setVisualMode(m.id as VisualMode)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                    visualMode === m.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timestamped Event Log */}
          <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col min-h-[160px]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Harmonic Event Log
            </span>
            <div className="flex-1 space-y-1.5 overflow-y-auto font-mono text-[10px] text-slate-300 pr-1 max-h-44">
              {events.map((ev, i) => (
                <div key={i} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2">
                  <span className="text-cyan-400/80 shrink-0">{ev.timestamp}</span>
                  <span className="text-slate-300 leading-tight">{ev.message}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Center Breath Pacer & Harmonic Focus Core */}
        <div className="flex-1 h-full flex flex-col items-center justify-center relative pointer-events-none">
          <div className="relative flex items-center justify-center pointer-events-auto">
            
            {/* Outer Breathing Aurora Halo */}
            <div 
              className="absolute rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm transition-transform duration-700 ease-out"
              style={{
                width: `${240 + breathProgress * 120}px`,
                height: `${240 + breathProgress * 120}px`,
                opacity: 0.4 + breathProgress * 0.4,
                boxShadow: isSessionActive ? `0 0 60px rgba(56, 189, 248, ${0.15 + breathProgress * 0.25})` : 'none'
              }}
            />

            {/* Inner Coherence Core */}
            <div className="relative z-20 w-44 h-44 sm:w-56 sm:h-56 rounded-full glass-panel-glow flex flex-col items-center justify-center text-center p-6 cursor-pointer group">
              <span className="font-mono font-bold text-[10px] sm:text-xs tracking-[0.2em] text-cyan-400 uppercase mb-1">
                {activeBreathPattern.name.split(' ')[0]} PACER
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight my-1 drop-shadow-md">
                {currentPhase.label}
              </span>
              <span className="font-mono text-[11px] text-cyan-300/90 mt-1">
                {(currentPhase.duration * (1 - breathProgress)).toFixed(1)}s
              </span>

              {/* Mini pulse ring */}
              <div className="w-16 h-1 bg-black/50 rounded-full mt-3 overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-100" 
                  style={{ width: `${breathProgress * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Modular Panel: Synthesizer & Noise Controls (Desktop) */}
        <aside className="hidden xl:flex w-84 max-h-[calc(100vh-180px)] flex-col gap-4 pointer-events-auto overflow-y-auto pl-1">
          
          {/* Binaural Synthesizer Unit */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Binaural Wave Generator
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                DUAL OSCILLATOR
              </span>
            </div>

            {/* Carrier Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Carrier Tone</span>
                <span className="text-cyan-400 font-bold">{carrierFreq} Hz</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="528" 
                step="0.5"
                value={carrierFreq} 
                onChange={e => setCarrierFreq(Number(e.target.value))}
                className="w-full slider-tactile" 
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-500 mt-1">
                <span>40 Hz (Delta)</span>
                <span>136.1 Hz (OM)</span>
                <span>432 Hz</span>
                <span>528 Hz</span>
              </div>
            </div>

            {/* Binaural Offset Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Binaural Beat Offset</span>
                <span className="text-indigo-400 font-bold">{binauralOffset.toFixed(2)} Hz</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="40" 
                step="0.1" 
                value={binauralOffset} 
                onChange={e => setBinauralOffset(Number(e.target.value))}
                className="w-full slider-tactile" 
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-500 mt-1">
                <span>0.5Hz Delta</span>
                <span>7.83Hz Schumann</span>
                <span>10Hz Alpha</span>
                <span>40Hz Gamma</span>
              </div>
            </div>

            {/* Master Volume */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Master Level</span>
                <span className="text-slate-200 font-bold">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={masterVolume} 
                onChange={e => setMasterVolume(Number(e.target.value))}
                className="w-full slider-tactile" 
              />
            </div>
          </div>

          {/* Ambient Acoustic Masking (Pink / Brown Noise) */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Acoustic Masking Generator
            </span>
            
            <div className="grid grid-cols-3 gap-2">
              {(['off', 'pink', 'brown'] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setNoiseType(n)}
                  className={`py-1.5 rounded-xl font-mono text-xs capitalize transition-all ${
                    noiseType === n 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                      : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {n === 'off' ? 'Off' : `${n} Noise`}
                </button>
              ))}
            </div>

            {noiseType !== 'off' && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Noise Level</span>
                  <span className="text-cyan-400 font-bold">{Math.round(noiseVolume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.5" 
                  step="0.01" 
                  value={noiseVolume} 
                  onChange={e => setNoiseVolume(Number(e.target.value))}
                  className="w-full slider-tactile" 
                />
              </div>
            )}
          </div>

          {/* Breath Pattern Selector */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Breathing Geometry
            </span>
            <div className="space-y-1.5">
              {BREATH_PATTERNS.map(bp => (
                <button
                  key={bp.id}
                  onClick={() => setBreathPatternId(bp.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs flex items-center justify-between transition-all ${
                    breathPatternId === bp.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{bp.name}</span>
                  {breathPatternId === bp.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Tactical Action Dock & Mobile Tab Switcher */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-30 px-4 sm:px-6 py-3 backdrop-blur-2xl bg-[#090d16]/80 border-t border-white/10 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Mobile Tab Buttons (< xl screens) */}
          <div className="flex xl:hidden items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'synth', label: 'Synth', icon: Sliders },
              { id: 'breath', label: 'Breath', icon: Wind },
              { id: 'telemetry', label: 'Metrics', icon: Activity },
              { id: 'visuals', label: 'Cymatics', icon: Eye },
              { id: 'log', label: 'Log', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = mobileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(isSelected ? 'none' : tab.id as MobileTab)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                    isSelected 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'bg-white/5 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Master Play/Pause Action Button */}
          <div className="flex items-center justify-center flex-1 xl:flex-initial">
            <button 
              onClick={toggleSession}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                isSessionActive 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 shadow-rose-500/20' 
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-cyan-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isSessionActive ? (
                <>
                  <Pause className="w-4 h-4 fill-rose-300" />
                  <span>PAUSE SESSION</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>BEGIN SESSION</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Info / Headphones Reminder */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px]">Stereo headphones advised</span>
          </div>

        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Drawer Bottom Sheet for Config & Telemetry */}
      {/* ------------------------------------------------------------- */}
      {mobileTab !== 'none' && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 z-40 bg-[#090d16]/95 border-t border-white/20 backdrop-blur-2xl p-6 rounded-t-3xl shadow-2xl animate-accordion-down max-h-[80vh] overflow-y-auto safe-area-bottom">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-300">
              {mobileTab === 'synth' && '🎛️ Binaural & Soundbed Controls'}
              {mobileTab === 'breath' && '🫁 Breath Pacer Settings'}
              {mobileTab === 'telemetry' && '📊 Bio-Telemetry & Stability'}
              {mobileTab === 'visuals' && '🎨 Cymatic Visualizer Mode'}
              {mobileTab === 'log' && '📜 Harmonic Event Log'}
            </h3>
            <button 
              onClick={() => setMobileTab('none')}
              className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab 1: Synth */}
          {mobileTab === 'synth' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>Carrier Frequency</span>
                  <span className="text-cyan-400 font-bold">{carrierFreq} Hz</span>
                </div>
                <input 
                  type="range" min="40" max="528" step="0.5" value={carrierFreq} 
                  onChange={e => setCarrierFreq(Number(e.target.value))}
                  className="w-full slider-tactile"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>Binaural Beat Offset</span>
                  <span className="text-indigo-400 font-bold">{binauralOffset} Hz</span>
                </div>
                <input 
                  type="range" min="0.5" max="40" step="0.1" value={binauralOffset} 
                  onChange={e => setBinauralOffset(Number(e.target.value))}
                  className="w-full slider-tactile"
                />
              </div>

              {/* Presets List */}
              <div className="pt-2">
                <span className="block font-mono text-xs text-slate-400 mb-2">Preset Entrainments:</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className={`p-2.5 rounded-xl font-mono text-left text-xs transition-all ${
                        activePreset === p.id 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                          : 'bg-white/5 text-slate-300 border border-white/5'
                      }`}
                    >
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-cyan-400">{p.carrier}Hz ± {p.offset}Hz</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Noise Generator */}
              <div className="pt-2 border-t border-white/10">
                <span className="block font-mono text-xs text-slate-400 mb-2">Acoustic Noise Bed:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['off', 'pink', 'brown'] as const).map(n => (
                    <button
                      key={n}
                      onClick={() => setNoiseType(n)}
                      className={`py-2 rounded-xl font-mono text-xs capitalize ${
                        noiseType === n ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      {n === 'off' ? 'Off' : `${n} Noise`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Breath */}
          {mobileTab === 'breath' && (
            <div className="space-y-3">
              {BREATH_PATTERNS.map(bp => (
                <button
                  key={bp.id}
                  onClick={() => setBreathPatternId(bp.id)}
                  className={`w-full p-3.5 rounded-xl font-mono text-xs flex items-center justify-between text-left ${
                    breathPatternId === bp.id 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{bp.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {bp.phases.map(p => `${p.label} (${p.duration}s)`).join(' · ')}
                    </div>
                  </div>
                  {breathPatternId === bp.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}

          {/* Tab 3: Telemetry */}
          {mobileTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Coherence</span>
                  <span className="text-2xl font-bold font-mono text-cyan-300">{coherenceIndex.toFixed(3)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Stability</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{phaseStability}%</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Golden Ratio</span>
                  <span className="text-2xl font-bold font-mono text-purple-300">{phiAlignment} φ</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Session Time</span>
                  <span className="text-2xl font-bold font-mono text-amber-300">{formatTimer(sessionSeconds)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Visuals */}
          {mobileTab === 'visuals' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'chladni', label: 'Chladni Cymatics', desc: 'Harmonic vibrational plate geometry' },
                { id: 'lissajous', label: 'Lissajous Curves', desc: 'Stereo phase interference loops' },
                { id: 'phi-vortex', label: 'Phi Lattice', desc: 'Golden ratio spiral lattice' },
                { id: 'particles', label: 'Quantum Cloud', desc: 'Touch-reactive particle dynamics' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setVisualMode(m.id as VisualMode)}
                  className={`p-3.5 rounded-2xl text-left font-mono text-xs transition-all ${
                    visualMode === m.id 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'bg-white/5 text-slate-300 border border-white/5'
                  }`}
                >
                  <div className="font-semibold text-white">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Tab 5: Event Log */}
          {mobileTab === 'log' && (
            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
              {events.map((ev, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex gap-2">
                  <span className="text-cyan-400 shrink-0">{ev.timestamp}</span>
                  <span className="text-slate-300">{ev.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* After-Action Report (AAR) Modal */}
      {/* ------------------------------------------------------------- */}
      {showAAR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-rise-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 max-w-xl w-full shadow-2xl relative">
            <button 
              onClick={() => setShowAAR(false)} 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Syne',sans-serif] font-bold text-xl text-white uppercase tracking-wider">
                  Session Analytics (AAR)
                </h2>
                <p className="font-mono text-xs text-cyan-400/90">Project Sentinel Readiness Evaluation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Duration</span>
                <span className="font-mono text-lg font-bold text-white">{formatTimer(sessionSeconds)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Avg Coherence</span>
                <span className="font-mono text-lg font-bold text-emerald-400">93.8%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Peak Stability</span>
                <span className="font-mono text-lg font-bold text-cyan-300">{phaseStability}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
              Dynamic Resonance state achieved with high harmonic alignment. Parasympathetic activation index shows strong convergence under {activeBreathPattern.name}.
            </p>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const data = JSON.stringify({
                    sessionDuration: sessionSeconds,
                    carrierFreq,
                    binauralOffset,
                    coherenceIndex,
                    phaseStability,
                    timestamp: new Date().toISOString()
                  }, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sentinel-session-${Date.now()}.json`;
                  a.click();
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Telemetry</span>
              </button>

              <button 
                onClick={() => setShowAAR(false)} 
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Session;
