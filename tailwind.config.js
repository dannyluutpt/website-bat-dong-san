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
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          955: '#090d16',
        },
        gold: {
          50: '#faf8f5',
          100: '#f3ede0',
          200: '#e5d7bd',
          300: '#d3ba90',
          400: '#bd9662',
          500: '#aa7d46',
          600: '#916337',
          700: '#754a2a',
          800: '#613c24',
          900: '#533421',
          950: '#2e190f',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
