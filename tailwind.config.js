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
          'gold-light': '#fbbf24',
          'gold-dark': '#b45309',
          dark: '#060a14',
          'dark-surface': '#0b1120',
          'dark-elevated': '#0f172a',
          card: '#0f172a',
          border: '#334155',
          primary: '#38bdf8',
          danger: '#f43f5e',
          success: '#10b981',
          aria: '#ec4899',
          mana: '#818cf8',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.45)',
        'glow-sky': '0 0 25px rgba(56, 189, 248, 0.45)',
        'glow-crimson': '0 0 25px rgba(244, 63, 94, 0.45)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.45)',
        'rpg-card': '0 12px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        starlight: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.2)' },
        }
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        glow: 'pulseGlow 2.5s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
        sheen: 'sheen 3s ease-in-out infinite',
        starlight: 'starlight 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
