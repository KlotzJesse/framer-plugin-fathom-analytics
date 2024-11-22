/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", bun"./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-framer-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
};
