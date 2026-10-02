import assert from "node:assert/strict";
import { test } from "node:test";
import { StudioAudio, type SoundSettings } from "../src/lib/studio/audio.ts";

class Param {
  value = 0;
  setTargetAtTime(value: number) {
    this.value = value;
  }
  cancelScheduledValues() {}
}
class AudioNodeMock {
  gain = new Param();
  frequency = new Param();
  stopped = false;
  disconnected = false;
  buffer: unknown;
  loop = false;
  connections: unknown[][] = [];
  connect(...args: unknown[]) {
    this.connections.push(args);
  }
  disconnect() {
    this.disconnected = true;
  }
  start() {}
  stop() {
    this.stopped = true;
  }
}
class Context {
  static instances: Context[] = [];
  static failResume = false;
  state = "suspended";
  currentTime = 0;
  sampleRate = 64;
  destination = {};
  oscillators: AudioNodeMock[] = [];
  noises: AudioNodeMock[] = [];
  gains: AudioNodeMock[] = [];
  constructor() {
    Context.instances.push(this);
  }
  async resume() {
    if (Context.failResume) throw Error("blocked");
    this.state = "running";
  }
  async close() {
    this.state = "closed";
  }
  createGain() {
    const node = new AudioNodeMock();
    this.gains.push(node);
    return node;
  }
  createChannelMerger() {
    return new AudioNodeMock();
  }
  createOscillator() {
    const node = new AudioNodeMock();
    this.oscillators.push(node);
    return node;
  }
  createBufferSource() {
    const node = new AudioNodeMock();
    this.noises.push(node);
    return node;
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
}
const settings: SoundSettings = {
  carrier: 200,
  beat: 10,
  volume: 0.3,
  muted: false,
  noise: "pink",
};
test("audio separates stereo channels, replaces noise, mutes, and survives rapid resume", async (t) => {
  t.mock.method(globalThis, "setTimeout", (callback: () => void) => {
    callbacks.push(callback);
    return 1;
  });
  const callbacks: Array<() => void> = [];
  const original = Object.getOwnPropertyDescriptor(globalThis, "AudioContext");
  Object.defineProperty(globalThis, "AudioContext", {
    value: Context,
    configurable: true,
  });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "AudioContext", original);
    else Reflect.deleteProperty(globalThis, "AudioContext");
  });
  const audio = new StudioAudio();
  assert.equal(await audio.start(settings), true);
  const first = Context.instances.at(-1)!;
  assert.equal(first.oscillators[0].frequency.value, 195);
  assert.equal(first.oscillators[1].frequency.value, 205);
  assert.equal(first.oscillators[0].connections[0][2], 0);
  assert.equal(first.oscillators[1].connections[0][2], 1);
  audio.update({ ...settings, noise: "brown", muted: true });
  assert.equal(first.noises.length, 2);
  assert.equal(first.noises[0].stopped, true);
  assert.equal(first.noises[0].disconnected, true);
  assert.equal(first.gains[0].gain.value, 0);
  audio.update({ ...settings, noise: "off" });
  assert.equal(first.noises[1].stopped, true);
  audio.stop();
  await audio.start(settings);
  const second = Context.instances.at(-1)!;
  callbacks.splice(0).forEach((callback) => callback());
  assert.equal(first.state, "closed");
  assert.equal(
    second.state,
    "running",
    "old cleanup must not close the resumed context",
  );
  audio.stop();
  callbacks.splice(0).forEach((callback) => callback());
  assert.equal(second.state, "closed");
});
test("cancelled starts cannot create orphan nodes; failed starts close their context", async (t) => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "AudioContext");
  Object.defineProperty(globalThis, "AudioContext", {
    value: Context,
    configurable: true,
  });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "AudioContext", original);
    else Reflect.deleteProperty(globalThis, "AudioContext");
  });
  const audio = new StudioAudio();
  const pending = audio.start(settings);
  audio.stop();
  assert.equal(await pending, false);
  assert.equal(Context.instances.at(-1)!.oscillators.length, 0);
  Context.failResume = true;
  await assert.rejects(audio.start(settings), /blocked/);
  assert.equal(Context.instances.at(-1)!.state, "closed");
  Context.failResume = false;
});
