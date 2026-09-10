/**
 * Where each book sits in the shelf photograph.
 *
 * The shelf is a photograph, so the books are pixels rather than elements. Each
 * entry is one spine's box in `public/images/reading-shelf.jpg`, measured off
 * the image and expressed as percentages of the scene.
 *
 * Keyed by content id, not by array position. An earlier version of this map
 * was a bare array paired up with the collection by index, and the moment the
 * photo held something the collection didn't — a Tinkle digest wedged between
 * two novels — every box after it pointed at the wrong book. A key that has to
 * match by name cannot drift like that.
 *
 * Every spine on the shelf now has an entry, so every book on it responds. A
 * book without a box would simply be skipped rather than rendered at zero size:
 * an invisible button is worse than an absent one, because it still takes a tab
 * stop and announces a book nobody can see.
 */
export interface SpineBox {
  /** x of the spine's left edge, as a percentage of scene width. */
  x: number;
  /** y of the spine's top edge, as a percentage of scene height. */
  y: number;
  w: number;
  h: number;
}

/** The photo's own proportions. The scene must not letterbox or crop. */
export const SCENE_ASPECT = "1672 / 941";

/** Pixel boundaries measured against the 1672 × 941 source photograph. */
const spinePixels: Record<string, [number, number, number, number]> = {
  "atomic-habits": [100, 118, 84, 666],
  "subtle-art": [184, 117, 83, 667],
  "power-of-subconscious-mind": [267, 120, 85, 664],
  "surely-youre-joking": [352, 121, 88, 663],
  "tinkle-double-digest": [440, 165, 57, 619],
  "remarkable-cricket-grounds": [497, 122, 64, 662],
  "a-little-life": [561, 123, 112, 661],
  "white-tiger": [673, 125, 78, 659],
  "tuesdays-with-morrie": [751, 145, 75, 639],
  "conversations-with-friends": [826, 147, 78, 637],
  "kafka-selected-works": [904, 126, 89, 658],
  "blue-sisters": [993, 148, 84, 636],
  "cant-hurt-me": [1077, 153, 68, 631],
  "kafka-short-stories": [1145, 149, 84, 635],
  "courage-to-be-disliked": [1229, 148, 91, 636],
  "hard-thing": [1320, 152, 89, 632],
  "build": [1409, 151, 94, 633],
  "focus-on-what-matters": [1503, 162, 66, 622],
};

export const SPINE_BOXES: Record<string, SpineBox> = Object.fromEntries(
  Object.entries(spinePixels).map(([id, [x, y, w, h]]) => [id, {
    x: x / 1672 * 100, y: y / 941 * 100,
    w: w / 1672 * 100, h: h / 941 * 100,
  }]),
);

/**
 * Each book's real colour, sampled from the photograph: the median pixel over
 * the middle of the spine face, with the top and bottom trimmed so shelf shadow
 * doesn't drag it dark. Kept for anything that wants to draw a spine rather
 * than show one; the live shelf uses the photograph itself.
 *
 * `ink` is whichever of page/ink contrasts better against the spine, not
 * whatever the real jacket uses. The weakest pairing here clears 4.9:1.
 */
export interface SpinePaint {
  base: string;
  top: string;
  bottom: string;
  ink: "light" | "dark";
}

export const SPINE_PAINT: Record<string, SpinePaint> = {
  "atomic-habits": { base: "#ebecec", top: "#e1dbcc", bottom: "#eeeeee", ink: "dark" },
  "subtle-art": { base: "#e2561f", top: "#e15720", bottom: "#e2561f", ink: "dark" },
  "power-of-subconscious-mind": { base: "#ededee", top: "#ededee", bottom: "#ededee", ink: "dark" },
  "surely-youre-joking": { base: "#8f4766", top: "#473763", bottom: "#b74c67", ink: "light" },
  "tinkle-double-digest": { base: "#1e75c7", top: "#2273c2", bottom: "#1d76c9", ink: "light" },
  "remarkable-cricket-grounds": { base: "#133531", top: "#173834", bottom: "#10332e", ink: "light" },
  "a-little-life": { base: "#eae9e6", top: "#eae9e7", bottom: "#e9e8e5", ink: "dark" },
  "white-tiger": { base: "#1e1d19", top: "#4c483a", bottom: "#181814", ink: "light" },
  "tuesdays-with-morrie": { base: "#a44334", top: "#a24332", bottom: "#a44335", ink: "light" },
  "conversations-with-friends": { base: "#eca80f", top: "#eca80f", bottom: "#eca80f", ink: "dark" },
  "kafka-selected-works": { base: "#1a1a19", top: "#22201e", bottom: "#191918", ink: "light" },
  "blue-sisters": { base: "#ebe9e9", top: "#c7d7eb", bottom: "#ebeae8", ink: "dark" },
  "cant-hurt-me": { base: "#272622", top: "#2e2c28", bottom: "#23211f", ink: "light" },
  "kafka-short-stories": { base: "#e8e0cc", top: "#e9e2cd", bottom: "#e7e0cc", ink: "dark" },
  "courage-to-be-disliked": { base: "#e8e8e9", top: "#e9e8e9", bottom: "#e8e7e9", ink: "dark" },
  "hard-thing": { base: "#1d1d1c", top: "#201f1e", bottom: "#1a1b1a", ink: "light" },
  "build": { base: "#ececec", top: "#ededed", bottom: "#ececec", ink: "dark" },
  "focus-on-what-matters": { base: "#f4d60b", top: "#f4d711", bottom: "#f3d607", ink: "dark" },
};
