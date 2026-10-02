import { useState } from "react";
export default function GuidedMeditation() {
  const [failed, setFailed] = useState(false);
  return (
    <section className="lab-card">
      <p className="eyebrow">01 / LISTEN</p>
      <h2>Make a little space.</h2>
      <p>
        Settle in with the original meditation recording, or work in silence.
      </p>
      <audio
        controls
        preload="none"
        src="/audio/medi.mp3"
        aria-label="Meditation recording"
        onError={() => setFailed(true)}
      />
      {failed && (
        <p role="status">
          The recording could not load. You can continue with the drawing
          practice.
        </p>
      )}
    </section>
  );
}
