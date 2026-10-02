import { memo } from "react";
type Props = { active?: boolean; mode?: string; expansion?: number };
const ResonanceVisual = memo(
  ({ active = true, mode = "orbit", expansion = 0.5 }: Props) => (
    <div
      className={`resonance-art ${active ? "is-moving" : ""} visual-${mode}`}
      aria-hidden="true"
    >
      <div className="art-halo" />
      <svg viewBox="0 0 600 600" fill="none">
        <circle
          cx="300"
          cy="300"
          r="270"
          className="art-guide"
          strokeDasharray="2 12"
        />
        <circle cx="300" cy="300" r="224" className="art-guide" />
        <path
          d="M300 16v20m0 528v20M16 300h20m528 0h20"
          className="art-guide"
        />
        <g className="art-rotation">
          {Array.from({ length: mode === "bloom" ? 18 : 12 }, (_, i) => (
            <ellipse
              key={i}
              cx="300"
              cy="300"
              rx={mode === "bloom" ? 88 : 115}
              ry="205"
              transform={`rotate(${i * (mode === "bloom" ? 20 : 30)} 300 300)`}
              stroke="currentColor"
              strokeWidth="0.8"
              opacity={0.2 + i * 0.035}
            />
          ))}
        </g>
        <g
          style={{
            transform: `translate(300px, 300px) scale(${0.7 + expansion * 0.3})`,
          }}
        >
          <circle r="76" stroke="currentColor" strokeWidth="0.7" opacity=".5" />
          <circle r="63" fill="currentColor" opacity=".035" />
          <circle r="4" fill="currentColor" />
        </g>
        <circle cx="300" cy="76" r="4" fill="currentColor" />
        <circle cx="300" cy="524" r="3" fill="currentColor" />
      </svg>
    </div>
  ),
);
ResonanceVisual.displayName = "ResonanceVisual";
export default ResonanceVisual;
