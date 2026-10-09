# ken.visuals portfolio

React 19 + TypeScript + Vite, with a live three.js hero built on React Three Fiber + drei.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # serve the build
```

## Structure

- `index.html` — Vite's required entry shell (just `<div id="root">`); all UI is React.
- `src/content.ts` — projects, clients, skills, links. Edit copy here.
- `src/components/Scene.tsx` — 3D hero: distorted core, orbit rings, glass tiles with the After Effects and Figma logos.
- `src/components/` — Hero, Work (showreel + bento grid), About/Toolkit, Clients, Contact, video modal.
- `src/assets/logos/` — After Effects and Figma brand SVGs.
- `public/assets/` — videos, posters, client logos (served as-is).
- `src/components/reactbits/` — components from [React Bits](https://www.reactbits.dev/) (TS + CSS variants), vendored as source. ClickSpark is adapted to a fixed viewport overlay that idles when no sparks are alive.
- `src/components/ui.tsx` — `Kicker` (DecryptedText), `Heading` (SplitText) and `Cta` (Magnet + StarBorder) helpers used across sections.
