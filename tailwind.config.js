/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fbf7f0',
          100: '#f7f1e8',
          200: '#efe6d4',
          300: '#e3d5b8',
        },
        forge: {
          50: '#faf6f1',
          100: '#f0e6d6',
          200: '#dcc7a3',
          300: '#c8a679',
          400: '#b8895a',
          500: '#a36f43',
          600: '#8a5a37',
          700: '#6e472d',
          800: '#523524',
          900: '#3a261a',
        },
        steel: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'metallic': 'linear-gradient(135deg, #d6d3d1 0%, #f5f5f4 25%, #a8a29e 50%, #f5f5f4 75%, #d6d3d1 100%)',
        'forge-glow': 'radial-gradient(circle at 30% 20%, rgba(184,137,90,0.18), transparent 60%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
