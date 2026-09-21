/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wander: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Core sunset orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        navy: {
          800: '#1e293b',
          850: '#151e2e',
          900: '#0f172a',
          950: '#090d16',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f4ed',
          200: '#ede8dc',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'float': '0 20px 40px -15px rgba(249, 115, 22, 0.25)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
}
