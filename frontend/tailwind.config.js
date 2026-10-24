/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neuro: {
          bg: '#0a0f1d', // Deep navy / charcoal background
          surface: '#0f172a', // Dark clinical card surface
          subtle: '#1e293b', // Elevated surface
          card: '#0f172a',
          navy: '#f8fafc', // Primary white text
          navyLight: '#e2e8f0',
          slate: '#94a3b8', // Muted slate secondary text
          slateLight: '#cbd5e1',
          border: '#1e293b', // Soft borders
          borderDark: '#334155',
          blue: '#0284c7', // Professional medical blue
          blueHover: '#0369a1',
          blueLight: '#082f49',
          teal: '#0d9488', // Medical teal
          tealHover: '#14b8a6',
          tealLight: '#134e4a',
          success: '#10b981', // Emerald accent
          successBg: '#064e3b',
          warning: '#f59e0b',
          warningBg: '#78350f',
          error: '#ef4444',
          errorBg: '#7f1d1d',
        },
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
        'clinical': '0 10px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
        'cyan-glow': '0 0 15px -2px rgba(6, 182, 212, 0.25)',
        'teal-glow': '0 0 15px -2px rgba(13, 148, 136, 0.25)',
      },
    },
  },
  plugins: [],
}
