# Guitar Scale Visualizer

A dark-mode web app for visualizing major/minor scales on a guitar fretboard,
with CAGED position breakdowns and a print view.

## Stack

Vite + React + TypeScript, no backend. All scale/fretboard data is computed
client-side from music theory — no database, no persistence.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## How it's organized

- `src/theory/` — the music-theory engine, independent of React:
  - `notes.ts` — pitch classes and key-signature-correct note spelling
    (derives sharps/flats from the circle of fifths, so e.g. F major spells
    `Bb` not `A#`, and minor keys resolve to their own idiomatic spelling)
  - `scale.ts` — builds a 7-note scale (major or natural minor) with degree
    labels and root/3rd/5th triad flags
  - `fretboard.ts` — the full string × fret grid of in-scale notes, plus
    open-string scale membership
  - `caged.ts` — derives the 5 CAGED position windows geometrically from
    where the root note falls relative to each open-chord shape's defining
    string, rather than hardcoding shapes per key. Works for any root/mode.
- `src/components/` — `Fretboard` (single SVG covering wires, dots, nut,
  strings, and markers so horizontal scroll moves everything together),
  `ControlBar` and its Key/Mode/Display/Position controls, `NoteMarker`.
- `src/App.tsx` — renders the interactive fretboard plus a second,
  print-only fretboard that's always forced to the full board + Notes
  display regardless of on-screen selections (see the print stylesheet in
  `src/index.css`).

## Hosting

No backend needed — this is a static build (`npm run build` → `dist/`).
Any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages) works and
should be effectively free at this scale.
