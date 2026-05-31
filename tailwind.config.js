/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f38585',
          500: '#eb5757',
          600: '#d63232',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7F1D1D',
          950: '#450a0a',
        },
        gold: {
          50: '#fdfaee',
          100: '#faf3d0',
          200: '#f4e49e',
          300: '#eccf63',
          400: '#e4bb37',
          500: '#D4A017',
          600: '#b8830f',
          700: '#925f10',
          800: '#784c14',
          900: '#653f15',
          950: '#3a2007',
        },
        cream: {
          50: '#fefdfb',
          100: '#F8F1E5',
          200: '#f0e0c8',
          300: '#e5caaa',
          400: '#d8b088',
          500: '#ca9568',
          600: '#b87c4f',
          700: '#9a6340',
          800: '#7e5037',
          900: '#674330',
          950: '#372118',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
