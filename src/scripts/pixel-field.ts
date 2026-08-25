/**
 * A 16×16 sprite as a live pixel buffer the cursor can physically disturb.
 *
 * The buffer starts as a copy of the sprite. Pixels under the cursor get shoved
 * along its direction of travel and heated toward white; each disturbed cell
 * remembers how far it has strayed, and that memory decays, so the icon reheals
 * toward the sprite on its own. Clicking scatters every lit pixel at once.
 *
 * Differences from the Minecraft-fire reference this is modelled on:
 *
 * - No sprite sheet and no audio files. Sprites are text (data/pixel-sprites.ts)
 *   and every sound is synthesised, matching how scripts/sound.ts already works.
 * - Fire needs a 32-frame flipbook because fire is never still. An icon is, so
 *   the source is a single frame and the motion all comes from the interaction.
 * - The loop is not free-running. Four icons each holding a rAF at 60fps would
 *   burn battery to animate nothing, so it runs only while a pointer is inside
 *   or while pixels are still healing, and stops when scrolled out of view.
 */
import type { Sprite } from "../data/pixel-sprites";

const N = 16;

/**
 * Screen pixels per sprite pixel for a page heading, per treatment.
 *
 * - `a` — the heading keeps its usual size and the icon comes down to meet it.
 *   28px of ink beside type whose cap height is about 30px.
 * - `b` — the icon leads at 42px of ink and the heading grows to match.
 *
 * The reserved boxes in global.css (`.page-head__icon`) are N × these, so the
 * heading does not shift when the engine sizes the canvas. Keep them in step.
 */
export const HEAD_SCALES = { a: 2, b: 3 } as const;

export type HeadVariant = keyof typeof HEAD_SCALES;

/** How far the cursor's influence reaches, in sprite pixels. */
const BURN_RADIUS = 2.9;
/** How fast a disturbed pixel forgets it was disturbed. Higher heals sooner. */
const HEAL_RATE = 2.4;
/** Maximum lean, in pixels, of the top row toward the cursor. */
const SWAY_MAX = 1.6;

/* ------------------------------------------------------------------
   Voices — synthesised, so there are no assets to ship or lose.
------------------------------------------------------------------ */

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = false;

export const setPixelMuted = (value: boolean) => {
  muted = value;
};

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

function noise(ac: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = Math.floor(ac.sampleRate * 0.4);
    noiseBuffer = ac.createBuffer(1, length, ac.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) channel[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** A burst of noise shaped by one filter. The backbone of three of the voices. */
function burst(
  ac: AudioContext,
  at: number,
  opts: {
    type: BiquadFilterType;
    freq: number;
    endFreq?: number;
    q: number;
    gain: number;
    decay: number;
  },
) {
  const src = ac.createBufferSource();
  src.buffer = noise(ac);
  const filter = ac.createBiquadFilter();
  filter.type = opts.type;
  filter.frequency.setValueAtTime(opts.freq, at);
  if (opts.endFreq) filter.frequency.exponentialRampToValueAtTime(opts.endFreq, at + opts.decay);
  filter.Q.value = opts.q;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(opts.gain, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + opts.decay);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(at);
  src.stop(at + opts.decay + 0.05);
}

function tone(
  ac: AudioContext,
  at: number,
  opts: { type: OscillatorType; freq: number; endFreq?: number; gain: number; decay: number },
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.freq, at);
  if (opts.endFreq) osc.frequency.exponentialRampToValueAtTime(opts.endFreq, at + opts.decay);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(opts.gain, at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + opts.decay);
  osc.connect(gain).connect(ac.destination);
  osc.start(at);
  osc.stop(at + opts.decay + 0.05);
}

/**
 * Struck steel. Two inharmonic partials give it the ring a single tone can't —
 * a spanner is a bar, not a string, so its overtones aren't whole multiples.
 */
function clank(ac: AudioContext, t: number) {
  burst(ac, t, { type: "highpass", freq: 2600, q: 0.7, gain: 0.05, decay: 0.05 });
  tone(ac, t, { type: "triangle", freq: 1840, endFreq: 1760, gain: 0.035, decay: 0.32 });
  tone(ac, t, { type: "triangle", freq: 2790, endFreq: 2680, gain: 0.018, decay: 0.22 });
}

/**
 * A page turning. One swish reads as "swish", not as paper — a real page is
 * three events: the sheet dragging up, the flick as it goes over, and the tick
 * of it settling against the others. Nothing tonal anywhere in it.
 */
function paper(ac: AudioContext, t: number) {
  burst(ac, t, { type: "bandpass", freq: 1800, endFreq: 820, q: 1.2, gain: 0.055, decay: 0.14 });
  burst(ac, t + 0.06, { type: "bandpass", freq: 3100, endFreq: 1500, q: 1.6, gain: 0.042, decay: 0.1 });
  burst(ac, t + 0.15, { type: "highpass", freq: 4200, q: 0.7, gain: 0.022, decay: 0.025 });
}

/**
 * A C major arpeggio, root to octave. Two notes only ever sounded like an
 * interval; four in a row is short enough to stay an earcon but long enough to
 * read as music. Each note is a sine with a triangle an octave up underneath it
 * at low level, which gives the tone some edge without making it a synth lead.
 */
function chime(ac: AudioContext, t: number) {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const at = t + i * 0.062;
    const level = 0.05 - i * 0.006;
    tone(ac, at, { type: "sine", freq, gain: level, decay: 0.42 - i * 0.04 });
    tone(ac, at, { type: "triangle", freq: freq * 2, gain: level * 0.22, decay: 0.16 });
  });
}

