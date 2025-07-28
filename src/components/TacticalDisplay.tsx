import React, { useRef, useEffect } from 'react';

interface TacticalDisplayProps {
  isActive: boolean;
}

const TacticalDisplay: React.FC<TacticalDisplayProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angle = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 50;

      // Draw radar sweep
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + Math.PI / 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, 2 * Math.PI);
        ctx.stroke();
      }

      angle += 0.01;

      requestAnimationFrame(draw);
    };

    draw();
  }, [isActive]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default TacticalDisplay;
