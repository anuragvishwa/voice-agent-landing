/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Enhanced dark theme
        background: '#0a0a0a', // Near black base
        surface: '#111111', // Slightly lighter surface
        canvas: 'rgba(255, 255, 255, 0.02)', // Glass container background
        border: 'rgba(255, 255, 255, 0.1)', // Default border
        'border-hover': 'rgba(255, 255, 255, 0.2)', // Hover border
        foreground: '#ffffff', // Primary text
        muted: 'rgba(255, 255, 255, 0.6)', // Muted text
        secondary: '#22c55e', // Green accent (legacy alias)
        danger: '#ef4444',
        warning: '#f59e0b',
        primary: {
          DEFAULT: '#22c55e', // Green primary
          foreground: '#000000', // Black text on green
        },
        accent: {
          DEFAULT: '#8b5cf6', // Purple accent for particles
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
