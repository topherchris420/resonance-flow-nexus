import assert from "node:assert/strict";
import test from "node:test";
import {
  BREATHS,
  formatTime,
  getBreathPhase,
  parseHistory,
  type SessionRecord,
} from "../src/lib/studio/practice.ts";

test("breathing phases preserve exact boundaries and cycle after background delay", () => {
  const box = BREATHS[1];
  assert.equal(getBreathPhase(0, box).label, "Breathe in");
  assert.equal(getBreathPhase(4, box).label, "Hold gently");
  assert.equal(getBreathPhase(4, box).expansion, 1);
  assert.equal(getBreathPhase(8, box).label, "Breathe out");
  assert.equal(getBreathPhase(12, box).expansion, 0);
  assert.equal(getBreathPhase(16, box).label, "Breathe in");
  assert.deepEqual(getBreathPhase(1602, box), getBreathPhase(2, box));
  assert.equal(getBreathPhase(-2, box).progress, 0);
});
test("long exhale contracts continuously and timer never rounds up", () => {
  assert.equal(getBreathPhase(7, BREATHS[2]).expansion, 0.5);
  assert.equal(formatTime(59.99), "00:59");
  assert.equal(formatTime(600), "10:00");
  assert.equal(formatTime(-1), "00:00");
});
const record: SessionRecord = {
  id: "test",
  date: "2026-10-01T12:00:00Z",
  seconds: 300,
  plannedSeconds: 300,
  preset: "Ground",
  breath: "Even breathing",
  carrier: 136.1,
  beat: 7.83,
  completed: true,
};
test("stored history tolerates corrupt, missing, and unrelated data", () => {
  for (const value of [null, "", "{bad", "{}", "null", '[null, 3, "x"]'])
    assert.deepEqual(parseHistory(value), []);
  assert.deepEqual(
    parseHistory(
      JSON.stringify([
        record,
        { ...record, seconds: "bad" },
        { ...record, date: "no" },
      ]),
    ),
    [record],
  );
  assert.equal(
    parseHistory(JSON.stringify(Array.from({ length: 30 }, () => record)))
      .length,
    20,
  );
});
