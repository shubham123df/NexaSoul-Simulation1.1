# NexaSoul Simulation 1.1

A React + TypeScript + Three.js experience that presents a cinematic 3D simulation with animated islands, a holographic world, particle effects, and a storytelling UI. The project is built with Vite and can be deployed as a static site.

## Features

- 3D scene built with React Three Fiber
- Interactive world, orb/player visual, starfield, and particle systems
- Intro/loading/final UI flow for a guided experience
- Responsive Vite build for modern browsers

## Local development

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
```

The production output is generated in the `dist/` directory.

## Deploying to Render

Render can host this project as a Static Site.

1. Push this repository to GitHub.
2. In Render, create a new Static Site.
3. Connect the GitHub repository.
4. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Click Create Static Site.

### Render configuration example

If you prefer a config file, add a `render.yaml` file with:

```yaml
services:
  - type: web
    name: nexa-soul-simulation
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## Project structure

- `src/` — React app and 3D scene components
- `public/` — static assets
- `dist/` — production build output

## Notes

- The app uses Vite and modern ESM support.
- For a production deployment, ensure the site is served from the root path and that your hosting provider supports SPA routing by rewriting unknown paths to `index.html`.
