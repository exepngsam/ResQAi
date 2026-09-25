/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#070d16',
          panel: '#0c1524',
          card: '#111d30',
          border: '#1a2c47',
          hover: '#192b45',
          active: '#213a5e',
        },
        emergency: {
          critical: '#ef4444',
          high: '#f97316',
          moderate: '#eab308',
          safe: '#10b981',
          intel: '#06b6d4',
          primary: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
