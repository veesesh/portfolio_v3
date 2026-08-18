/**
 * Rainbow mode. Opt-in, off by default, remembered in localStorage.
 *
 * A fixed grid of cells covers the viewport behind the content. Moving the
 * cursor lights the cell under it — fast in, slow out — each one a step further
 * around the colour wheel, so a sweep leaves a fading tiled trail.
 *
 * A grid rather than free-floating blobs: cells align to each other, so
 * overlapping ones read as one continuous field instead of a pile of circles,
 * and lighting a cell is an index lookup rather than a DOM insertion.
 *
 * The blur lives on the container, so it's one pass for the whole grid, and the
 * container is scaled slightly past the viewport so blurred edges never reveal
 * a seam at the screen border.
 */

const STORAGE_KEY = "vee-rainbow";

/** A deliberate, fixed field rather than a viewport-dependent density. */
const GRID_SIZE = 5;
/** How long a cell stays fully lit before it starts fading back. */
const HOLD_MS = 90;
/** Degrees around the wheel per cell lit. */
const HUE_STEP = 26;

let enabled = false;
let layer: HTMLElement | null = null;
let cells: HTMLElement[] = [];
let cols = 0;
let rows = 0;
let hue = Math.floor(Math.random() * 360);
let lastIndex = -1;
const timers = new Map<number, number>();

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function writePreference(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
  } catch {
    /* private mode — works for the session, just isn't remembered */
  }
}

function build() {
  if (!layer) return;
  cols = GRID_SIZE;
  rows = GRID_SIZE;

  layer.style.setProperty("--cols", String(cols));
  layer.style.setProperty("--rows", String(rows));

  timers.forEach((id) => window.clearTimeout(id));
  timers.clear();
  lastIndex = -1;

  const total = cols * rows;
  const next = document.createDocumentFragment();
  cells = [];
  for (let i = 0; i < total; i += 1) {
    const cell = document.createElement("div");
    cell.className = "rainbow-layer__cell";
    cells.push(cell);
    next.appendChild(cell);
  }
  layer.replaceChildren(next);
}

function light(index: number) {
  const cell = cells[index];
  if (!cell) return;

  hue = (hue + HUE_STEP + Math.random() * 8) % 360;
  cell.style.setProperty("--cell", `hsl(${hue} 82% 70%)`);
  cell.classList.add("is-lit");

  // Drop the class shortly after so the slow transition takes it back out.
  // Re-lighting a cell restarts its timer rather than stacking one.
  const existing = timers.get(index);
  if (existing) window.clearTimeout(existing);
  timers.set(
    index,
    window.setTimeout(() => {
      cell.classList.remove("is-lit");
      timers.delete(index);
    }, HOLD_MS),
  );
}

function onMove(event: PointerEvent) {
  if (!enabled || !cols) return;
  const col = Math.floor((event.clientX / window.innerWidth) * cols);
  const row = Math.floor((event.clientY / window.innerHeight) * rows);
  if (col < 0 || row < 0 || col >= cols || row >= rows) return;

  const index = row * cols + col;
  if (index === lastIndex) return;
  lastIndex = index;
  light(index);
}

export function mountRainbow(button: HTMLButtonElement, host: HTMLElement) {
  layer = host;
  enabled = readPreference();
  layer.classList.toggle("is-on", enabled);
  button.setAttribute("aria-pressed", String(enabled));
  if (enabled) build();

  button.addEventListener("click", () => {
    enabled = !enabled;
    writePreference(enabled);
    button.setAttribute("aria-pressed", String(enabled));
    layer?.classList.toggle("is-on", enabled);
    if (enabled) build();
    else {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      layer?.replaceChildren();
      cells = [];
      lastIndex = -1;
    }
  });

  window.addEventListener("pointermove", onMove, { passive: true });

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      if (!enabled) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    },
    { passive: true },
  );
}
