/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'quran': ['UthmanicHafs1', 'serif'],
        'indopak': ['PDMS_Saleem_QuranFont', 'serif'],
      },
    },
  },
  plugins: [],
};