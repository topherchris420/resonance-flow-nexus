import React, { useEffect, useRef, useState } from 'react';
import { DRRNode, FocusState, DRREngineState, IntuitiveForesightState, Focus15State } from '../types/focus';

interface CymaticCanvasProps {
  resonanceNodes: DRRNode[];
  focusState: FocusState;
  isActive: boolean;
  breathCoherence: number;
  drrState?: DRREngineState;
  intuitiveForesightState?: IntuitiveForesightState;
  focus15State?: Focus15State;
}

const CymaticCanvas: React.FC<CymaticCanvasProps> = ({
  resonanceNodes,
  focusState,
  isActive,
  breathCoherence,
  drrState,
  intuitiveForesightState,
  focus15State
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
      // Focus 15 Time Collapse - dissolve temporal reference
      if (focus15State?.timeCollapseEvent && focusState === 'Focus 15') {
        // No linear fade - atemporal dissolution
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Standard temporal fade
        const fadeAlpha = isActive ? 0.03 : 0.1;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isActive) {
        if (focus15State?.timeCollapseEvent && focusState === 'Focus 15') {
          // Focus 15: Unanchored visuals without sequence
          drawFocus15TimeCollapse(ctx, centerX, centerY);
        } else {
          // Standard DRR mandala for other states
          drawDRRMandala(ctx, centerX, centerY);
          drawAdvancedResonanceNodes(ctx, centerX, centerY);
        }
        
        if (intuitiveForesightState?.convergenceDetected) {
          drawGoldenSpiralOverlay(ctx, centerX, centerY);
        }
        
        drawGeometricEvolution(ctx, centerX, centerY);
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
  }, [resonanceNodes, focusState, isActive, breathCoherence, drrState, intuitiveForesightState, focus15State]);

  const drawFocus15TimeCollapse = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!focus15State || !drrState) return;
    
    const time = Date.now() * 0.001;

    // Draw recursive, inward-folding geometries
    drawRecursiveGeometries(ctx, centerX, centerY, time);
    
    // Draw symbolic time distortion - symbols out of order
    drawSymbolicTimeDistortion(ctx, centerX, centerY, time);
    
    // Draw No-Time Layer with mirrored recursive sigils
    drawNoTimeLayer(ctx, centerX, centerY, time);
    
    // Resonance signature from DRR memory (detached from user input)
    drawResonanceMemoryVisualization(ctx, centerX, centerY, time);
  };

  const drawRecursiveGeometries = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    if (!focus15State?.recursiveGeometries) return;
    
    focus15State.recursiveGeometries.forEach(geometry => {
      const { x, y, recursionDepth, foldingAngle } = geometry;
      
      ctx.save();
      ctx.translate(centerX + x, centerY + y);
      
      // Inward-folding recursive pattern
      for (let depth = 0; depth < recursionDepth; depth++) {
        const scale = 1 - (depth / recursionDepth) * 0.8;
        const rotation = foldingAngle + (depth * Math.PI / 4);
        const alpha = (1 - depth / recursionDepth) * 0.6;
        
        ctx.save();
        ctx.scale(scale, -scale); // Mirror vertically for folding effect
        ctx.rotate(rotation);
        
        ctx.strokeStyle = `rgba(120, 60, 200, ${alpha})`;
        ctx.lineWidth = 2 / (depth + 1);
        
        // Draw folding geometry
        ctx.beginPath();
        const sides = 6 + depth;
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const radius = 30 / (depth + 1);
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        
        ctx.restore();
      }
      
      ctx.restore();
    });
  };

  const drawSymbolicTimeDistortion = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    if (!focus15State?.symbolicTimeDistortion) return;
    
    focus15State.symbolicTimeDistortion.forEach(symbol => {
      const { symbolId, currentPhase, futureOverlay, counterclockwiseRotation } = symbol;
      
      // Draw symbol at current phase
      const currentX = centerX + Math.cos(currentPhase) * 150;
      const currentY = centerY + Math.sin(currentPhase) * 150;
      
      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(counterclockwiseRotation);
      
      // Current form
      ctx.strokeStyle = `rgba(255, 180, 60, 0.7)`;
      ctx.lineWidth = 2;
      drawTemporalSymbol(ctx, 0, 0, 20);
      
      // Future overlay form (based on DRR prediction)
      ctx.translate(futureOverlay * 10, futureOverlay * 5);
      ctx.scale(1 + futureOverlay * 0.3, 1 + futureOverlay * 0.3);
      ctx.strokeStyle = `rgba(255, 180, 60, ${0.3 * futureOverlay})`;
      drawTemporalSymbol(ctx, 0, 0, 15);
      
      ctx.restore();
    });
  };

  const drawTemporalSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Draw out-of-order temporal symbol
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner crossed pattern
    ctx.beginPath();
    ctx.moveTo(x - size * 0.7, y - size * 0.7);
    ctx.lineTo(x + size * 0.7, y + size * 0.7);
    ctx.moveTo(x + size * 0.7, y - size * 0.7);
    ctx.lineTo(x - size * 0.7, y + size * 0.7);
    ctx.stroke();
  };

  const drawNoTimeLayer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    if (!focus15State?.noTimeLayer.active || !focus15State.noTimeLayer.recursiveSigils) return;
    
    focus15State.noTimeLayer.recursiveSigils.forEach((sigil, index) => {
      const { pattern, mirrorState, parallaxDepth, resonanceSignature } = sigil;
      
      // Parallax depth field positioning
      const depthFactor = parallaxDepth / 100;
      const x = centerX + (Math.cos(time * 0.1 + index) * parallaxDepth);
      const y = centerY + (Math.sin(time * 0.1 + index) * parallaxDepth);
      
      ctx.save();
      ctx.translate(x, y);
      
      if (mirrorState) {
        ctx.scale(-1, 1);
      }
      
      // Draw recursive sigil based on resonance signature
      const intensity = resonanceSignature.reduce((sum, val) => sum + val, 0) / resonanceSignature.length;
      const alpha = 0.3 + intensity * 0.5;
      
      ctx.strokeStyle = `rgba(200, 100, 255, ${alpha})`;
      ctx.fillStyle = `rgba(200, 100, 255, ${alpha * 0.3})`;
      ctx.lineWidth = 1 + intensity * 2;
      
      // Recursive sigil pattern
      const sigilSize = 15 + intensity * 25;
      drawRecursiveSigil(ctx, 0, 0, sigilSize, resonanceSignature);
      
      ctx.restore();
    });
  };

  const drawRecursiveSigil = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, signature: number[]) => {
    // Non-linear sigil based on accumulated session data
    ctx.beginPath();
    
    signature.forEach((freq, i) => {
      const angle = (i / signature.length) * Math.PI * 2;
      const radius = size * (0.3 + (freq % 100) / 100 * 0.7);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      
      // Add recursive smaller sigils
      if (i % 2 === 0 && size > 10) {
        drawRecursiveSigil(ctx, px, py, size * 0.4, signature.slice(i, i + 3));
      }
    });
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  const drawResonanceMemoryVisualization = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    if (!drrState?.resonanceMemory) return;
    
    // Visualize DRR-derived resonance memory (detached from user input)
    drrState.resonanceMemory.forEach((memoryNode, index) => {
      const memoryAge = (Date.now() - memoryNode.timestamp) / 1000;
      const alpha = Math.max(0.1, 1 - memoryAge / 60); // Fade over 60 seconds
      
      // Memory nodes pulse based on internal DRR state, not breath
      const memoryPhase = time * 0.3 + memoryNode.phase;
      const pulseRadius = 8 + Math.sin(memoryPhase) * memoryNode.amplitude * 15;
      
      ctx.fillStyle = `rgba(80, 255, 160, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        centerX + memoryNode.x * 0.5, 
        centerY + memoryNode.y * 0.5, 
        pulseRadius, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // Memory connections (non-linear, based on resonance depth)
      if (index > 0 && memoryNode.resonanceDepth && memoryNode.resonanceDepth > 0.3) {
        const prevNode = drrState.resonanceMemory[index - 1];
        ctx.strokeStyle = `rgba(80, 255, 160, ${alpha * 0.5})`;
        ctx.lineWidth = memoryNode.resonanceDepth * 3;
        ctx.beginPath();
        ctx.moveTo(centerX + prevNode.x * 0.5, centerY + prevNode.y * 0.5);
        ctx.lineTo(centerX + memoryNode.x * 0.5, centerY + memoryNode.y * 0.5);
        ctx.stroke();
      }
    });
  };

  const drawDRRMandala = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!drrState) return;
    
    const time = Date.now() * 0.001;
    const baseRadius = 60 + drrState.vibrationalCoherence * 80;
    
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
    
    const ringCount = 6 + Math.floor(drrState.spectralPhaseStability * 6);
    for (let ring = 0; ring < ringCount; ring++) {
      const ringRadius = baseRadius + ring * (20 + drrState.goldenRatioAlignment * 15);
      const alpha = (1 - ring * 0.08) * (0.4 + drrState.vibrationalCoherence * 0.6);
      
      ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${alpha})`;
      ctx.lineWidth = 1 + drrState.spectralPhaseStability * 2;
      
      ctx.beginPath();
      
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        let currentRadius = ringRadius;
        
        drrState.dominantFrequencies.forEach((freq, index) => {
          const influence = Math.sin(angle * (3 + index) + time * freq * 0.001) * 
                           (10 + drrState.amplitudeVariance * 20);
          currentRadius += influence;
        });
        
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
    
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = radius * (0.5 + layer * 0.25);
      const rotation = time * (0.1 + layer * 0.05) + drrState.currentPhase;
      
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        
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
      
      const pulseRadius = baseRadius + Math.sin(Date.now() * 0.005 + node.phase) * 
                         (node.resonanceDepth || 0) * 10;
      
      const hue = (node.harmonicIndex || 1) * 30 + (node.frequency % 100) * 2;
      const saturation = 60 + node.stabilityScore * 40;
      const lightness = 40 + node.amplitude * 40;
      const alpha = 0.7 + node.stabilityScore * 0.3;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius * 2);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness + 30}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      
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
    
    ctx.beginPath();
    goldenSpiralNodes.forEach((spiralNode, index) => {
      const x = centerX + spiralNode.x;
      const y = centerY + spiralNode.y;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
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
    
    if (drrState.vibrationalCoherence > 0.6) {
      const symbolSize = 20 + drrState.vibrationalCoherence * 30;
      const alpha = (drrState.vibrationalCoherence - 0.6) * 2.5;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 200 + drrState.spectralPhaseStability * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
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
      case 0:
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const petalX = Math.cos(angle) * size * 0.5;
          const petalY = Math.sin(angle) * size * 0.5;
          ctx.arc(petalX, petalY, size * 0.3, 0, Math.PI * 2);
        }
        ctx.stroke();
        break;
      case 1:
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
      case 2:
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
      case 3:
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
        background: focus15State?.timeCollapseEvent 
          ? 'radial-gradient(circle at center, rgba(10, 5, 25, 1) 0%, rgba(0, 0, 0, 1) 100%)'
          : 'radial-gradient(circle at center, rgba(5, 5, 15, 1) 0%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default CymaticCanvas;
