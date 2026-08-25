/**
 * Cards poured into one surface.
 *
 * The outline is generated rather than blurred. The cheap gooey trick
 * (blur + contrast) is a raster filter: it costs GPU on every drag frame,
 * softens edges even at rest, and cannot produce a crisp joint. This walks a
 * signed distance field instead and emits a real path, so a joint value of 0 is
 * genuinely sharp.
 *
 * Cards are found as `[data-liquid-card]` children of the stage and positioned
 * absolutely, so the SVG and the DOM always agree on where each one is.
 */

type Rect = { x: number; y: number; w: number; h: number; r: number };

/** Sampling step, in px. Finer looks smoother and costs more. */
const CELL = 2.5;
/** Matches .life-card's border-radius, so the two treatments agree. */
const RADIUS = 9;

export type LiquidOptions = {
  /** 0 = crisp corners, ~70 = gooey blobs. */
  joint?: number;
  gap?: number;
  cardHeight?: number;
  /** Skips the drag handlers and holds the cards in their slots. */
  reduced?: boolean;
  /**
   * Whether cards can be moved at all. Off where a card holds an iframe: the
   * frame swallows pointer events over its own area, so a drag would work on
   * the padding and die in the middle, which reads as broken rather than fixed.
   */
  draggable?: boolean;
};

export class LiquidField {
  private stage: HTMLElement;
  private paint: SVGSVGElement;
  private shapes: SVGGElement;
  private cards: HTMLElement[];

  private gap: number;
  private cardH: number;
  private reduced: boolean;
  private k: number;

  /** Where each card has been dragged to, relative to its slot. */
  private drift: { x: number; y: number }[];
  private slots: Rect[] = [];
  private frame = 0;
  private dead = false;

  constructor(stage: HTMLElement, opts: LiquidOptions = {}) {
    this.stage = stage;
    this.k = opts.joint ?? 34;
    this.gap = opts.gap ?? 14;
    this.cardH = opts.cardHeight ?? 212;
    this.reduced = !!opts.reduced;

    this.paint = stage.querySelector("svg")!;
    this.shapes = this.paint.querySelector("g")!;
    this.cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-liquid-card]"));
    this.drift = this.cards.map(() => ({ x: 0, y: 0 }));

    if (!this.reduced && (opts.draggable ?? true)) this.bind();

