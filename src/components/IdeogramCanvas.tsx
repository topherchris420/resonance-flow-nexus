import React, { useRef, useEffect, useState } from 'react';

const IdeogramCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [label, setLabel] = useState('');
  const [labelPosition, setLabelPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = 500;
    canvas.height = 300;

    // Set initial canvas style
    context.fillStyle = '#1f2937'; // bg-gray-800
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const handleCanvasClick = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (label) {
      const { offsetX, offsetY } = nativeEvent;
      setLabelPosition({ x: offsetX, y: offsetY });
      const context = canvasRef.current?.getContext('2d');
      if (!context) return;
      context.font = '16px Arial';
      context.fillStyle = 'white';
      context.fillText(label, offsetX, offsetY);
      setLabel('');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#1f2937';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Ideogram Drawing Pad</h2>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onClick={handleCanvasClick}
        className="bg-background rounded cursor-crosshair"
      />
      <div className="mt-4 flex items-center space-x-4">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label and click on canvas"
          className="bg-input text-foreground p-2 rounded w-full"
        />
        <button
          onClick={clearCanvas}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default IdeogramCanvas;
