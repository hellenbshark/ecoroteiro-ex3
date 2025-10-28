/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nature': {
          'moss': '#4A7C59',
          'light-green': '#7FB069',
          'beige': '#F0F8F0',
          'sage': '#6B9B37',
          'forest': '#2D5016',
          'emerald': '#10B981',
          'lime': '#84CC16',
          'mint': '#6EE7B7',
          'jade': '#059669',
          'olive': '#65A30D'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
