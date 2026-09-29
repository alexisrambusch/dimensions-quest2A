"use client";

// Tiny synthesized sound-effect kit using the Web Audio API — no audio
// asset files, no network dependency, no licensing to worry about. Every
// effect is a short oscillator envelope, kept soft/friendly (sine/triangle
// waves, gentle volume) rather than sharp or punishing, especially for the
// "wrong answer" cue.

const MUTE_KEY = "dq_sound_muted";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    ctx = new AudioCtor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function toggleMuted(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

interface Note {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  peak?: number;
}

function playNotes(notes: Note[]) {
  if (isMuted()) return;
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;

  for (const { freq, start, duration, type = "sine", peak = 0.18 } of notes) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audio.destination);

    const t0 = now + start;
    const t1 = t0 + duration;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t1);

    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}

/** A bright, quick ascending ding for a correct answer. */
export function playCorrect() {
  playNotes([
    { freq: 660, start: 0, duration: 0.12 },
    { freq: 880, start: 0.09, duration: 0.22 },
  ]);
}

/** A soft, short descending tone — encouraging, never harsh. */
export function playWrong() {
  playNotes([
    { freq: 330, start: 0, duration: 0.16, type: "triangle", peak: 0.12 },
    { freq: 262, start: 0.1, duration: 0.18, type: "triangle", peak: 0.1 },
  ]);
}

/** A bright little coin blip. */
export function playCoin() {
  playNotes([
    { freq: 988, start: 0, duration: 0.07, type: "square", peak: 0.08 },
    { freq: 1318, start: 0.06, duration: 0.12, type: "square", peak: 0.08 },
  ]);
}

/** A short four-note fanfare for leveling up. */
export function playLevelUp() {
  playNotes([
    { freq: 523, start: 0, duration: 0.12 },
    { freq: 659, start: 0.1, duration: 0.12 },
    { freq: 784, start: 0.2, duration: 0.12 },
    { freq: 1047, start: 0.3, duration: 0.3 },
  ]);
}

/** A light, quick pop — for reveals like opening a mystery orb or unlocking a trophy. */
export function playPop() {
  playNotes([{ freq: 740, start: 0, duration: 0.09, type: "triangle", peak: 0.15 }]);
}

/** A near-silent tick for general button taps. */
export function playClick() {
  playNotes([{ freq: 520, start: 0, duration: 0.04, type: "sine", peak: 0.05 }]);
}
