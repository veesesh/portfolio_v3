# Vee's portfolio

An Astro site about systems, communities, developer experience, and the work behind
builder programs.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check && astro build
```

## Shape of the site

A narrow, typography-forward light page. The home page is a hub: each section shows a
handful of entries and links through to a fuller page.

| Route | What it holds |
| --- | --- |
| `/` | Hero portrait, work, build, reading, listening, pictures |
| `/work` | Career history, ordered editorially. |
| `/build` | Initiatives, systems, and personal projects. |
| `/reading` | Shelf and blogs. |
| `/listening` | Spotify-powered current rotation. |
| `/life` | Movies, movement, biryani, dream places, and other non-work notes. |
| `/pictures` | Community photo archive with a lightbox |

## Content

File-backed, no CMS. Collections live in `src/content/` and are typed in
`src/content.config.ts`:

- `roles/` — one file per organization. `displayOrder` controls its public position.
- `projects/` — what was built or run. `org` points at a `roles` entry id, or `own` for
  side projects. `category` places it under Initiatives, Systems, or Own projects on
  `/build`. Give an entry a markdown body and it becomes an expandable case study.
- `writing/` — published posts shown under Reading → Blogs. Rows link straight out to `url`.
- `reading/` — Shelf entries; books are shown on `/reading`.

`src/data/site.ts` holds navigation, profile links, the configured Spotify playlist, and
the gallery photo metadata.


## The portrait

The hero portrait is a framework-free WebGL effect (`src/components/portrait/`). It
cycles a set of restyled portraits and melts back to the real photo along a soft cursor
trail; when nobody is touching it, a virtual cursor wanders the face on its own.

It also drives the page's colour: every frame it reports a background and glow colour,
which become the `--style-bg` and `--style-glow` custom properties. The accent colour is
derived from `--style-glow`, so links, rules, and the wash behind the page all drift as
the portrait changes.

Textures live in `public/portrait/` — `real`, `lego`, `minecraft`, `roblox`, all the same
square crop of the same pose. To replace them, drop in new files and update the paths at
the top of `src/components/portrait/engine.ts`.

Degradation is built in: the real photo sits underneath as a plain `<img>`, so no WebGL
means no effect and no missing image. Reduced motion renders a single static frame
instead of running the loop, and the loop pauses whenever the tile scrolls out of view.
