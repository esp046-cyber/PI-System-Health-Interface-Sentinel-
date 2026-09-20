/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0b1114',   // app background (control-room black-teal)
        raised: '#131c21',  // cards and inputs
        line: '#24323a',    // borders and dividers
        ok: '#3ddc84',      // traffic light: healthy
        warn: '#ffc233',    // traffic light: degraded / stale
        crit: '#ff4d4f',    // traffic light: offline / critical
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
