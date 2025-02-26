
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        chatbg: "#343541",
        messagebg: "#444654",
        inputbg: "#40414F",
        primary: {
          DEFAULT: "#000000",
          hover: "#1a1a1a",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "white",
          hover: "#f8fafc",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
