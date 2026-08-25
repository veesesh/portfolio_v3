/**
 * 16×16 pixel art, hand-authored rather than loaded.
 *
 * The reference implementation decodes a PNG sprite sheet. Sprites this small
 * are cheaper to keep as text: they diff readably, need no network request or
 * decode step, and can't go missing. Each row is one scanline, each character
 * one pixel, and `.` is transparent.
 *
 * Colour is deliberate here even though the site is otherwise three colours.
 * A one-colour icon at this size reads as a glyph, not as an object, and the
 * whole point of the effect is that the pixels look physical enough to shove.
 */
export type Sprite = {
  label: string;
  section: string;
  href: string;
  /** Which synthesised voice this icon plays. See scripts/pixel-field.ts. */
  voice: "clank" | "paper" | "chime" | "shutter";
  palette: Record<string, string>;
  rows: string[];
};

/**
 * Hammer and wrench, crossed — 🛠️.
 *
 * Two diagonals meeting in the middle is a lot to ask of 16 pixels, so the
 * tools are drawn in different materials rather than different shapes: steel
 * for the wrench, wood for the hammer's handle. At this size material reads
 * from across the room and silhouette does not. The wrench passes in front at
 * the crossing, because steel over wood is the readable way round.
 */
const tools: Sprite = {
  label: "Hammer & wrench",
  section: "Build",
  href: "/build",
  voice: "clank",
  palette: { M: "#a3adb8", D: "#5f6a75", w: "#b07d4a", W: "#8a5a34" },
  rows: [
    "................",
    ".MMMMD....M..M..",
    ".MMMMD....M..M..",
    ".MMMMD....MMMM..",
    "....MM.....MM...",
    "....wW.....MM...",
    ".....wW...MM....",
    "......wW.MM.....",
    ".......wMM......",
    ".......MMW......",
    "......MM.wW.....",
    ".....MM...wW....",
    "....MM.....wW...",
    "...MM.......wW..",
    "..MM.........wW.",
    "................",
  ],
};

/** An open book, ruled lines and all. */
const book: Sprite = {
  label: "Book",
  section: "Reading",
  href: "/reading",
  voice: "paper",
  palette: { c: "#8c3f2c", p: "#f2e6cf", "-": "#c9b998" },
  rows: [
    "................",
    "...cccc..cccc...",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cppppccppppc..",
    "..cp--pccp--pc..",
    "..cccccccccccc..",
    "................",
  ],
};

const headphones: Sprite = {
  label: "Headphones",
  section: "Listening",
  href: "/listening",
  voice: "chime",
  palette: { d: "#3a3f47", a: "#6b7480" },
  rows: [
    "................",
    "......dddd......",
    "....dd....dd....",
    "...d........d...",
    "..d..........d..",
    "..d..........d..",
    ".d............d.",
    ".d............d.",
    ".daa........aad.",
    ".daa........aad.",
    ".daa........aad.",
    ".daa........aad.",
    ".daa........aad.",
    ".daa........aad.",
    ".dd..........dd.",
    "................",
  ],
};

const camera: Sprite = {
  label: "Camera",
  section: "Pictures",
  href: "/pictures",
  voice: "shutter",
  palette: { D: "#3a3f47", b: "#565e68", L: "#cfd6dd", g: "#7fb0c9" },
  rows: [
    "................",
    "......DDDD......",
    "..DDDDDDDDDDDD..",
    "..DbbbbbbbbbbD..",
    "..DbbbbLLbbbbD..",
    "..DbbbLggLbbbD..",
    "..DbbLggggLbbD..",
    "..DbbLggggLbbD..",
    "..DbbLggggLbbD..",
    "..DbbbLggLbbbD..",
    "..DbbbbLLbbbbD..",
    "..DbbbbbbbbbbD..",
    "..DbbbbbbbbbbD..",
    "..DbbbbbbbbbbD..",
    "..DDDDDDDDDDDD..",
    "................",
  ],
};

export const pixelSprites: readonly Sprite[] = [tools, book, headphones, camera];
