import React, { useEffect, useRef, useState } from "react";

interface OnboardingMandalaPreviewProps {
  /** CSS color for strokes, e.g. "hsl(var(--panel-5-fg))" */
  color: string;
  /** Seconds for a full inhale + exhale cycle */
  cycleSeconds?: number;
  className?: string;
  onPhaseChange?: (phase: "inhale" | "exhale") => void;
}

/**
 * Simulated DRR mandala: a cymatic rose curve that breathes with a
 * sine-driven coherence envelope, so the landing page previews the
 * feel of a live session.
 */
const OnboardingMandalaPreview: React.FC<OnboardingMandalaPreviewProps> = ({
  color,
  cycleSeconds = 8,
  className,
  onPhaseChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const phaseRef = useRef<"inhale" | "exhale">("inhale");
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const stageRef = useRef<"focus12" | "shifting" | "focus15">("focus12");
  const [stage, setStage] = useState<"focus12" | "shifting" | "focus15">("focus12");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      // Breath envelope: 0 at full exhale, 1 at full inhale
      const breath = reduced ? 0.6 : (Math.sin((t / cycleSeconds) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const nextPhase = Math.cos((t / cycleSeconds) * Math.PI * 2 - Math.PI / 2) >= 0 ? "inhale" : "exhale";
      if (nextPhase !== phaseRef.current) {
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
        onPhaseChange?.(nextPhase);
      }

      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Focus progression: 3 breaths in Focus 12, one breath of transition,
      // 3 breaths in Focus 15, then loop.
      const cycles = t / cycleSeconds;
      const loop = cycles % 7;
      const shift = loop < 3 ? 0 : loop < 4 ? loop - 3 : 1;
      const eased = shift * shift * (3 - 2 * shift);
      const nextStage = loop < 3 ? "focus12" : loop < 4 ? "shifting" : "focus15";
      if (nextStage !== stageRef.current) {
        stageRef.current = nextStage;
        setStage(nextStage);
      }

      const baseR = 34 + breath * 52 + eased * 14;

      // Concentric cymatic rings
      const rings = 5 + Math.round(eased * 2);
      for (let r = 0; r < rings; r++) {
        const petals = 6 + r * 2 + Math.round(eased * 6);
        const radius = baseR * (0.45 + r * 0.16);
        const rotation =
          (reduced ? 0 : t * (0.12 + eased * 0.14) * (r % 2 === 0 ? 1 : -1)) + breath * 0.5;
        ctx.beginPath();
        for (let a = 0; a <= 360; a++) {
          const rad = (a * Math.PI) / 180;
          const mod =
            1 +
            (0.22 + eased * 0.1) *
              Math.sin(petals * rad + rotation * Math.PI) *
              (0.4 + breath * 0.6);
          const rr = radius * mod;
          const x = cx + Math.cos(rad + rotation) * rr;
          const y = cy + Math.sin(rad + rotation) * rr;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = (0.18 + (1 - r / rings) * 0.42 * (0.5 + breath * 0.5)) * (1 + eased * 0.35);
        ctx.lineWidth = (r === 0 ? 1.8 : 1) * (1 + eased * 0.3);
        ctx.stroke();
      }

      // Pulse core
      ctx.globalAlpha = 0.25 + breath * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 4 + breath * 6 + eased * 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, cycleSeconds, onPhaseChange]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Preview of the resonance mandala breathing in a slow rhythm"
        style={{ width: 260, height: 260 }}
      />
      <p
        aria-live="polite"
        className="mt-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-70"
      >
        {phase === "inhale" ? "Breathe in" : "Breathe out"}
      </p>
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.25em]">
        <span style={{ opacity: stage === "focus12" ? 1 : 0.4 }}>Focus 12</span>
        <span
          className="h-px w-8 origin-left transition-transform duration-700"
          style={{
            backgroundColor: "currentColor",
            opacity: stage === "shifting" ? 1 : 0.35,
            transform: stage === "focus12" ? "scaleX(0.4)" : "scaleX(1)",
          }}
        />
        <span style={{ opacity: stage === "focus15" ? 1 : 0.4 }}>Focus 15</span>
      </div>
      <p className="mt-2 text-center font-sans text-[0.7rem] opacity-60">
        {stage === "focus12"
          ? "Expanded awareness — the pattern settles with your breath."
          : stage === "shifting"
          ? "Coherence threshold reached — the geometry is reorganising."
          : "Focus 15 — denser petals, slower time, no clock."}
      </p>
    </div>
  );
};

export default OnboardingMandalaPreview;
