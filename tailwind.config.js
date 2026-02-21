/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dps: {
          teal: "#004b61",
          cream: "#f4f1ea",
          green: "#006400",
          gold: "#d4af37",
        },
      },
    },
  },
  plugins: [],
}

