import React, { useEffect, useRef } from 'react';
import { FocusState, DRREngineState } from '../types/focus';

interface EnhancedVisualEffectsProps {
  focusState: FocusState;
  isActive: boolean;
  drrState?: DRREngineState;
}

const EnhancedVisualEffects: React.FC<EnhancedVisualEffectsProps> = ({
  focusState,
  isActive,
  drrState
}) => {
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !particlesRef.current) return;

    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      life: number;
      maxLife: number;
    }> = [];

    const createParticle = () => {
      const hue = focusState === 'Focus 12' ? 200 + Math.random() * 40 :
                  focusState === 'Focus 15' ? 45 + Math.random() * 30 :
                  280 + Math.random() * 40;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        hue,
        life: 0,
        maxLife: Math.random() * 120 + 60
      });
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new particles based on DRR state
      if (Math.random() < (drrState?.vibrationalCoherence || 0.1) * 0.3) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Apply consciousness field effect
        if (drrState?.harmonicConvergence) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            particle.vx += (dx / distance) * 0.02;
            particle.vy += (dy / distance) * 0.02;
          }
        }

        const alpha = 1 - (particle.life / particle.maxLife);
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, focusState, drrState]);

  if (!isActive) return null;

  return (
    <canvas
      ref={particlesRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default EnhancedVisualEffects;