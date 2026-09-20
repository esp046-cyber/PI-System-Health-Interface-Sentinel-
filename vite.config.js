import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// injectManifest lets us ship our own service worker (src/sw.js) with push handlers.
// The manifest lives in public/manifest.json and is linked from index.html.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategy: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: false,
      injectRegister: 'auto',
      devOptions: { enabled: true, type: 'module' },
    }),
  ],
})
