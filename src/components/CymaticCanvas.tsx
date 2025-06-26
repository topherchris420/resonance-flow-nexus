
import React, { useEffect, useRef, useState } from 'react';
import { DRRNode, FocusState, DRREngineState, IntuitiveForesightState } from '../types/focus';

interface CymaticCanvasProps {
  resonanceNodes: DRRNode[];
  focusState: FocusState;
  isActive: boolean;
  breathCoherence: number;
  drrState?: DRREngineState;
  intuitiveForesightState?: IntuitiveForesightState;
}

const CymaticCanvas: React.FC<CymaticCanvasProps> = ({
  resonanceNodes,
  focusState,
  isActive,
  breathCoherence,
  drrState,
  intuitiveForesightState
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      // Clear with dynamic fade based on activity
      const fadeAlpha = isActive ? 0.03 : 0.1;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isActive) {
        // Draw main DRR mandala
        drawDRRMandala(ctx, centerX, centerY);
        
        // Draw resonance nodes with advanced properties
        drawAdvancedResonanceNodes(ctx, centerX, centerY);
        
        // Draw Intuitive Foresight golden spirals
        if (intuitiveForesightState?.convergenceDetected) {
          drawGoldenSpiralOverlay(ctx, centerX, centerY);
        }
        
        // Draw geometric evolution indicators
        drawGeometricEvolution(ctx, centerX, centerY);
        
        // Draw breath coherence visualization
        drawBreathVisualization(ctx, centerX, centerY);
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
  }, [resonanceNodes, focusState, isActive, breathCoherence, drrState, intuitiveForesightState]);

  const drawDRRMandala = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!drrState) return;
    
    const time = Date.now() * 0.001;
    const baseRadius = 60 + drrState.vibrationalCoherence * 80;
    
    // Get dynamic colors based on focus state and coherence
    const getStateColors = () => {
      const coherence = drrState.vibrationalCoherence;
      switch (focusState) {
        case 'Focus 12': 
          return {
            primary: [100 + coherence * 155, 200 + coherence * 55, 255],
            secondary: [50 + coherence * 100, 150 + coherence * 105, 255]
          };
        case 'Focus 15': 
          return {
            primary: [255, 150 + coherence * 105, 50 + coherence * 100],
            secondary: [200 + coherence * 55, 100 + coherence * 100, 30]
          };
        case 'Focus 21': 
          return {
            primary: [255, 215 + coherence * 40, coherence * 100],
            secondary: [200 + coherence * 55, 180 + coherence * 75, 50]
          };
        default: 
          return { primary: [255, 255, 255], secondary: [200, 200, 200] };
      }
    };

    const colors = getStateColors();
    
    // Draw dynamic concentric patterns
    const ringCount = 6 + Math.floor(drrState.spectralPhaseStability * 6);
    for (let ring = 0; ring < ringCount; ring++) {
      const ringRadius = baseRadius + ring * (20 + drrState.goldenRatioAlignment * 15);
      const alpha = (1 - ring * 0.08) * (0.4 + drrState.vibrationalCoherence * 0.6);
      
      ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${alpha})`;
      ctx.lineWidth = 1 + drrState.spectralPhaseStability * 2;
      
      ctx.beginPath();
      
      // Create resonant wave patterns
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        let currentRadius = ringRadius;
        
        // Modulate radius based on dominant frequencies
        drrState.dominantFrequencies.forEach((freq, index) => {
          const influence = Math.sin(angle * (3 + index) + time * freq * 0.001) * 
                           (10 + drrState.amplitudeVariance * 20);
          currentRadius += influence;
        });
        
        // Add harmonic convergence effect
        if (drrState.harmonicConvergence) {
          currentRadius += Math.sin(angle * 8 + time * 2) * 15;
        }
        
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }

    // Draw sacred geometry based on focus state
    const geometryComplexity = focusState === 'Focus 12' ? 6 : 
                              focusState === 'Focus 15' ? 8 : 12;
    drawSacredGeometry(ctx, centerX, centerY, baseRadius * 1.8, geometryComplexity, time, colors);
  };

  const drawSacredGeometry = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, 
                              radius: number, sides: number, time: number, colors: any) => {
    if (!drrState) return;
    
    const alpha = 0.3 + drrState.spectralPhaseStability * 0.5;
    ctx.strokeStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${alpha})`;
    ctx.lineWidth = 1;
    
    // Draw multiple rotating geometric layers
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = radius * (0.5 + layer * 0.25);
      const rotation = time * (0.1 + layer * 0.05) + drrState.currentPhase;
      
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        
        // Add golden ratio spiral influence
        const spiralInfluence = drrState.goldenRatioAlignment * 
                               Math.log(1 + i * 0.1) * 10;
        const currentRadius = layerRadius + spiralInfluence;
        
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };

  const drawAdvancedResonanceNodes = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    resonanceNodes.forEach((node, index) => {
      const x = centerX + node.x;
      const y = centerY + node.y;
      const baseRadius = 4 + node.amplitude * 25;
      
      // Pulsing based on resonance depth
      const pulseRadius = baseRadius + Math.sin(Date.now() * 0.005 + node.phase) * 
                         (node.resonanceDepth || 0) * 10;
      
      // Color based on harmonic index and frequency
      const hue = (node.harmonicIndex || 1) * 30 + (node.frequency % 100) * 2;
      const saturation = 60 + node.stabilityScore * 40;
      const lightness = 40 + node.amplitude * 40;
      const alpha = 0.7 + node.stabilityScore * 0.3;
      
      // Draw node with glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius * 2);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw core node
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness + 30}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw resonance connections
      if (node.harmonicIndex && node.harmonicIndex > 1) {
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
  };

  const drawGoldenSpiralOverlay = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!intuitiveForesightState?.goldenSpiralNodes) return;
    
    const { spiralIntensity, goldenSpiralNodes } = intuitiveForesightState;
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${spiralIntensity * 0.8})`;
    ctx.lineWidth = 2;
    
    // Draw golden spiral
    ctx.beginPath();
    goldenSpiralNodes.forEach((spiralNode, index) => {
      const x = centerX + spiralNode.x;
      const y = centerY + spiralNode.y;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw spiral nodes
      const nodeRadius = 3 + spiralNode.intensity * 8;
      ctx.fillStyle = `rgba(255, 215, 0, ${spiralNode.intensity})`;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.stroke();
  };

  const drawGeometricEvolution = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!drrState) return;
    
    // Symbol emergence based on coherence levels
    if (drrState.vibrationalCoherence > 0.6) {
      const symbolSize = 20 + drrState.vibrationalCoherence * 30;
      const alpha = (drrState.vibrationalCoherence - 0.6) * 2.5;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      
      // Draw emerging symbols around the mandala
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 200 + drrState.spectralPhaseStability * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Draw different symbols based on focus state
        if (focusState === 'Focus 21' && drrState.harmonicConvergence) {
          drawSacredSymbol(ctx, x, y, symbolSize, i);
        }
      }
    }
  };

  const drawSacredSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, variant: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    switch (variant % 4) {
      case 0: // Flower of Life petal
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const petalX = Math.cos(angle) * size * 0.5;
          const petalY = Math.sin(angle) * size * 0.5;
          ctx.arc(petalX, petalY, size * 0.3, 0, Math.PI * 2);
        }
        ctx.stroke();
        break;
      case 1: // Merkaba outline
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.closePath();
        ctx.moveTo(0, size);
        ctx.lineTo(-size * 0.866, -size * 0.5);
        ctx.lineTo(size * 0.866, -size * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;
      case 2: // Sri Yantra triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const x1 = Math.cos(angle) * size;
          const y1 = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      case 3: // Torus field lines
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath();
          ctx.arc(0, 0, size * (0.3 + ring * 0.2), 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
    }
    
    ctx.restore();
  };

  const drawBreathVisualization = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (breathCoherence <= 0) return;
    
    const time = Date.now() * 0.002;
    const breathRadius = 15 + Math.sin(time * breathCoherence) * 8 * breathCoherence;
    
    ctx.strokeStyle = `rgba(100, 255, 150, ${0.6 + breathCoherence * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner breath indicator
    ctx.fillStyle = `rgba(100, 255, 150, ${breathCoherence * 0.3})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        background: 'radial-gradient(circle at center, rgba(5, 5, 15, 1) 0%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default CymaticCanvas;
