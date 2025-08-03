import React, { useRef, useEffect, useState, useCallback } from 'react';

const IdeogramCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [label, setLabel] = useState('');
  const [paths, setPaths] = useState<Path2D[]>([]);
  const [labels, setLabels] = useState<{ text: string, x: number, y: number }[]>([]);
  const [currentPath, setCurrentPath] = useState<Path2D | null>(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#1f2937';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'white';
    context.lineWidth = 2;
    paths.forEach(path => context.stroke(path));
    if (currentPath) {
        context.stroke(currentPath);
    }

    context.font = '16px Arial';
    context.fillStyle = 'white';
    labels.forEach(({ text, x, y }) => context.fillText(text, x, y));
  }, [paths, labels, currentPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        redrawCanvas();
      }
    });

    resizeObserver.observe(containerRef.current);

    redrawCanvas();

    return () => {
      resizeObserver.disconnect();
    };
  }, [redrawCanvas]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    const path = new Path2D();
    path.moveTo(offsetX, offsetY);
    setCurrentPath(path);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    currentPath.lineTo(offsetX, offsetY);

    redrawCanvas();
  };

  const stopDrawing = () => {
    if (currentPath) {
      setPaths([...paths, currentPath]);
      setCurrentPath(null);
    }
    setIsDrawing(false);
  };

  const handleCanvasClick = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (label) {
      const { offsetX, offsetY } = nativeEvent;
      setLabels([...labels, { text: label, x: offsetX, y: offsetY }]);
      setLabel('');
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setLabels([]);
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Ideogram Drawing Pad</h2>
      <div ref={containerRef} className="flex-grow">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
          className="bg-background rounded cursor-crosshair w-full h-full"
        />
      </div>
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
