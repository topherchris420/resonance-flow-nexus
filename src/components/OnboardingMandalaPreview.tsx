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
  const rafRef = useRef<number>();
  const phaseRef = useRef<"inhale" | "exhale">("inhale");
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");

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
      const baseR = 34 + breath * 52;

      // Concentric cymatic rings
      const rings = 5;
      for (let r = 0; r < rings; r++) {
        const petals = 6 + r * 2;
        const radius = baseR * (0.45 + r * 0.16);
        const rotation = (reduced ? 0 : t * 0.12 * (r % 2 === 0 ? 1 : -1)) + breath * 0.5;
        ctx.beginPath();
        for (let a = 0; a <= 360; a++) {
          const rad = (a * Math.PI) / 180;
          const mod = 1 + 0.22 * Math.sin(petals * rad + rotation * Math.PI) * (0.4 + breath * 0.6);
          const rr = radius * mod;
          const x = cx + Math.cos(rad + rotation) * rr;
          const y = cy + Math.sin(rad + rotation) * rr;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.18 + (1 - r / rings) * 0.42 * (0.5 + breath * 0.5);
        ctx.lineWidth = r === 0 ? 1.8 : 1;
        ctx.stroke();
      }

      // Pulse core
      ctx.globalAlpha = 0.25 + breath * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 4 + breath * 6, 0, Math.PI * 2);
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
      <p className="mt-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-70">
        {phase === "inhale" ? "Breathe in" : "Breathe out"}
      </p>
    </div>
  );
};

export default OnboardingMandalaPreview;
