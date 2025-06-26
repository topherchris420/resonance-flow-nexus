
import React, { useEffect, useRef, useState } from 'react';
import { DRRNode, FocusState } from '../types/focus';

interface CymaticCanvasProps {
  resonanceNodes: DRRNode[];
  focusState: FocusState;
  isActive: boolean;
  breathCoherence: number;
}

const CymaticCanvas: React.FC<CymaticCanvasProps> = ({
  resonanceNodes,
  focusState,
  isActive,
  breathCoherence
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw central mandala based on focus state
      drawMandala(ctx, centerX, centerY, focusState, breathCoherence);

      // Draw resonance nodes
      resonanceNodes.forEach((node, index) => {
        drawResonanceNode(ctx, node, index, centerX, centerY);
      });

      // Draw breathing indicator
      if (breathCoherence > 0) {
        drawBreathIndicator(ctx, centerX, centerY, breathCoherence);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resonanceNodes, focusState, isActive, breathCoherence]);

  const drawMandala = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, state: FocusState, coherence: number) => {
    const time = Date.now() * 0.001;
    const radius = 50 + coherence * 100;
    
    // Get color based on focus state
    const getStateColor = () => {
      switch (state) {
        case 'Focus 12': return [100, 200, 255]; // Blue
        case 'Focus 15': return [255, 150, 50]; // Orange
        case 'Focus 21': return [255, 215, 0]; // Gold
        default: return [255, 255, 255];
      }
    };

    const [r, g, b] = getStateColor();
    
    // Draw concentric circles with phase modulation
    for (let i = 0; i < 8; i++) {
      const currentRadius = radius + i * 30;
      const alpha = (1 - i * 0.1) * (0.3 + coherence * 0.7);
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Create wavy circle based on frequency nodes
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        let waveRadius = currentRadius;
        
        // Modulate based on resonance nodes
        resonanceNodes.forEach(node => {
          const nodeInfluence = Math.sin(angle * 6 + time * node.frequency * 0.1) * node.amplitude * 10;
          waveRadius += nodeInfluence;
        });
        
        const x = centerX + Math.cos(angle) * waveRadius;
        const y = centerY + Math.sin(angle) * waveRadius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }

    // Draw geometric patterns
    const sides = state === 'Focus 12' ? 6 : state === 'Focus 15' ? 8 : 12;
    drawGeometricPattern(ctx, centerX, centerY, radius * 1.5, sides, time, [r, g, b], coherence);
  };

  const drawGeometricPattern = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, sides: number, time: number, color: number[], coherence: number) => {
    const [r, g, b] = color;
    
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + coherence * 0.4})`;
    ctx.lineWidth = 1;
    
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = radius * (0.6 + layer * 0.2);
      const rotation = time * 0.1 * (layer + 1);
      
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        const x = centerX + Math.cos(angle) * layerRadius;
        const y = centerY + Math.sin(angle) * layerRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };

  const drawResonanceNode = (ctx: CanvasRenderingContext2D, node: DRRNode, index: number, centerX: number, centerY: number) => {
    const x = centerX + node.x;
    const y = centerY + node.y;
    const radius = 5 + node.amplitude * 20;
    
    // Color based on frequency
    const hue = (node.frequency % 100) * 3.6;
    const saturation = 70 + node.stabilityScore * 30;
    const lightness = 50 + node.amplitude * 30;
    
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw connection lines to center
    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const drawBreathIndicator = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, coherence: number) => {
    const time = Date.now() * 0.002;
    const pulseRadius = 20 + Math.sin(time) * 10 * coherence;
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + coherence * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'radial-gradient(circle at center, rgba(10, 10, 30, 1) 0%, rgba(0, 0, 0, 1) 100%)' }}
    />
  );
};

export default CymaticCanvas;
