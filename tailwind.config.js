/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E2A33",
        teal: "#0F6E6E",
        tealDeep: "#0A4F52",
        pulse: "#FF6B5B",
        amber: "#E3A23C",
        green: "#3E8E68",
        bgSoft: "#F3F6F6",
      },
      fontFamily: {
        sans: ["Tajawal", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
