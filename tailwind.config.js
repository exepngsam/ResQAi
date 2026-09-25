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
        base: '#050505',
        primary: '#FFFFFF',
        secondary: '#A1A1AA',
        muted: '#71717A',
        surface: {
          dark: '#080808',
          card: '#0c0c0e',
          elevated: '#121216',
          border: 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(255, 255, 255, 0.025)',
          glassHover: 'rgba(255, 255, 255, 0.05)',
        },
        emergency: {
          low: '#10B981',       // Green
          moderate: '#F59E0B',  // Yellow
          high: '#F97316',      // Orange
          critical: '#EF4444',  // Red
        },
        // Maintain compatibility with existing classnames
        command: {
          bg: '#050505',
          panel: '#09090b',
          card: '#0f0f12',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)',
          active: 'rgba(255, 255, 255, 0.08)',
        }
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass-inset': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'subtle': '0 8px 30px rgba(0, 0, 0, 0.7)',
        'emergency-glow': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
