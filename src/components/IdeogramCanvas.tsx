import { useCallback, useEffect, useRef, useState } from "react";
type Point = { x: number; y: number };
export default function IdeogramCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Point[][]>([]);
  const drawing = useRef(false);
  const [count, setCount] = useState(0);
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#111c18";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#d9ef97";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const points of strokes.current) {
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * rect.width, p.y * rect.height);
        else ctx.lineTo(p.x * rect.width, p.y * rect.height);
      });
      ctx.stroke();
    }
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    redraw();
    return () => observer.disconnect();
  }, [redraw]);
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };
  const stop = () => {
    drawing.current = false;
    setCount(strokes.current.length);
  };
  return (
    <section className="lab-card">
      <p className="eyebrow">03 / NOTICE</p>
      <h2>Give the impression a shape.</h2>
      <p>
        Draw with a mouse, pen, or finger. Your sketch stays here until you
        leave; export it to keep a copy.
      </p>
      <canvas
        ref={canvasRef}
        aria-label="Freehand sketch area"
        className="sketch-canvas"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          const p = point(e);
          strokes.current.push([p, { x: p.x + 0.0001, y: p.y }]);
          redraw();
        }}
        onPointerMove={(e) => {
          if (drawing.current) {
            strokes.current[strokes.current.length - 1]?.push(point(e));
            redraw();
          }
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      />
      <div className="lab-actions">
        <button
          className="subtle-button"
          disabled={!count}
          onClick={() => {
            strokes.current.pop();
            setCount(strokes.current.length);
            redraw();
          }}
        >
          Undo stroke
        </button>
        <button
          className="subtle-button"
          disabled={!count}
          onClick={() => {
            const a = document.createElement("a");
            a.href = canvasRef.current!.toDataURL("image/png");
            a.download = "sentinel-sketch.png";
            a.click();
          }}
        >
          Export sketch
        </button>
      </div>
      <label className="reflection-label" htmlFor="reflection">
        Prefer words? Write a reflection.
      </label>
      <textarea
        id="reflection"
        placeholder="A texture, a color, a feeling…"
        rows={3}
      />
      <p className="control-hint">
        Reflection text is temporary. Copy it before leaving this page.
      </p>
    </section>
  );
}
