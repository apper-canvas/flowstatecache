/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B5B95',
          light: '#9B8AC4', 
          dark: '#4A3A6B'
        },
        secondary: {
          DEFAULT: '#88B0D3',
          light: '#B8D0E8',
          dark: '#5885A8'
        },
        accent: '#FFB6BA',
        surface: {
          50: '#FAFAFA',
          100: '#F7F4F9',
          200: '#F0EAF5',
          300: '#E6D9ED',
          400: '#D4C1DD',
          500: '#C0A6CC',
          600: '#A688B8',
          700: '#8B689A',
          800: '#6B5B95',
          900: '#4A3A6B'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Quicksand', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Quicksand', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: { 
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        glow: '0 0 20px rgba(107, 91, 149, 0.15)',
        'flow': '0 2px 8px rgba(107, 91, 149, 0.1), 0 8px 24px rgba(107, 91, 149, 0.08)'
      },
      borderRadius: { 
        xl: '0.75rem', 
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      animation: {
        'breathing': 'breathing 4s ease-in-out infinite',
        'flow': 'flow 3s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' }
        },
        flow: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '33%': { transform: 'translateX(2px) translateY(-1px)' },
          '66%': { transform: 'translateX(-1px) translateY(1px)' },
          '100%': { transform: 'translateX(0) translateY(0)' }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-flow': 'linear-gradient(135deg, #6B5B95 0%, #88B0D3 50%, #FFB6BA 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #F7F4F9 0%, #FAFAFA 100%)'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}