import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Layers } from "lucide-react";

const CHIPS = [
  "Cymatics",
  "Binaural Beats",
  "Coherence",
  "Focus 12",
  "Focus 15",
  "Focus 21",
  "Biorhythms",
  "Breath Pacing",
];

type Module = {
  title: string;
  author: string;
  likes: string;
  clones: string;
  art: React.ReactNode;
};

const Ring = () => (
  <div className="absolute inset-0 grid place-items-center">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="absolute rounded-full border border-brand/40"
        style={{
          width: `${30 + i * 22}%`,
          height: `${30 + i * 22}%`,
          animation: `spin ${14 + i * 6}s linear infinite`,
        }}
      />
    ))}
    <div className="h-10 w-10 rounded-full bg-brand/80 blur-[1px]" />
  </div>
);

const Bars = () => (
  <div className="absolute inset-0 flex items-end justify-center gap-1.5 p-8">
    {Array.from({ length: 22 }).map((_, i) => (
      <div
        key={i}
        className="w-2 rounded-full bg-foreground/70"
        style={{ height: `${18 + Math.abs(Math.sin(i * 0.9)) * 70}%` }}
      />
    ))}
  </div>
);

const Grid = () => (
  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="border border-foreground/10"
        style={{ backgroundColor: i % 7 === 0 ? "hsl(var(--brand) / 0.6)" : undefined }}
      />
    ))}
  </div>
);

const Wave = () => (
  <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M0 ${100 + k * 6} C 60 ${30 + k * 18}, 140 ${170 - k * 18}, 200 ${100 + k * 6} S 340 ${30 + k * 18}, 400 ${100 + k * 6}`}
        fill="none"
        stroke={k === 1 ? "hsl(var(--brand))" : "currentColor"}
        strokeOpacity={k === 1 ? 1 : 0.35}
        strokeWidth="2"
      />
    ))}
  </svg>
);

const Pulse = () => (
  <div className="absolute inset-0 grid place-items-center">
    <div className="text-center">
      <div className="font-mono text-6xl font-bold tracking-tighter text-foreground">72</div>
      <div className="label-display mt-2 text-muted-foreground">bpm coherent</div>
    </div>
    <Heart className="absolute right-8 top-8 h-8 w-8 text-brand" />
  </div>
);

const Stack = () => (
  <div className="absolute inset-0 grid place-items-center">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute h-24 w-44 rounded-xl border border-foreground/20 bg-background/60 backdrop-blur"
        style={{ transform: `translateY(${i * 16 - 16}px) rotate(${(i - 1) * 5}deg)` }}
      />
    ))}
    <Layers className="relative h-8 w-8 text-brand" />
  </div>
);

const MODULES: Module[] = [
  { title: "Cymatic Mandala Engine", author: "Sentinel Core", likes: "2.4k", clones: "6.1k", art: <Ring /> },
  { title: "Spectral Phase Analyzer", author: "DRR Lab", likes: "1.8k", clones: "4.3k", art: <Bars /> },
  { title: "Sacred Geometry Overlay", author: "Vers3Dynamics", likes: "2.0k", clones: "5.5k", art: <Grid /> },
  { title: "Binaural Drift Synthesis", author: "Audio Engine", likes: "3.1k", clones: "9.2k", art: <Wave /> },
  { title: "Biorhythm Synchronizer", author: "Sentinel Core", likes: "1.2k", clones: "2.8k", art: <Pulse /> },
  { title: "Focus State Sequencer", author: "Monroe Protocol", likes: "1.6k", clones: "3.9k", art: <Stack /> },
];

const Landing: React.FC = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Sentinel<span className="text-brand">.</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#modules" className="transition-colors hover:text-foreground">Modules</a>
            <a href="#protocol" className="transition-colors hover:text-foreground">Protocol</a>
            <Link to="/srv" className="transition-colors hover:text-foreground">SRV</Link>
          </div>
          <Link
            to="/session"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-transform duration-300 hover:scale-105"
          >
            Enter session <span className="opacity-70">— it's free</span>
          </Link>
        </div>
      </nav>

      <header className="mx-auto max-w-5xl px-6 pb-16 pt-24 text-center">
        <span className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Made with Project Sentinel
        </span>
        <h1
          className="animate-rise-in mt-8 font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Discover <span className="text-brand">resonance</span> states
          <br className="hidden sm:block" /> built by the Sentinel community
        </h1>
        <p
          className="animate-rise-in mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          style={{ animationDelay: "160ms" }}
        >
          Browse, clone, and tune thousands of biofeedback sessions. Real-time cymatics,
          binaural modulation, and coherence tracking in one canvas.
        </p>

        <div
          className="animate-rise-in mt-10 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          {CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={`cursor-default rounded-lg border px-4 py-2.5 text-sm transition-colors duration-300 ${
                i === 0
                  ? "border-brand text-foreground"
                  : "border-transparent bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </header>

      <section id="modules" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-8">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Get started with free resonance modules
            </h2>
            <p className="mt-2 text-muted-foreground">
              Jumpstart your practice by cloning a session from the Sentinel library.
            </p>
          </div>
          <span className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">
            Most liked
          </span>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <article
              key={m.title}
              className="animate-rise-in group"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Link to="/session" className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary/30 text-foreground transition-all duration-500 group-hover:-translate-y-2 group-hover:border-brand/60 group-hover:shadow-[0_30px_80px_-30px_hsl(var(--brand)/0.6)]">
                  {m.art}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-center gap-1 bg-gradient-to-t from-background to-transparent p-4 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Open in session <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold tracking-tight">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.author}</p>
                  </div>
                  <div className="flex shrink-0 gap-3 pt-1 font-mono text-xs text-muted-foreground">
                    <span>♥ {m.likes}</span>
                    <span>⧉ {m.clones}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="protocol" className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-3">
          {[
            { k: "01", t: "Sense", d: "Microphone and heart-rate input feed a real-time FFT of your acoustic and physiological signal." },
            { k: "02", t: "Modulate", d: "Binaural carriers shift with your coherence, guiding progression through Focus 12, 15, and 21." },
            { k: "03", t: "Reflect", d: "Cymatic geometry renders your state as living form — a mirror you can actually watch." },
          ].map((s) => (
            <div key={s.k}>
              <div className="font-mono text-sm text-brand">{s.k}</div>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{s.t}</h3>
              <p className="mt-3 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Ready to see your <span className="text-brand">signal</span>?
          </h2>
          <Link
            to="/session"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-semibold text-brand-foreground transition-transform duration-300 hover:scale-105"
          >
            Enter the session <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
          <span>Project Sentinel — Vers3Dynamics</span>
          <span>Cognitive readiness through resonance</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
