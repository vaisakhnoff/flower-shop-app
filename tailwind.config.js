/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Rose / Blush palette
        blush: {
          50:  '#fff5f7',
          100: '#ffe4ea',
          200: '#ffc9d5',
          300: '#ff9fb3',
          400: '#ff6b8e',
          500: '#f43b6a',
          600: '#df1a4f',
          700: '#ba0f3d',
          800: '#981037',
          900: '#7e1233',
        },
        // Warm cream / champagne
        cream: {
          50:  '#fffdf5',
          100: '#fef9e7',
          200: '#fdf0c2',
          300: '#fbe490',
          400: '#f8d15a',
          500: '#f4bc2a',
          600: '#dea015',
          700: '#b97e10',
          800: '#966314',
          900: '#7b5117',
        },
        // Warm gold
        gold: {
          50:  '#fdfbf0',
          100: '#faf4d1',
          200: '#f5e89f',
          300: '#efd566',
          400: '#e8c13a',
          500: '#d4a619',
          600: '#b88512',
          700: '#936412',
          800: '#794f15',
          900: '#664217',
        },
        // Deep mauve
        mauve: {
          50:  '#fdf5f9',
          100: '#fce9f3',
          200: '#f9d3e7',
          300: '#f3aed2',
          400: '#e87db6',
          500: '#d8529a',
          600: '#c23680',
          700: '#a32869',
          800: '#872558',
          900: '#70234b',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(212, 166, 25, 0.12), 0 1px 6px rgba(0,0,0,0.06)',
        'luxury-hover': '0 12px 40px rgba(212, 166, 25, 0.2), 0 4px 12px rgba(0,0,0,0.08)',
        'card': '0 2px 16px rgba(180, 100, 120, 0.08), 0 1px 4px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 32px rgba(180, 100, 120, 0.16), 0 4px 12px rgba(0,0,0,0.08)',
        'soft': '0 2px 20px rgba(0,0,0,0.06)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.08)',
        'glow-rose': '0 0 24px rgba(244, 59, 106, 0.15)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #fff5f7 0%, #fef9e7 50%, #fdf5f9 100%)',
        'hero-gradient': 'linear-gradient(160deg, #fce4ec 0%, #fff8f0 40%, #fce8f0 70%, #fff3e0 100%)',
        'card-gradient': 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #d4a619 0%, #f8d15a 50%, #d4a619 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}