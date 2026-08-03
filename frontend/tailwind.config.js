/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          primary: '#0E0E0E',
          surface: '#1A1A1A',
          secondary: '#242424',
          elevated: '#2A2A2A',
        },
        // Gold accent
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4B445',
          dark: '#A8861F',
          muted: '#C9A22730',
        },
        // Text
        cream: {
          DEFAULT: '#F0EAD6',
          muted: '#8A8680',
          subtle: '#5A5855',
        },
        // Borders
        border: {
          DEFAULT: '#2E2E2E',
          light: '#3A3A3A',
        },
        // Status
        success: '#5ABF8A',
        error: '#E05A5A',
        warning: '#D4A84B',
        info: '#5A9ABF',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      boxShadow: {
        gold: '0 0 20px rgba(201, 162, 39, 0.15)',
        'gold-sm': '0 0 10px rgba(201, 162, 39, 0.1)',
        surface: '0 4px 24px rgba(0, 0, 0, 0.4)',
        elevated: '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A227 0%, #D4B445 50%, #A8861F 100%)',
        'surface-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #242424 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0E0E0E 0%, #141414 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 162, 39, 0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201, 162, 39, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
