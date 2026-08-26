/**
 * Generates the link-preview image at public/og.png.
 *
 * Run with `npm run og` after changing anything below.
 *
 * There is no image library on this machine and no headless browser worth
 * depending on, so the card is written as SVG and rendered by Quick Look,
 * which is WebKit and honours @font-face. The site's own fonts are embedded as
 * base64 rather than substituted, so the preview is set in the same type as
 * the page it points at.
 *
 * Quick Look thumbnails are square, so the 1200x630 card is drawn centred on a
 * 1200x1200 canvas and cropped back out afterwards.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const W = 1200;
const H = 630;
const PAD = (W - H) / 2; // Top and bottom padding that makes the canvas square.

const font = (p) => readFileSync(p).toString("base64");
const display = font("node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2");
const sans = font("node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const mono = font("public/fonts/JetBrainsMono[wght].ttf");

// The portrait from the hero, embedded rather than linked: Quick Look renders
// the SVG as a standalone file with no server behind it.
const portrait = readFileSync("public/portrait/sketch.jpg").toString("base64");

// No em dashes and no emoji anywhere in here: this text is read by scrapers and
// rendered at small sizes in other people's timelines.
const NAME = "Vee";
const ROLE = "Community and Operations, Devfolio";
const HANDLES = ["github.com/veesesh", "x.com/vee19twt", "linkedin.com/in/vee19"];
const SITE = "veesesh.tech";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <defs>
    <style>
      @font-face { font-family: "Display"; src: url(data:font/woff2;base64,${display}) format("woff2"); font-weight: 100 900; }
      @font-face { font-family: "Sans"; src: url(data:font/woff2;base64,${sans}) format("woff2"); font-weight: 100 900; }
      @font-face { font-family: "Mono"; src: url(data:font/ttf;base64,${mono}) format("truetype"); font-weight: 100 900; }
    </style>
    <radialGradient id="blue" cx="0.12" cy="0.1" r="0.62">
      <stop offset="0" stop-color="#e2eef9" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#e2eef9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="teal" cx="0.96" cy="0.46" r="0.55">
      <stop offset="0" stop-color="#eaf6f2" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#eaf6f2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="amber" cx="0.62" cy="1.02" r="0.6">
      <stop offset="0" stop-color="#faf2e6" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#faf2e6" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="frame">
      <rect x="90" y="185" width="252" height="252" rx="20"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${W}" fill="#ffffff"/>

  <g transform="translate(0 ${PAD})">
    <rect width="${W}" height="${H}" fill="#fcfcfc"/>
    <rect width="${W}" height="${H}" fill="url(#blue)"/>
    <rect width="${W}" height="${H}" fill="url(#teal)"/>
    <rect width="${W}" height="${H}" fill="url(#amber)"/>

    <rect x="90" y="185" width="252" height="252" rx="20" fill="#141414" opacity="0.07"
          transform="translate(0 6)"/>
    <image href="data:image/jpeg;base64,${portrait}" x="90" y="185" width="252" height="252"
           preserveAspectRatio="xMidYMid slice" clip-path="url(#frame)"/>

    <text x="408" y="284" font-family="Display" font-size="132" font-weight="600"
          letter-spacing="-5" fill="#141414">${NAME}</text>

    <text x="412" y="336" font-family="Sans" font-size="30" font-weight="400"
          fill="#6b6b6b">${ROLE}</text>

    ${HANDLES.map((hand, i) =>
      `<text x="412" y="${406 + i * 38}" font-family="Mono" font-size="21"
             fill="#6b6b6b" letter-spacing="0.5">${hand}</text>`).join("\n    ")}

    <line x1="90" y1="524" x2="${W - 90}" y2="524" stroke="#141414" stroke-opacity="0.1" stroke-width="1"/>

    <text x="90" y="568" font-family="Mono" font-size="21" fill="#8d8d8d"
          letter-spacing="1">${SITE}</text>

    <text x="${W - 90}" y="568" text-anchor="end" font-family="Mono" font-size="21"
          fill="#8d8d8d" letter-spacing="1">Hyderabad / Bengaluru</text>
  </g>
</svg>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
const svgPath = join(dir, "og.svg");
writeFileSync(svgPath, svg);

execFileSync("qlmanage", ["-t", "-s", String(W), "-o", dir, svgPath], { stdio: "ignore" });
const square = join(dir, "og.svg.png");

// Centred crop, which is the only kind sips does, and the reason the card was
// drawn centred in the first place.
execFileSync("sips", ["-c", String(H), String(W), square, "--out", join(dir, "og.png")], { stdio: "ignore" });

// JPEG, not PNG: the card is mostly soft gradient, which PNG stores badly. The
// same image is 687KB as a PNG and 65KB here, and the type still reads clean at
// this quality.
execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "88",
  join(dir, "og.png"), "--out", join(dir, "og.jpg")], { stdio: "ignore" });
copyFileSync(join(dir, "og.jpg"), "public/og.jpg");
rmSync(dir, { recursive: true, force: true });

const size = readFileSync("public/og.jpg").length;
console.log(`public/og.jpg  ${W}x${H}  ${(size / 1024).toFixed(0)}KB`);