/**
 * An SLR firing: mirror up, shutter across, mirror back down. The low sine is
 * the body of the mechanism — without it the clicks are thin and sound like a
 * mouse button rather than something with moving parts in it.
 */
function shutter(ac: AudioContext, t: number) {
  burst(ac, t, { type: "highpass", freq: 3000, q: 0.8, gain: 0.09, decay: 0.012 });
  tone(ac, t, { type: "sine", freq: 180, endFreq: 120, gain: 0.03, decay: 0.045 });
  burst(ac, t + 0.072, { type: "highpass", freq: 2200, q: 0.8, gain: 0.06, decay: 0.022 });
  tone(ac, t + 0.072, { type: "sine", freq: 150, endFreq: 105, gain: 0.022, decay: 0.05 });
}

const VOICES = { clank, paper, chime, shutter };

/* ------------------------------------------------------------------
   The field
------------------------------------------------------------------ */

export type PixelFieldOptions = {
  sprite: Sprite;
  reduced?: boolean;
  /**
   * Screen pixels per sprite pixel. Whole numbers only — a fractional scale
   * makes some blocks a pixel wider than others, which is the one thing pixel
   * art cannot survive. Omit to fill the stage with the largest scale that fits.
   */
  scale?: number;
};

export class PixelField {
  private stage: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private reduced: boolean;
  private sprite: Sprite;

  private off: HTMLCanvasElement;
  private offCtx: CanvasRenderingContext2D;
  private buf: ImageData;

  /** The sprite, as flat RGBA. Never mutated. */
  private src = new Uint8ClampedArray(N * N * 4);
  /** The live buffer. This is what gets shoved about. */
  private grid = new Float32Array(N * N * 4);
  private scratch = new Float32Array(N * N * 4);
  /** Per-cell memory of displacement, 1 = just disturbed, 0 = home. */
  private dist = new Float32Array(N * N);

  private swayX = 0;
  private vel = { x: 0, y: 0 };
  private pcell: { x: number; y: number } | null = null;
  private prevP: { x: number; y: number } | null = null;
  private hovering = false;

  private box = { x: 0, y: 0, size: 0, dpr: 1 };
  private fixedScale: number | undefined;
  private raf = 0;
  private last = 0;
  private lastSound = 0;
  private visible = true;
  private dead = false;

  constructor(stage: HTMLElement, opts: PixelFieldOptions) {
    this.stage = stage;
    this.sprite = opts.sprite;
    this.reduced = !!opts.reduced;
    this.fixedScale = opts.scale;

    this.canvas = document.createElement("canvas");
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.className = "pixel-field__canvas";
    this.ctx = this.canvas.getContext("2d")!;
    this.stage.appendChild(this.canvas);

    this.off = document.createElement("canvas");
    this.off.width = N;
    this.off.height = N;
    this.offCtx = this.off.getContext("2d")!;
    this.buf = this.offCtx.createImageData(N, N);

    this.decode();
    this.grid.set(this.src);
    this.resize();
    this.render();

    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    this.stage.addEventListener("pointerenter", this.onEnter);
    this.stage.addEventListener("pointerleave", this.onLeave);
    this.stage.addEventListener("pointerdown", this.onTap, { passive: true });

    this.observer.observe(this.stage);
  }

