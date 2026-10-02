import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play,
  Pause,
  Square,
  Headphones,
  Volume2,
  VolumeX,
  Download,
  History,
  Check,
  ArrowUpRight,
  Wind,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import StudioHeader from "@/components/studio/StudioHeader";
import ResonanceVisual from "@/components/studio/ResonanceVisual";
import { StudioAudio, type SoundSettings } from "@/lib/studio/audio";
import {
  BREATHS,
  PRESETS,
  HISTORY_KEY,
  parseHistory,
  getBreathPhase,
  formatTime,
  type SessionRecord,
} from "@/lib/studio/practice";
import "@/studio.css";

function readHistory() {
  try {
    return parseHistory(localStorage.getItem(HISTORY_KEY));
  } catch {
    return [];
  }
}
function exportRecord(record: SessionRecord) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify({ version: 1, ...record }, null, 2)], {
      type: "application/json",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `sentinel-${record.date.slice(0, 10)}-${record.id}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Session() {
  const [params] = useSearchParams();
  const initial =
    PRESETS.find((p) => p.id === params.get("preset")) || PRESETS[0];
  const [presetId, setPresetId] = useState<string>(initial.id);
  const [settings, setSettings] = useState<SoundSettings>({
    carrier: initial.carrier,
    beat: initial.beat,
    volume: 0.3,
    muted: false,
    noise: "off",
  });
  const [breathId, setBreathId] = useState<string>(initial.breath);
  const [minutes, setMinutes] = useState<number>(initial.minutes);
  const [visual, setVisual] = useState("orbit");
  const [status, setStatus] = useState<
    "ready" | "running" | "paused" | "finished"
  >("ready");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState(readHistory);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [report, setReport] = useState<SessionRecord | null>(null);
  const engine = useRef(new StudioAudio());
  const clock = useRef({ accumulated: 0, started: 0 });
  const [breathOrigin, setBreathOrigin] = useState(0);
  const operation = useRef(false);
  const finished = useRef(false);
  const mounted = useRef(true);
  const startButton = useRef<HTMLButtonElement>(null);
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
  const pattern = BREATHS.find((p) => p.id === breathId) || BREATHS[0];
  const phase = getBreathPhase(elapsed - breathOrigin, pattern);
  const running = status === "running";
  const inProgress = running || status === "paused";
  const target = minutes * 60;
  const update = (patch: Partial<SoundSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  useEffect(() => {
    mounted.current = true;
    const audio = engine.current;
    return () => {
      mounted.current = false;
      audio.stop();
    };
  }, []);
  useEffect(() => {
    engine.current.update(settings);
  }, [settings]);

  const finish = useCallback(
    (completed = false) => {
      if (finished.current) return;
      finished.current = true;
      const seconds = Math.min(
        target,
        clock.current.accumulated +
          (clock.current.started
            ? (performance.now() - clock.current.started) / 1000
            : 0),
      );
      clock.current = { accumulated: 0, started: 0 };
      engine.current.stop();
      setElapsed(seconds);
      setStatus("finished");
      const record: SessionRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        seconds: Math.floor(seconds),
        plannedSeconds: target,
        preset: preset.name,
        breath: pattern.name,
        carrier: settings.carrier,
        beat: settings.beat,
        completed,
      };
      const next = [record, ...history].slice(0, 20);
      setHistory(next);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        setNotice(
          "This browser could not save your history. You can still export this session.",
        );
      }
      setReport(record);
    },
    [history, pattern, preset, settings.beat, settings.carrier, target],
  );

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const seconds =
        clock.current.accumulated +
        (performance.now() - clock.current.started) / 1000;
      setElapsed(Math.min(seconds, target));
      if (seconds >= target) finish(true);
    };
    const timer = window.setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [running, target, finish]);

  // Pause when leaving the tab so a hidden page cannot count unattended practice.
  useEffect(() => {
    const pause = () => {
      if (!document.hidden || !clock.current.started) return;
      clock.current.accumulated +=
        (performance.now() - clock.current.started) / 1000;
      clock.current.started = 0;
      engine.current.stop();
      setElapsed(clock.current.accumulated);
      setStatus("paused");
      setNotice(
        "Session paused while you were away. Resume when you are ready.",
      );
    };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);

  const toggle = async () => {
    if (operation.current) return;
    if (running) {
      clock.current.accumulated +=
        (performance.now() - clock.current.started) / 1000;
      clock.current.started = 0;
      engine.current.stop();
      setElapsed(clock.current.accumulated);
      setStatus("paused");
      return;
    }
    operation.current = true;
    setBusy(true);
    setNotice("");
    try {
      const started = await engine.current.start(settings);
      if (!started || !mounted.current) return;
      if (document.hidden) {
        engine.current.stop();
        return;
      }
      if (status !== "paused") {
        clock.current.accumulated = 0;
        setBreathOrigin(0);
        setElapsed(0);
      }
      finished.current = false;
      clock.current.started = performance.now();
      setStatus("running");
    } catch {
      setNotice(
        "Sound could not start. Check your browser audio permissions, then try again.",
      );
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const selectPreset = (id: string) => {
    const next = PRESETS.find((p) => p.id === id);
    if (!next) return;
    setPresetId(id);
    update({ carrier: next.carrier, beat: next.beat });
    setBreathId(next.breath);
    setBreathOrigin(elapsed);
    if (!inProgress) setMinutes(next.minutes);
  };

  return (
    <div className="sentinel-app studio-page">
      <a href="#studio" className="skip-link">
        Skip to studio
      </a>
      <StudioHeader studio />
      <main id="studio" className="studio-main">
        <div className="studio-heading">
          <div>
            <p className="eyebrow">YOUR DAILY MOMENT</p>
            <h1>
              The resonance studio<span>.</span>
            </h1>
          </div>
          <button
            className="subtle-button"
            onClick={() => setHistoryOpen(true)}
          >
            <History size={16} />
            Your practice
            {history.length > 0 && (
              <span className="count-pill">{history.length}</span>
            )}
          </button>
        </div>
        <div className="studio-grid">
          <aside className="studio-settings" aria-label="Session settings">
            <div className="control-section">
              <p className="eyebrow">01 / INTENTION</p>
              <div className="preset-grid">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(p.id)}
                    aria-pressed={presetId === p.id}
                    className={presetId === p.id ? "selected" : ""}
                  >
                    {p.name}
                    {presetId === p.id && <Check size={13} />}
                  </button>
                ))}
              </div>
              <p className="control-description">{preset.description}</p>
            </div>
            <fieldset className="control-section" disabled={inProgress || busy}>
              <legend className="eyebrow">02 / TIME FOR YOURSELF</legend>
              <div className="duration-options">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMinutes(n)}
                    aria-pressed={minutes === n}
                    className={minutes === n ? "selected" : ""}
                  >
                    {n}
                    <small>min</small>
                  </button>
                ))}
              </div>
              {inProgress && (
                <p className="control-hint">
                  Finish this session to change its length.
                </p>
              )}
            </fieldset>
            <div className="control-section">
              <label htmlFor="breath" className="eyebrow">
                03 / BREATHING RHYTHM
              </label>
              <select
                id="breath"
                value={breathId}
                onChange={(e) => {
                  setBreathId(e.target.value);
                  setBreathOrigin(elapsed);
                }}
              >
                {BREATHS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="control-description">{pattern.detail}</p>
              <p className="control-hint">
                Follow gently, or breathe at your own pace.
              </p>
            </div>
            <details className="sound-details">
              <summary>
                Shape your sound<span>+</span>
              </summary>
              <div className="range-field">
                <label htmlFor="carrier">
                  Carrier tone <output>{settings.carrier.toFixed(1)} Hz</output>
                </label>
                <input
                  id="carrier"
                  type="range"
                  min="80"
                  max="600"
                  step="0.1"
                  value={settings.carrier}
                  onChange={(e) => update({ carrier: Number(e.target.value) })}
                />
              </div>
              <div className="range-field">
                <label htmlFor="beat">
                  Stereo beat <output>{settings.beat.toFixed(2)} Hz</output>
                </label>
                <input
                  id="beat"
                  type="range"
                  min="1"
                  max="40"
                  step="0.01"
                  value={settings.beat}
                  onChange={(e) => update({ beat: Number(e.target.value) })}
                />
              </div>
              <label htmlFor="noise">Background texture</label>
              <select
                id="noise"
                value={settings.noise}
                onChange={(e) =>
                  update({ noise: e.target.value as SoundSettings["noise"] })
                }
              >
                <option value="off">None · pure tone</option>
                <option value="pink">Pink noise · soft</option>
                <option value="brown">Brown noise · deep</option>
              </select>
              <p className="control-hint">
                The beat is the difference between the left and right tones. Use
                stereo headphones.
              </p>
            </details>
          </aside>
          <section
            className="session-stage"
            aria-label="Breathing and playback"
          >
            <div className="stage-top">
              <span className="eyebrow">
                <span className={`status-dot ${running ? "" : "muted-dot"}`} />
                {running
                  ? "IN THE MOMENT"
                  : status === "paused"
                    ? "TAKE YOUR TIME"
                    : "A SPACE TO BEGIN"}
              </span>
              <div className="visual-picker" aria-label="Visual style">
                {["orbit", "bloom"].map((v) => (
                  <button
                    key={v}
                    aria-pressed={visual === v}
                    onClick={() => setVisual(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="session-art">
              <ResonanceVisual
                active={running}
                mode={visual}
                expansion={phase.expansion}
              />
              <div className="breath-label">
                <Wind size={21} />
                <h2 aria-live="polite" aria-atomic="true">
                  {running
                    ? phase.label
                    : status === "paused"
                      ? "A quiet pause."
                      : status === "finished"
                        ? "Carry this with you."
                        : "Arrive here."}
                </h2>
                <span>
                  {running
                    ? `${phase.remaining} seconds`
                    : status === "paused"
                      ? "Your rhythm will be here."
                      : "Let your shoulders soften."}
                </span>
              </div>
            </div>
            <div className="playback">
              <div className="timer-row">
                <span>
                  {formatTime(elapsed)}
                  <small> practiced</small>
                </span>
                <span>
                  {formatTime(Math.max(0, target - elapsed))}
                  <small> remaining</small>
                </span>
              </div>
              <progress
                aria-label="Session progress"
                value={elapsed}
                max={target}
              />
              <div className="transport">
                <button
                  ref={startButton}
                  className="primary-action"
                  disabled={busy}
                  onClick={() => void toggle()}
                >
                  {running ? <Pause size={17} /> : <Play size={17} />}
                  {busy
                    ? "Preparing sound…"
                    : running
                      ? "Pause session"
                      : status === "paused"
                        ? "Resume session"
                        : status === "finished"
                          ? "Start another session"
                          : "Begin session"}
                </button>
                {inProgress && (
                  <button
                    className="finish-button"
                    onClick={() => finish(false)}
                  >
                    <Square size={14} />
                    Finish
                  </button>
                )}
              </div>
              <div className="volume-row">
                <button
                  aria-label={settings.muted ? "Unmute sound" : "Mute sound"}
                  aria-pressed={settings.muted}
                  onClick={() => update({ muted: !settings.muted })}
                >
                  {settings.muted ? (
                    <VolumeX size={17} />
                  ) : (
                    <Volume2 size={17} />
                  )}
                </button>
                <label htmlFor="volume" className="sr-only">
                  Volume
                </label>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.volume}
                  onChange={(e) => update({ volume: Number(e.target.value) })}
                />
                <output>
                  {settings.muted
                    ? "Muted"
                    : `${Math.round(settings.volume * 100)}%`}
                </output>
              </div>
            </div>
          </section>
        </div>
        {notice && (
          <p className="studio-notice" role="status">
            {notice}
          </p>
        )}
        <div className="studio-footnote">
          <span>
            <Headphones size={16} />
            Stereo headphones · comfortable volume
          </span>
          <p>
            Generated sound and visuals. No biometric measurements. Sessions
            pause when you leave this tab.
          </p>
        </div>
      </main>
      <Dialog
        open={!!report}
        onOpenChange={(open) => {
          if (!open) setReport(null);
        }}
      >
        <DialogContent
          className="studio-dialog"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            startButton.current?.focus();
          }}
        >
          <p className="eyebrow">A MOMENT, WELL SPENT</p>
          <DialogTitle>
            {report?.completed ? "You made space." : "Every moment counts."}
          </DialogTitle>
          <DialogDescription>
            Take one easy breath before moving on. Your practice is yours to
            return to.
          </DialogDescription>
          {report && (
            <>
              <div className="report-stats">
                <div>
                  <strong>{formatTime(report.seconds)}</strong>
                  <span>time practiced</span>
                </div>
                <div>
                  <strong>
                    {Math.round((report.seconds / report.plannedSeconds) * 100)}
                    %
                  </strong>
                  <span>of your intention</span>
                </div>
              </div>
              <div className="report-detail">
                <span>
                  {report.preset} · {report.breath}
                </span>
                <span>
                  Final sound: {report.carrier} Hz / {report.beat} Hz beat
                </span>
              </div>
              <p className="control-hint">
                Up to 20 sessions stay on this device. No account or upload.
              </p>
              <button
                className="primary-action"
                onClick={() => exportRecord(report)}
              >
                <Download size={16} />
                Export session
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={historyOpen}
        onOpenChange={(open) => {
          setHistoryOpen(open);
          setClearConfirm(false);
        }}
      >
        <DialogContent className="studio-dialog">
          <p className="eyebrow">SMALL MOMENTS ADD UP</p>
          <DialogTitle>Your practice</DialogTitle>
          <DialogDescription>
            Your last 20 sessions, saved only in this browser.
          </DialogDescription>
          {history.length === 0 ? (
            <div className="history-empty">
              <Wind size={30} />
              <h3>A fresh start.</h3>
              <p>Finish your first session and it will appear here.</p>
              <button
                className="subtle-button"
                onClick={() => setHistoryOpen(false)}
              >
                Return to your studio
                <ArrowUpRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="history-list">
                {history.map((record) => (
                  <div className="history-row" key={record.id}>
                    <div>
                      <strong>{record.preset}</strong>
                      <span>
                        {new Date(record.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {record.completed ? "Completed" : "Ended early"}
                      </span>
                    </div>
                    <span>{formatTime(record.seconds)}</span>
                    <button
                      aria-label={`Export ${record.preset} session from ${new Date(record.date).toLocaleString()}`}
                      onClick={() => exportRecord(record)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {clearConfirm ? (
                <div className="clear-confirm">
                  <p>Delete all practice history from this device?</p>
                  <button
                    className="subtle-button"
                    onClick={() => {
                      try {
                        localStorage.removeItem(HISTORY_KEY);
                        setHistory([]);
                        setClearConfirm(false);
                      } catch {
                        setNotice(
                          "History could not be cleared. Check your browser storage settings.",
                        );
                        setHistoryOpen(false);
                      }
                    }}
                  >
                    Delete history
                  </button>
                  <button
                    className="subtle-button"
                    onClick={() => setClearConfirm(false)}
                  >
                    Keep history
                  </button>
                </div>
              ) : (
                <button
                  className="text-button"
                  onClick={() => setClearConfirm(true)}
                >
                  Clear history
                </button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
