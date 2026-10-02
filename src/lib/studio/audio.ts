export type SoundSettings = {
  carrier: number;
  beat: number;
  volume: number;
  muted: boolean;
  noise: "off" | "pink" | "brown";
};

/** One graph per run. Old graphs never share nodes with a resumed session. */
export class StudioAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private left: OscillatorNode | null = null;
  private right: OscillatorNode | null = null;
  private noise: AudioBufferSourceNode | null = null;
  private noiseKind: SoundSettings["noise"] = "off";
  async start(settings: SoundSettings) {
    this.stop();
    const context = new AudioContext();
    this.context = context;
    try {
      await context.resume();
      if (this.context !== context) return false;
      if (context.state !== "running")
        throw new Error("Audio could not start. Please try again.");
      const master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      this.master = master;
      const merger = context.createChannelMerger(2);
      merger.connect(master);
      this.left = context.createOscillator();
      this.right = context.createOscillator();
      this.left.connect(merger, 0, 0);
      this.right.connect(merger, 0, 1);
      this.left.frequency.value = settings.carrier - settings.beat / 2;
      this.right.frequency.value = settings.carrier + settings.beat / 2;
      this.left.start();
      this.right.start();
      this.update(settings);
      return true;
    } catch (error) {
      this.stop();
      throw error;
    }
  }
  update(settings: SoundSettings) {
    const ctx = this.context;
    if (!ctx || !this.master) return;
    this.master.gain.setTargetAtTime(
      settings.muted ? 0 : settings.volume * 0.3,
      ctx.currentTime,
      0.08,
    );
    this.left?.frequency.setTargetAtTime(
      settings.carrier - settings.beat / 2,
      ctx.currentTime,
      0.08,
    );
    this.right?.frequency.setTargetAtTime(
      settings.carrier + settings.beat / 2,
      ctx.currentTime,
      0.08,
    );
    if (settings.noise === this.noiseKind) return;
    this.noise?.stop();
    this.noise?.disconnect();
    this.noise = null;
    this.noiseKind = settings.noise;
    if (settings.noise === "off") return;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0,
      b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      if (settings.noise === "brown") {
        brown = (brown + 0.02 * white) / 1.02;
        data[i] = brown * 0.7;
      } else {
        b0 = 0.99765 * b0 + white * 0.099046;
        b1 = 0.963 * b1 + white * 0.2965164;
        b2 = 0.57 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.025;
      }
    }
    this.noise = ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;
    this.noise.connect(this.master);
    this.noise.start();
  }
  stop() {
    const ctx = this.context;
    const master = this.master;
    this.context = null;
    this.master = null;
    this.left = null;
    this.right = null;
    this.noise = null;
    this.noiseKind = "off";
    if (!ctx || ctx.state === "closed") return;
    if (master && ctx.state === "running") {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.025);
      setTimeout(() => {
        void ctx.close().catch(() => {});
      }, 150);
    } else {
      void ctx.close().catch(() => {});
    }
  }
}