  /** Sprite text → RGBA. Unknown characters and `.` are transparent. */
  private decode() {
    const { rows, palette } = this.sprite;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const ch = rows[y]?.[x] ?? ".";
        const hex = palette[ch];
        const p = (y * N + x) * 4;
        if (!hex) {
          this.src[p] = this.src[p + 1] = this.src[p + 2] = this.src[p + 3] = 0;
          continue;
        }
        this.src[p] = parseInt(hex.slice(1, 3), 16);
        this.src[p + 1] = parseInt(hex.slice(3, 5), 16);
        this.src[p + 2] = parseInt(hex.slice(5, 7), 16);
        this.src[p + 3] = 255;
      }
    }
  }

  private observer = new IntersectionObserver((entries) => {
    this.visible = entries[0]?.isIntersecting ?? true;
    if (this.visible) this.kick();
  });

  private onResize = () => {
    this.resize();
    this.render();
  };

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = this.stage.clientWidth;
    const ch = Math.max(1, this.stage.clientHeight);
    this.canvas.width = Math.round(cw * dpr);
    this.canvas.height = Math.round(ch * dpr);
    // Snapped to a whole multiple of 16 so every sprite pixel is the same size
    // on screen. Off by a fraction and the blocks alias into uneven widths,
    // which is exactly the thing pixel art must not do.
    const scale =
      this.fixedScale ?? Math.max(1, Math.floor((Math.min(cw, ch) * 0.82) / N));
    this.box.size = scale * N;
    this.box.x = Math.round((cw - this.box.size) / 2);
    this.box.y = Math.round((ch - this.box.size) / 2);
    this.box.dpr = dpr;
    this.ctx.imageSmoothingEnabled = false;
  };

  private idx = (x: number, y: number) => y * N + x;

  private play() {
    if (muted || this.reduced) return;
    const now = performance.now();
    if (now - this.lastSound < 90) return;
    this.lastSound = now;
    const ac = audio();
    if (!ac) return;
    VOICES[this.sprite.voice](ac, ac.currentTime);
  }

  private onMove = (e: PointerEvent) => {
    const r = this.stage.getBoundingClientRect();
    const px = e.clientX - r.left - this.box.x;
    const py = e.clientY - r.top - this.box.y;
    if (px < 0 || py < 0 || px > this.box.size || py > this.box.size) {
      this.pcell = null;
      return;
    }
    this.pcell = { x: (px / this.box.size) * N, y: (py / this.box.size) * N };
    this.kick();
  };

  private onEnter = () => {
    this.hovering = true;
    this.kick();
  };

  private onLeave = () => {
    this.hovering = false;
    this.pcell = null;
    this.prevP = null;
  };

  /** Scatter everything lit, and mark it all as maximally displaced. */
  private onTap = () => {
    for (let i = 0; i < N * N; i++) {
      const p = i * 4;
      if (this.grid[p + 3] > 127) {
        this.grid[p] = this.grid[p + 1] = this.grid[p + 2] = this.grid[p + 3] = 0;
        this.dist[i] = 1;
      }
    }
    this.play();
    this.kick();
  };

  /** True while any pixel is still out of place, so the loop knows to keep going. */
  private disturbed() {
    for (let i = 0; i < N * N; i++) if (this.dist[i] > 0.02) return true;
    return false;
  }

  private step(dt: number) {
    const { grid, scratch, dist, src } = this;

    if (this.pcell && this.prevP) {
      const inv = 1 / Math.max(dt, 0.001);
      this.vel.x += ((this.pcell.x - this.prevP.x) * inv - this.vel.x) * 0.3;
      this.vel.y += ((this.pcell.y - this.prevP.y) * inv - this.vel.y) * 0.3;
    } else {
      this.vel.x *= 0.8;
      this.vel.y *= 0.8;
    }
    this.prevP = this.pcell ? { ...this.pcell } : null;

    const swayTarget = this.pcell ? ((this.pcell.x - N / 2) / (N / 2)) * SWAY_MAX : 0;
    this.swayX += (swayTarget - this.swayX) * Math.min(1, dt * 6);

    // --- heal: every cell drifts back toward the sprite, in proportion to how
    //     long it has been since it was last touched.
    const decay = Math.min(1, HEAL_RATE * dt);
    for (let i = 0; i < N * N; i++) {
      const p = i * 4;
      const srcLit = src[p + 3] > 127;
      const d = dist[i];

      if (d < 0.02) {
        if (srcLit) {
          grid[p] = src[p];
          grid[p + 1] = src[p + 1];
          grid[p + 2] = src[p + 2];
          grid[p + 3] = 255;
        } else {
          grid[p] = grid[p + 1] = grid[p + 2] = grid[p + 3] = 0;
        }
        dist[i] = 0;
        continue;
      }

      const lit = grid[p + 3] > 127;
      if (!lit && srcLit && Math.random() < decay * 0.7) {
        // Relight one cell at a time rather than all at once — a sprite that
        // reassembles pixel by pixel looks like it is healing; one that snaps
        // back looks like a bug.
        grid[p] = src[p];
        grid[p + 1] = src[p + 1];
        grid[p + 2] = src[p + 2];
        grid[p + 3] = 255;
        dist[i] = 0;
        continue;
      }
      if (lit && !srcLit) {
        // A stray pixel outside the sprite fades rather than vanishing.
        grid[p + 3] *= 1 - decay;
        if (grid[p + 3] < 8) grid[p] = grid[p + 1] = grid[p + 2] = grid[p + 3] = 0;
      }
      dist[i] = d * (1 - decay);
    }

    // --- shove: push lit pixels along the cursor's travel and heat them.
    if (!this.pcell) return;
    const { x: cx, y: cy } = this.pcell;
    const speed = Math.hypot(this.vel.x, this.vel.y);
    if (speed < 0.05) return;

    const inv = 1 / speed;
    const ux = this.vel.x * inv;
    const uy = this.vel.y * inv;
    const reach = BURN_RADIUS + 1.2;
    const x0 = Math.max(0, Math.floor(cx - reach));
    const x1 = Math.min(N - 1, Math.ceil(cx + reach));
    const y0 = Math.max(0, Math.floor(cy - reach));
    const y1 = Math.min(N - 1, Math.ceil(cy + reach));

    scratch.set(grid);
    let moved = 0;

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        const d = Math.hypot(dx, dy);
        if (d > BURN_RADIUS) continue;
        const i = this.idx(x, y);
        const p = i * 4;
        if (grid[p + 3] < 40) continue;

        const fall = 1 - d / BURN_RADIUS;
        const by = 1 + Math.round(fall * 3);
        const tx = Math.min(N - 1, Math.max(0, x + Math.round(ux * by)));
        const ty = Math.min(N - 1, Math.max(0, y + Math.round(uy * by)));
        const tp = this.idx(tx, ty) * 4;

        // Heat toward white, hardest at the centre of the cursor.
        const heat = fall;
        const rr = grid[p] + (255 - grid[p]) * heat * 0.55;
        const gg = grid[p + 1] + (250 - grid[p + 1]) * heat * 0.45;
        const bb = grid[p + 2] + (235 - grid[p + 2]) * heat * 0.35;

        // Brightest pixel wins the destination, so overlapping shoves don't
        // average into mud.
        if (rr + gg + bb >= scratch[tp] + scratch[tp + 1] + scratch[tp + 2]) {
          scratch[tp] = rr;
          scratch[tp + 1] = gg;
          scratch[tp + 2] = bb;
        }
        scratch[tp + 3] = 255;
        dist[this.idx(tx, ty)] = 1;

        if (fall > 0.12 && (tx !== x || ty !== y)) {
          scratch[p] = scratch[p + 1] = scratch[p + 2] = scratch[p + 3] = 0;
          dist[i] = 1;
          moved++;
        }
      }
    }

    grid.set(scratch);
    if (moved >= 4) this.play();
  }

  private render() {
    const out = this.buf.data;
    for (let y = 0; y < N; y++) {
      // The top of the sprite leans further than the bottom, so it bends rather
      // than slides.
      const lean = 1 - y / (N - 1);
      const shift = Math.round(this.swayX * lean);
      for (let x = 0; x < N; x++) {
        const p = this.idx(x, y) * 4;
        const sx = Math.min(N - 1, Math.max(0, x - shift));
        const gp = this.idx(sx, y) * 4;
        out[p] = this.grid[gp];
        out[p + 1] = this.grid[gp + 1];
        out[p + 2] = this.grid[gp + 2];
        out[p + 3] = this.grid[gp + 3];
      }
    }
    this.offCtx.putImageData(this.buf, 0, 0);

    const { ctx, canvas, box } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    const d = box.dpr;
    ctx.drawImage(this.off, box.x * d, box.y * d, box.size * d, box.size * d);
  }

  private frame = (ms: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (ms - this.last) / 1000) : 0.016;
    this.last = ms;
    this.step(dt);
    this.render();
    // Keep going only while there is something to animate.
    if (this.hovering || this.disturbed() || Math.abs(this.swayX) > 0.01) this.kick();
    else this.last = 0;
  };

  private kick() {
    if (this.raf || this.dead || this.reduced || !this.visible) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    this.dead = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("resize", this.onResize);
    this.stage.removeEventListener("pointerenter", this.onEnter);
    this.stage.removeEventListener("pointerleave", this.onLeave);
    this.stage.removeEventListener("pointerdown", this.onTap);
    this.canvas.remove();
  }
}
