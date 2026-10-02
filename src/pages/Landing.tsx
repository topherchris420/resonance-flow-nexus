import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Headphones,
  ShieldCheck,
  Waves,
} from "lucide-react";
import ResonanceVisual from "@/components/studio/ResonanceVisual";
import StudioHeader from "@/components/studio/StudioHeader";
import { PRESETS } from "@/lib/studio/practice";
import "@/studio.css";

export default function Landing() {
  return (
    <div className="sentinel-app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <StudioHeader />
      <main id="main">
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> SOUND. BREATH. STILLNESS.
            </p>
            <h1>
              Less noise.
              <br />
              More <em>resonance.</em>
            </h1>
            <p className="hero-description">
              A small ritual for a busy mind. Find your rhythm with immersive
              sound, guided breathing, and geometry in motion.
            </p>
            <div className="hero-actions">
              <Link to="/session" className="primary-action">
                Find your frequency
                <ArrowUpRight size={19} />
              </Link>
              <span>No account. Just a moment for you.</span>
            </div>
            <div className="hero-notes">
              <span>
                <Headphones size={15} /> Best with headphones
              </span>
              <span>
                <ShieldCheck size={15} /> Private by design
              </span>
            </div>
          </div>
          <div className="hero-instrument">
            <div className="instrument-label">
              <span>RESONANCE STUDY / 001</span>
              <span>LIVE GENERATIVE FORM</span>
            </div>
            <ResonanceVisual />
            <div className="instrument-caption">
              <span>
                <i /> A little space to settle.
              </span>
              <span>136.1 Hz / 7.83 Hz</span>
            </div>
          </div>
        </section>
        <div className="landing-divider">
          <span>YOUR ATTENTION IS WORTH A MOMENT.</span>
          <a href="#practices">
            Choose your practice <ArrowDown size={15} />
          </a>
        </div>
        <section id="practices" className="practice-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SET AN INTENTION</p>
              <h2>What do you need today?</h2>
            </div>
            <p>Start with a sound. Make it your own.</p>
          </div>
          <div className="practice-grid">
            {PRESETS.slice(0, 3).map((preset, i) => (
              <Link
                className="practice-card"
                key={preset.id}
                to={`/session?preset=${preset.id}`}
              >
                <div className="card-top">
                  <span>0{i + 1}</span>
                  <ArrowUpRight size={20} />
                </div>
                <div className={`mini-wave wave-${i}`} aria-hidden="true">
                  {Array.from({ length: 23 }, (_, n) => (
                    <i
                      key={n}
                      style={{
                        height: `${10 + Math.sin(n * 0.65 + i) ** 2 * 44}px`,
                      }}
                    />
                  ))}
                </div>
                <h3>{preset.name}</h3>
                <p>{preset.intent}</p>
                <div className="card-meta">
                  <span>{preset.minutes} MIN PRACTICE</span>
                  <span>{preset.beat} Hz BEAT</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="how-section">
          <div>
            <p className="eyebrow">02 / A SIMPLE RITUAL</p>
            <h2>
              Tune in.
              <br />
              Let everything else wait.
            </h2>
            <p>
              There is no score to chase. No perfect state to reach. Just a
              sound, a breath, and a little time.
            </p>
          </div>
          <ol>
            {[
              [
                "Make yourself comfortable",
                "Put on stereo headphones and start with a low volume.",
              ],
              [
                "Find a rhythm that feels good",
                "Choose a breathing guide or simply breathe naturally.",
              ],
              [
                "Leave with a moment to reflect",
                "Review your practice time and keep a record on this device.",
              ],
            ].map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="quiet-note">
          <Waves size={23} />
          <p>
            An experimental sound and breathing studio. Visuals follow your
            settings; they do not measure your body or mental state. No
            microphone or sensor access is needed.
          </p>
          <Link to="/session">
            Step inside
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
      <footer className="sentinel-footer">
        <span>
          PROJECT SENTINEL <small>BY VERS3DYNAMICS</small>
        </span>
        <span>Less noise. More presence.</span>
      </footer>
    </div>
  );
}
