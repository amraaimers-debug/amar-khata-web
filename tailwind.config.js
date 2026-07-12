/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F1E2",
        surface: "#FFFDF7",
        ink: "#241F18",
        maroon: "#7C2233",
        forest: "#2F5D50",
        gold: "#B4872E",
      },
      fontFamily: {
        display: ["'Tiro Bangla'", "serif"],
        serif: ["'Noto Serif Bengali'", "serif"],
        sans: ["'Hind Siliguri'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
