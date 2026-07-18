# Vee's portfolio

An Astro portfolio about systems, communities, developer experience, and the work behind builder programs.

## Development

```bash
npm install
npm run dev
```

The local site runs at [http://localhost:4321](http://localhost:4321).

## Checks

```bash
npm run typecheck
npm run build
```

## Content

The portfolio is file-backed and does not need a CMS:

- `src/content/work/` contains the narrative case studies.
- `src/content/notes/` contains field and program notes.
- `src/content/trove/` contains the growing personal collections.
- `src/data/site.ts` contains navigation, experience, archives, social links, and gallery metadata.

The default appearance is dark. Theme preference is stored locally in the browser, and the
decorative Maxi companion becomes static when reduced motion is requested.
