# PI System Health & Interface Sentinel

Dark-mode PWA for monitoring PI Data Archive, AF Server and PI interface health. React + Vite + Tailwind v3 + `vite-plugin-pwa`.

## Run locally
```bash
npm install
cp .env.example .env    # mock data is on by default
npm run dev
```

## Environment variables
| Variable | Purpose |
|---|---|
| `VITE_USE_MOCK` | `true` uses generated data; `false` calls the live PI Web API |
| `VITE_PI_WEB_API_URL` | e.g. `https://piserver/piwebapi` |
| `VITE_PI_USER` / `VITE_PI_PASSWORD` | Basic auth credentials |
| `VITE_VAPID_PUBLIC_KEY` | Public VAPID key for Web Push (`npx web-push generate-vapid-keys`) |

`VITE_*` values are compiled into the client bundle. For production, put a small proxy in front of PI Web API (also solves CORS) instead of shipping credentials.

## Going live
Edit `getInterfaceHealth()` in `src/services/piApiService.js` to match your interface health tag naming. Tune alert thresholds in `THRESHOLDS`.

## Deploy on GitHub Pages
1. In `vite.config.js`, `base` defaults to `/PI-System-Health-Interface-Sentinel/`; change it if your repo name differs.
2. Repo Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/`.
4. Add `VITE_*` values under Settings > Secrets and variables > Actions > Variables (they are public in the bundle).
5. Check the Actions tab for a green run.

## Deploy on Render
Set env var `VITE_BASE=/` so assets resolve from the site root.

1. Push this repo to GitHub.
2. Render dashboard: New > **Static Site**, select the repo.
3. Build command `npm install && npm run build`, publish directory `dist`.
4. Add the environment variables above.
5. Redirects/Rewrites: source `/*`, destination `/index.html`, action Rewrite.

## Install on iPhone
Open the Render URL in Safari, Share > Add to Home Screen, open it from the Home Screen, then tap **Enable alerts**. Push on iOS needs 16.4 or later and an installed PWA.

## Icons
Add `public/icon-192.png` and `public/icon-512.png` (iOS ignores SVG icons).

## Push backend
The service worker (`src/sw.js`) handles `push` and `notificationclick`. Sending real pushes when the app is closed needs a server that stores the subscription and posts payloads like `{"title","body","tag","url"}`. Wire the TODO in `src/services/push.js`.
