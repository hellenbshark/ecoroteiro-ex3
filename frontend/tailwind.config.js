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
        nature: {
          beige: '#fdfbf7',
          mint: '#e2f0e9',
          emerald: '#10b981',
          jade: '#059669',
          forest: '#064e3b',
          sage: '#aaccb9',
          moss: '#4a5d23',
          'light-green': '#dcfce7'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}