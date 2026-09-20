# PI System Health & Interface Sentinel 🏭

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-brightgreen?style=for-the-badge)](https://esp046-cyber.github.io/PI-System-Health-Interface-Sentinel-/)
[![Tech Stack](https://img.shields.io/badge/Tech_Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge)](#)

A mobile-first Progressive Web App (PWA) designed specifically for Aveva PI Software Engineers to monitor the heartbeat of SCADA/PLC data flows and PI system infrastructure on the go.

## 🎯 The Problem This Solves

Traditional PI system monitoring often ties engineers to their workstations or requires navigating complex desktop-optimized interfaces (like PI System Explorer) on mobile devices. 

The **Sentinel PWA** provides a lightweight, split-pane dashboard optimized for large mobile screens (like the iPhone 18 Plus). It delivers instant visibility into critical infrastructure, allowing engineers to triage offline nodes, monitor stale data rates, and assess server health from the plant floor or remotely.

## ✨ Core Features

*   **Live Dashboard:** Real-time metrics for PI Data Archive and AF Server connectivity.
*   **Triage Interface:** A dedicated scrolling list highlighting disconnected nodes, buffer backups, and stale data streams.
*   **Traffic-Light Status:** Immediate visual cues (Red/Yellow/Green) for interface and connector health.
*   **PWA Capabilities:** Installable to the mobile home screen with offline caching support.
*   **Dark-Mode Industrial UI:** Designed for low-fatigue viewing in control rooms or low-light environments.

## 🚀 Live Demo

You can test the frontend interface using mocked data here:
👉 **[PI System Health & Interface Sentinel Demo](https://esp046-cyber.github.io/PI-System-Health-Interface-Sentinel-/)**

*(Note: The live demo uses a simulated data generator. To connect to a live PI system, you must run the application locally and configure the API credentials.)*

## 🛠️ Architecture & Tech Stack

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **PWA Integration:** `vite-plugin-pwa` (Manifest & Service Workers)
*   **Data Layer:** Pre-configured service file (`piApiService.js`) ready for RESTful connection to the Aveva PI Web API.

## ⚙️ Local Setup & PI Web API Integration

To run this application locally and connect it to your live PI System:

### 1. Prerequisites
*   Node.js (v18+)
*   An accessible Aveva PI Web API endpoint (configured with Basic or Kerberos authentication).

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone [https://github.com/esp046-cyber/PI-System-Health-Interface-Sentinel-.git](https://github.com/esp046-cyber/PI-System-Health-Interface-Sentinel-.git)
cd PI-System-Health-Interface-Sentinel-
npm install


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
