import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0b0f17",
          light: "#f7f8fb",
        },
        foreground: {
          DEFAULT: "#e6edf3",
          dark: "#101826"
        },
        primary: {
          DEFAULT: "#6ee7ff",
          dark: "#00bcd4"
        },
        accent: {
          DEFAULT: "#a78bfa",
          dark: "#7c3aed"
        }
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.15)"
      }
    },
  },
  plugins: [],
}
export default config


