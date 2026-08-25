/**
 * Hover sound. On by default, with no control widget — hovering things on this
 * site makes a noise, and that is the intent.
 *
 * Two voices, so signature interactions don't sound like the furniture:
 *
 * - `thud` — a sine in the bass register whose pitch drops fast, plus a 25ms
 *   burst of low-passed noise at the attack. The noise is what makes it read as
 *   a physical knock; a pure tone at any pitch just sounds like a game blip.
 *   Used for nav, list rows and headings.
 * - `blip` — a bright triangle sliding down a minor third. Reserved for the
 *   name reveal, which earns a sound of its own.
 *
 * Browsers refuse to start an AudioContext until the visitor has interacted
 * with the page, so the engine arms itself on the first click, key press or
 * touch. Hovers before that are silently skipped — there is no way around it,
 * and nothing to fix if the first hover of a fresh load is quiet.
 */

type Voice = { kind: "thud" | "blip"; freq: number };

const VOICES: Record<string, Voice> = {
  nav: { kind: "thud", freq: 190 },
  row: { kind: "thud", freq: 150 },
  head: { kind: "thud", freq: 116 },
  name: { kind: "blip", freq: 880 },
};

/** Minimum gap between two hits. Bass needs more room than a click to not smear. */
const MIN_GAP_MS = 72;

const BODY_GAIN = 0.075;
const KNOCK_GAIN = 0.03;
const BODY_MS = 0.1;

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let armed = false;
let lastAt = 0;
let lastTarget: Element | null = null;

function audio(): AudioContext | null {
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One short buffer of white noise, generated once and reused for every hit. */
function noise(ac: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = Math.floor(ac.sampleRate * 0.05);
    noiseBuffer = ac.createBuffer(1, length, ac.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) channel[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function thud(freq: number, level = 1) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;

  // --- body: a sine that drops a fifth almost immediately, like a struck object
  const osc = ac.createOscillator();
  const oscGain = ac.createGain();
  const detuned = freq * (0.99 + Math.random() * 0.02);
  osc.type = "sine";
  osc.frequency.setValueAtTime(detuned, t);
  osc.frequency.exponentialRampToValueAtTime(detuned * 0.62, t + BODY_MS);
  oscGain.gain.setValueAtTime(0.0001, t);
  oscGain.gain.exponentialRampToValueAtTime(BODY_GAIN * level, t + 0.008);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + BODY_MS);
  osc.connect(oscGain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + BODY_MS + 0.02);

  // --- attack: a 25ms scrap of noise, low-passed hard so it's felt not heard
  const knock = ac.createBufferSource();
  knock.buffer = noise(ac);
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(420, t);
  lp.Q.value = 0.9;
  const knockGain = ac.createGain();
  knockGain.gain.setValueAtTime(KNOCK_GAIN * level, t);
  knockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  knock.connect(lp).connect(knockGain).connect(ac.destination);
  knock.start(t);
  knock.stop(t + 0.05);
}

/**
 * The bright voice: a triangle tone sliding down a minor third. Reads as
 * synthetic rather than physical, which is exactly why it's reserved for one
 * element instead of used everywhere.
 */
function blip(freq: number, level = 1) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  const duration = 0.055;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const detuned = freq * (0.98 + Math.random() * 0.04);
  osc.type = "triangle";
  osc.frequency.setValueAtTime(detuned, t);
  osc.frequency.exponentialRampToValueAtTime(detuned * 0.82, t + duration);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.045 * level, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function play(voice: string) {
  if (!armed) return;
  const now = performance.now();
  if (now - lastAt < MIN_GAP_MS) return;
  lastAt = now;
  const v = VOICES[voice] ?? VOICES.row;
  if (v.kind === "blip") blip(v.freq);
  else thud(v.freq);
}

/** Unlock the AudioContext on the first real gesture, whatever it is. */
function arm() {
  armed = true;
  audio();
  window.removeEventListener("pointerdown", arm);
  window.removeEventListener("keydown", arm);
  window.removeEventListener("touchstart", arm);
}

export function mountSound() {
  window.addEventListener("pointerdown", arm, { once: true, passive: true });
  window.addEventListener("keydown", arm, { once: true });
  window.addEventListener("touchstart", arm, { once: true, passive: true });

  // Hover sound needs something that can actually hover.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  // Delegated, so anything carrying data-sfx works — including markup added
  // after mount — with one listener instead of dozens.
  document.addEventListener(
    "pointerover",
    (event) => {
      const target = (event.target as Element | null)?.closest("[data-sfx]");
      if (!target || target === lastTarget) return;
      lastTarget = target;
      play(target.getAttribute("data-sfx") ?? "row");
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      const target = (event.target as Element | null)?.closest("[data-sfx]");
      if (target && target === lastTarget) lastTarget = null;
    },
    { passive: true },
  );
}
