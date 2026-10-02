import { useState } from "react";
export default function TargetCoordinateGenerator() {
  const [coordinates, setCoordinates] = useState("");
  const generate = () =>
    setCoordinates(
      `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`,
    );
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              coordinates,
              generatedAt: new Date().toISOString(),
              source: "Random creative prompt; not a verified target.",
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentinel-coordinate-prompt.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="lab-card">
      <p className="eyebrow">02 / WONDER</p>
      <h2>A point of departure.</h2>
      <p>
        Generate random coordinates as a creative prompt. Let shapes, textures,
        and impressions emerge.
      </p>
      <output className="coordinate-output" aria-live="polite">
        {coordinates || "Your next starting point awaits."}
      </output>
      <div className="lab-actions">
        <button className="subtle-button" onClick={generate}>
          Generate coordinates
        </button>
        <button
          className="subtle-button"
          disabled={!coordinates}
          onClick={download}
        >
          Export prompt
        </button>
      </div>
    </section>
  );
}
