import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Headphones, Activity, Waves, ArrowRight } from "lucide-react";

type Panel = {
  id: string;
  word: string;
  caption: string;
  index: string;
  bg: string;
  fg: string;
};

const PANELS: Panel[] = [
  {
    id: "resonate",
    word: "RESONATE",
    caption: "A cognitive readiness instrument for the human signal.",
    index: "01",
    bg: "var(--panel-1)",
    fg: "var(--panel-1-fg)",
  },
  {
    id: "sense",
    word: "SENSE",
    caption: "Microphone and heart-rate input become a live spectral portrait.",
    index: "02",
    bg: "var(--panel-2)",
    fg: "var(--panel-2-fg)",
  },
  {
    id: "modulate",
    word: "MODULATE",
    caption: "Binaural carriers track coherence through Focus 12, 15 and 21.",
    index: "03",
    bg: "var(--panel-3)",
    fg: "var(--panel-3-fg)",
  },
  {
    id: "reflect",
    word: "REFLECT",
    caption: "Cymatic geometry renders your state as living, watchable form.",
    index: "04",
    bg: "var(--panel-4)",
    fg: "var(--panel-4-fg)",
  },
  {
    id: "begin",
    word: "BEGIN",
    caption: "Headphones on. One breath. The canvas is listening.",
    index: "05",
    bg: "var(--panel-5)",
    fg: "var(--panel-5-fg)",
  },
];

const Landing: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const enterSession = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate("/session"), 450);
  };

  const ONBOARDING = [
    {
      icon: Headphones,
      title: "Put headphones on",
      body: "Binaural carriers need stereo separation to work.",
    },
    {
      icon: Activity,
      title: "Share breath or pulse",
      body: "Optional mic or heart-rate input sharpens the read.",
    },
    {
      icon: Waves,
      title: "Watch your signal form",
      body: "Cymatic geometry moves with your coherence, live.",
    },
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            setActive(i);
          }
        });
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = rootRef.current?.querySelector(`[data-index="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const current = PANELS[active];

  return (
    <div
      ref={rootRef}
      className="snap-root relative font-display"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Fixed minimal nav */}
      <nav
        className="pointer-events-none fixed inset-x-0 top-0 z-50 transition-colors duration-700"
        style={{ color: `hsl(${current.fg})` }}
      >
        <div className="flex items-center justify-between px-6 py-6 sm:px-12">
          <Link to="/" className="pointer-events-auto text-lg font-bold tracking-tight">
            Project Sentinel
          </Link>
          <div className="pointer-events-auto flex items-center gap-5 text-sm">
            {PANELS.slice(0, 4).map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className="hidden opacity-80 transition-opacity hover:opacity-100 sm:inline"
              >
                {p.word.toLowerCase()}
                <sup className="ml-0.5 font-mono text-[0.6em]">{i + 1}</sup>
              </button>
            ))}
            <button
              onClick={enterSession}
              className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-transform duration-300 hover:scale-105"
              style={{ borderColor: `hsl(${current.fg} / 0.5)` }}
            >
              Enter session
            </button>
          </div>
        </div>
      </nav>

      {/* Side dot navigation */}
      <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 sm:flex sm:right-12">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            aria-label={`Go to ${p.word}`}
            onClick={() => goTo(i)}
            className="h-2.5 w-2.5 rounded-full border transition-all duration-500"
            style={{
              borderColor: `hsl(${current.fg} / 0.7)`,
              backgroundColor: i === active ? `hsl(${current.fg})` : "transparent",
              transform: i === active ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {PANELS.map((p, i) => (
        <section
          key={p.id}
          data-index={i}
          className="snap-panel relative flex h-screen w-full items-center justify-center overflow-hidden px-6"
          style={{
            height: "100dvh",
            backgroundColor: `hsl(${p.bg})`,
            color: `hsl(${p.fg})`,
          }}
        >
          {/* Vertical rails */}
          <span className="vertical-rail absolute left-6 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.35em] opacity-70 sm:left-12">
            {i === PANELS.length - 1 ? "Scroll up" : "Scroll down"}
          </span>
          <span className="vertical-rail absolute left-6 top-8 font-mono text-xs opacity-70 sm:hidden">
            {p.index}
          </span>
          <span className="absolute bottom-8 left-6 font-mono text-xs opacity-70 sm:left-12">
            {p.index} / 05
          </span>

          <div className="flex max-w-6xl flex-col items-center text-center">
            <h1
              className="font-display font-bold uppercase leading-[0.85] tracking-[-0.05em]"
              style={{ fontSize: "clamp(3.5rem, 15vw, 14rem)", color: "inherit" }}
            >
              {p.word}
            </h1>
            <p className="mt-8 max-w-xl font-sans text-base opacity-80 sm:text-lg">
              {p.caption}
            </p>
            {i === PANELS.length - 1 && (
              <>
                <ul className="mt-10 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-3">
                  {ONBOARDING.map((step, si) => (
                    <li
                      key={step.title}
                      className="rounded-2xl border p-5 backdrop-blur-sm animate-fade-in"
                      style={{
                        borderColor: `hsl(${p.fg} / 0.25)`,
                        backgroundColor: `hsl(${p.fg} / 0.06)`,
                        animationDelay: `${si * 120}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <step.icon className="h-4 w-4" />
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                          0{si + 1}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-lg font-semibold tracking-tight">
                        {step.title}
                      </h2>
                      <p className="mt-1 font-sans text-sm opacity-75">{step.body}</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={enterSession}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full px-10 py-4 font-sans text-base font-semibold transition-transform duration-300 hover:scale-105"
                  style={{ backgroundColor: `hsl(${p.fg})`, color: `hsl(${p.bg})` }}
                >
                  Enter the session
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="mt-4 font-sans text-xs opacity-60">
                  Takes about 30 seconds to calibrate. No account needed.
                </p>
              </>
            )}
          </div>

          <span className="absolute bottom-8 right-6 font-mono text-xs opacity-70 sm:right-12">
            Vers3Dynamics
          </span>
        </section>
      ))}

      {/* Transition veil */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[60] bg-black transition-opacity duration-500 ${
          leaving ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default Landing;
