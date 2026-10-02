export const PRESETS = [
  {
    id: "schumann",
    name: "Ground",
    intent: "Arrive in the moment",
    carrier: 136.1,
    beat: 7.83,
    breath: "even",
    minutes: 5,
    description: "A low, rounded tone. A little space to settle.",
  },
  {
    id: "alpha-flow",
    name: "Focus",
    intent: "Make room for one thing",
    carrier: 432,
    beat: 10,
    breath: "box",
    minutes: 10,
    description: "A clear, steady tone for an intentional pause.",
  },
  {
    id: "lucid-theta",
    name: "Unwind",
    intent: "Let the day soften",
    carrier: 216,
    beat: 6,
    breath: "long",
    minutes: 10,
    description: "A softer register with an unhurried exhale.",
  },
  {
    id: "deep-delta",
    name: "Rest",
    intent: "Find a quieter pace",
    carrier: 108,
    beat: 2,
    breath: "even",
    minutes: 15,
    description: "A deep tone and a slow, even breathing guide.",
  },
  {
    id: "solfeggio-528",
    name: "Clarity",
    intent: "Begin again",
    carrier: 528,
    beat: 12,
    breath: "even",
    minutes: 5,
    description: "A brighter tone for a fresh moment of attention.",
  },
  {
    id: "gamma-sharpness",
    name: "Explore",
    intent: "Follow your curiosity",
    carrier: 256,
    beat: 40,
    breath: "box",
    minutes: 10,
    description: "A faster stereo beat for exploring a different texture.",
  },
] as const;

export const BREATHS = [
  {
    id: "even",
    name: "Even breathing",
    detail: "5 in · 5 out",
    phases: [
      { label: "Breathe in", seconds: 5 },
      { label: "Breathe out", seconds: 5 },
    ],
  },
  {
    id: "box",
    name: "Box breathing",
    detail: "4 in · 4 hold · 4 out · 4 hold",
    phases: [
      { label: "Breathe in", seconds: 4 },
      { label: "Hold gently", seconds: 4 },
      { label: "Breathe out", seconds: 4 },
      { label: "Hold gently", seconds: 4 },
    ],
  },
  {
    id: "long",
    name: "Long exhale",
    detail: "4 in · 6 out",
    phases: [
      { label: "Breathe in", seconds: 4 },
      { label: "Breathe out", seconds: 6 },
    ],
  },
];

export function getBreathPhase(
  seconds: number,
  pattern: (typeof BREATHS)[number],
) {
  const cycle = pattern.phases.reduce((sum, phase) => sum + phase.seconds, 0);
  let position = Math.max(0, seconds) % cycle;
  for (const [index, phase] of pattern.phases.entries()) {
    if (position < phase.seconds) {
      const progress = position / phase.seconds;
      const expansion =
        phase.label === "Breathe in"
          ? progress
          : phase.label === "Breathe out"
            ? 1 - progress
            : index === 1
              ? 1
              : 0;
      return {
        ...phase,
        progress,
        expansion,
        remaining: Math.ceil(phase.seconds - position),
      };
    }
    position -= phase.seconds;
  }
  throw new Error("Breathing pattern must contain positive phase durations.");
}
export function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)
    .toString()
    .padStart(2, "0")}:${(whole % 60).toString().padStart(2, "0")}`;
}
export type SessionRecord = {
  id: string;
  date: string;
  seconds: number;
  plannedSeconds: number;
  preset: string;
  breath: string;
  carrier: number;
  beat: number;
  completed: boolean;
};
export const HISTORY_KEY = "sentinel.sessions.v1";
export function parseHistory(value: string | null): SessionRecord[] {
  try {
    const records: unknown = JSON.parse(value || "[]");
    if (!Array.isArray(records)) return [];
    return records
      .filter((record): record is SessionRecord => {
        if (!record || typeof record !== "object") return false;
        const r = record as Record<string, unknown>;
        return (
          typeof r.id === "string" &&
          typeof r.date === "string" &&
          Number.isFinite(Date.parse(r.date)) &&
          typeof r.seconds === "number" &&
          Number.isFinite(r.seconds) &&
          r.seconds >= 0 &&
          typeof r.plannedSeconds === "number" &&
          Number.isFinite(r.plannedSeconds) &&
          r.plannedSeconds > 0 &&
          typeof r.carrier === "number" &&
          Number.isFinite(r.carrier) &&
          typeof r.beat === "number" &&
          Number.isFinite(r.beat) &&
          typeof r.preset === "string" &&
          typeof r.breath === "string" &&
          typeof r.completed === "boolean"
        );
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}
