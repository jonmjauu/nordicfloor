import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          50: "#f7f8f7",
          100: "#eef0ee",
          200: "#d7ddd8",
          300: "#bbc7bc",
          400: "#8fa090",
          500: "#677a67",
          600: "#506051",
          700: "#404c40",
          800: "#353d35",
          900: "#2f352f"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(20, 20, 20, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
