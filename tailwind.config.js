/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rpg: ['Cinzel', 'serif'],
        code: ['"Fira Code"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        rpg: {
          gold: '#f59e0b',
          dark: '#0a0f1d',
          card: '#111827',
          border: '#374151',
          primary: '#3b82f6',
          danger: '#ef4444',
          success: '#10b981',
          aria: '#ec4899',
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'pulseGlow 2s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
}
