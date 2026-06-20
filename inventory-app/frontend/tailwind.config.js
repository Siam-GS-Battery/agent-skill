/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        action: { DEFAULT: "#0066cc", focus: "#0071e3" }, // single accent (Style_Apple)
        ink: { DEFAULT: "#1d1d1f", muted: "#7a7a7a" },
        parchment: "#f5f5f7",
        hairline: "#e0e0e0",
        ok: "#10B981", warn: "#F59E0B", danger: "#EF4444",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: { product: "rgba(0,0,0,0.22) 3px 5px 30px 0" },
    },
  },
  plugins: [],
};
