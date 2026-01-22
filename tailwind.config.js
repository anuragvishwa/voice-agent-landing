/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme for particle visibility
        background: 'rgba(3, 7, 18, 0.95)', // Dark with slight transparency
        canvas: 'rgba(5, 10, 20, 0.9)', // Card backgrounds
        surface: 'rgba(10, 15, 30, 0.95)', // Section backgrounds
        border: 'rgba(30, 41, 59, 0.8)', // Slate borders
        'border-hover': 'rgba(51, 65, 85, 0.9)',
        foreground: '#f8fafc', // Light text
        muted: '#94a3b8', // Muted text (slate-400)
        secondary: '#0ea5e9', // Sky blue for voice/communication theme
        danger: '#ef4444',
        warning: '#f59e0b',
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Purple accent
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s steps(2, start) infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(2)' },
        },
      },
    },
  },
  plugins: [],
}
