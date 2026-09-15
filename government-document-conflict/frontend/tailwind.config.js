/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          bg: "#F8F9F7",
          dark: "#17212B",
          navy: "#1F3347",
          teal: "#0F766E",
          orange: "#D97706",
          border: "#E5E7EB",
          card: "#FFFFFF",
          muted: "#6B7280",
          subtle: "#F3F4F6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
