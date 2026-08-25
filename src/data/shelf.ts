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

export const SPINE_BOXES: Record<string, SpineBox> = {
  "atomic-habits": { x: 6.04, y: 12.54, w: 4.67, h: 70.14 },
  "subtle-art": { x: 10.71, y: 12.54, w: 4.78, h: 70.14 },
  "power-of-subconscious-mind": { x: 15.49, y: 12.75, w: 5.26, h: 69.93 },
  "surely-youre-joking": { x: 20.75, y: 12.75, w: 5.2, h: 69.93 },
  "tinkle-double-digest": { x: 25.96, y: 16.37, w: 3.35, h: 66.31 },
  "remarkable-cricket-grounds": { x: 29.31, y: 12.75, w: 4.13, h: 69.93 },
  "a-little-life": { x: 33.43, y: 13.07, w: 6.58, h: 69.61 },
  "white-tiger": { x: 40.01, y: 13.07, w: 4.9, h: 69.61 },
  "tuesdays-with-morrie": { x: 44.92, y: 15.3, w: 4.19, h: 67.38 },
  "conversations-with-friends": { x: 49.1, y: 15.62, w: 4.67, h: 67.06 },
  "kafka-selected-works": { x: 53.77, y: 13.39, w: 5.56, h: 69.29 },
  "blue-sisters": { x: 59.33, y: 15.62, w: 5.08, h: 67.06 },
  "cant-hurt-me": { x: 64.41, y: 16.15, w: 4.13, h: 66.52 },
  "kafka-short-stories": { x: 68.54, y: 16.26, w: 4.55, h: 66.42 },
  "courage-to-be-disliked": { x: 73.09, y: 15.94, w: 5.2, h: 66.74 },
  "hard-thing": { x: 78.29, y: 16.05, w: 5.98, h: 66.63 },
  "build": { x: 84.27, y: 16.05, w: 5.32, h: 66.63 },
  "focus-on-what-matters": { x: 89.59, y: 19.77, w: 3.83, h: 62.91 },
};

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
