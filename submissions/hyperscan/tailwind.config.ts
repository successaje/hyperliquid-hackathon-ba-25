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
          DEFAULT: "var(--color-bg)",
        },
        foreground: {
          DEFAULT: "var(--color-fg)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
        },
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.15)"
      }
    },
  },
  plugins: [],
}
export default config