    this.relayout();
    this.observer.observe(stage);
  }

  private observer = new ResizeObserver(() => this.relayout());

  /* ---------------- the field ---------------- */

  /** Signed distance to a rounded rectangle. Negative inside. */
  private sdRect(px: number, py: number, r: Rect) {
    const qx = Math.abs(px - (r.x + r.w / 2)) - (r.w / 2 - r.r);
    const qy = Math.abs(py - (r.y + r.h / 2)) - (r.h / 2 - r.r);
    const ax = Math.max(qx, 0);
    const ay = Math.max(qy, 0);
    return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r.r;
  }

  /**
   * Polynomial smooth minimum. At k = 0 this is plain `Math.min`, a hard union
   * — the crisp end. Above that it rounds the transition between two surfaces,
   * which is the whole effect.
   */
  private smin(a: number, b: number) {
    if (this.k <= 0.0001) return Math.min(a, b);
    const h = Math.max(this.k - Math.abs(a - b), 0) / this.k;
    return Math.min(a, b) - h * h * this.k * 0.25;
  }

  private field(px: number, py: number, rects: Rect[]) {
    let d = this.sdRect(px, py, rects[0]);
    for (let i = 1; i < rects.length; i++) d = this.smin(d, this.sdRect(px, py, rects[i]));
    return d;
  }

  /**
   * Walks the field on a grid and stitches the zero crossing into closed loops.
   * Segments are emitted unordered and joined by matching endpoints, so winding
   * never has to be tracked — the path is filled even-odd, which also gets the
   * hole in the middle of four cards right for free.
   */
  private contour(rects: Rect[], w: number, h: number) {
    const cols = Math.ceil(w / CELL) + 1;
    const rows = Math.ceil(h / CELL) + 1;
    const g = new Float32Array(cols * rows);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) g[j * cols + i] = this.field(i * CELL, j * CELL, rects);
    }

    const segs: number[][] = [];
    const cut = (x1: number, y1: number, v1: number, x2: number, y2: number, v2: number) => {
      const t = v1 / (v1 - v2);
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    };

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const x0 = i * CELL;
        const y0 = j * CELL;
        const x1 = x0 + CELL;
        const y1 = y0 + CELL;
        const a = g[j * cols + i];
        const b = g[j * cols + i + 1];
        const c = g[(j + 1) * cols + i + 1];
        const d = g[(j + 1) * cols + i];

        let code = 0;
        if (a < 0) code |= 8;
        if (b < 0) code |= 4;
        if (c < 0) code |= 2;
        if (d < 0) code |= 1;
        if (code === 0 || code === 15) continue;

        const top = () => cut(x0, y0, a, x1, y0, b);
        const right = () => cut(x1, y0, b, x1, y1, c);
        const bottom = () => cut(x1, y1, c, x0, y1, d);
        const left = () => cut(x0, y1, d, x0, y0, a);

        switch (code) {
          case 1: case 14: segs.push([...left(), ...bottom()]); break;
          case 2: case 13: segs.push([...bottom(), ...right()]); break;
          case 3: case 12: segs.push([...left(), ...right()]); break;
          case 4: case 11: segs.push([...top(), ...right()]); break;
          case 6: case 9: segs.push([...top(), ...bottom()]); break;
          case 7: case 8: segs.push([...left(), ...top()]); break;
          // Saddles: two crossings in one cell. Split them the same way each
          // time — at this cell size the choice is invisible, but flipping
          // between frames would pop.
          case 5: segs.push([...left(), ...top()], [...bottom(), ...right()]); break;
          case 10: segs.push([...top(), ...right()], [...left(), ...bottom()]); break;
        }
      }
    }

    const key = (x: number, y: number) => `${Math.round(x * 64)},${Math.round(y * 64)}`;
    const ends = new Map<string, number[]>();
    segs.forEach((s, i) => {
      for (const kk of [key(s[0], s[1]), key(s[2], s[3])]) {
        const list = ends.get(kk);
        if (list) list.push(i);
        else ends.set(kk, [i]);
      }
    });

    const used = new Array(segs.length).fill(false);
    let path = "";

    for (let start = 0; start < segs.length; start++) {
      if (used[start]) continue;
      used[start] = true;

      const loop = [[segs[start][0], segs[start][1]], [segs[start][2], segs[start][3]]];
      let head = loop[loop.length - 1];

      for (;;) {
        const near = ends.get(key(head[0], head[1]));
        if (!near) break;
        const next = near.find((i) => !used[i]);
        if (next === undefined) break;
        used[next] = true;
        const s = segs[next];
        const flip = key(s[0], s[1]) !== key(head[0], head[1]);
        head = flip ? [s[0], s[1]] : [s[2], s[3]];
        loop.push(head);
      }

      if (loop.length < 3) continue;
      path += `M${loop.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("L")}Z`;
    }

    return path;
  }

  /* ---------------- layout and render ---------------- */

  private measure() {
    const w = this.stage.clientWidth;
    const cols = w < 560 ? 1 : 2;
    const cardW = (w - this.gap * (cols - 1)) / cols;
    const rows = Math.ceil(this.cards.length / cols);

    this.slots = this.cards.map((_, i) => ({
      x: (i % cols) * (cardW + this.gap),
      y: Math.floor(i / cols) * (this.cardH + this.gap),
      w: cardW,
      h: this.cardH,
      r: RADIUS,
    }));

    const h = rows * this.cardH + (rows - 1) * this.gap;
    this.stage.style.height = `${h}px`;
    this.paint.setAttribute("viewBox", `0 0 ${w} ${h}`);
    this.paint.setAttribute("width", `${w}`);
    this.paint.setAttribute("height", `${h}`);
  }

  private render() {
    const placed = this.slots.map((s, i) => ({
      ...s,
      x: s.x + this.drift[i].x,
      y: s.y + this.drift[i].y,
    }));

    this.cards.forEach((card, i) => {
      const r = placed[i];
      card.style.width = `${r.w}px`;
      card.style.height = `${r.h}px`;
      card.style.transform = `translate(${r.x}px, ${r.y}px)`;
    });

    const w = Number(this.paint.getAttribute("width"));
    const h = Number(this.paint.getAttribute("height"));

    // The webbing between cards is generated; the cards themselves are drawn as
    // exact rounded rects on top of it, in the same fill. That keeps their
    // corners truly crisp rather than faceted by the sampling grid.
    const rects = placed
      .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${r.r}"/>`)
      .join("");

    this.shapes.innerHTML = `<path d="${this.contour(placed, w, h)}"/>${rects}`;
  }

  private schedule = () => {
    if (this.frame || this.dead) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  };

  private relayout = () => {
    this.measure();
    this.render();
  };

  /* ---------------- input ---------------- */

  private bind() {
    this.cards.forEach((card, i) => {
      card.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        card.setPointerCapture(event.pointerId);
        card.dataset.dragging = "true";
        const from = { x: event.clientX, y: event.clientY };
        const base = { ...this.drift[i] };

        const move = (e: PointerEvent) => {
          this.drift[i].x = base.x + (e.clientX - from.x);
          this.drift[i].y = base.y + (e.clientY - from.y);
          this.schedule();
        };

        const done = () => {
          delete card.dataset.dragging;
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerup", done);
          card.removeEventListener("pointercancel", done);
        };

        card.addEventListener("pointermove", move);
        card.addEventListener("pointerup", done);
        card.addEventListener("pointercancel", done);
      });

      // Dragging is the point of the treatment, so it needs to work without a
      // pointer too, or the section is unreachable by keyboard.
      card.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 20 : 6;
        const nudge: Record<string, [number, number]> = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        };
        const delta = nudge[event.key];
        if (!delta) return;
        event.preventDefault();
        this.drift[i].x += delta[0];
        this.drift[i].y += delta[1];
        this.schedule();
      });
    });
  }

  setJoint(k: number) {
    this.k = k;
    this.schedule();
  }

  reset() {
    this.drift.forEach((d) => { d.x = 0; d.y = 0; });
    this.schedule();
  }

  destroy() {
    this.dead = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.observer.disconnect();
  }
}
