import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
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
      fontFamily: {
        sans: ["OCR-A Extended", ...fontFamily.sans],
        "ocr-a": ["OCR-A Extended", "monospace"],
        "04b_19": ["04b_19", "monospace"],
      },
      colors: {
        mainBg: "#181818",
        greenColorMain: "#4ade80",
        darkOrange: "#ff8200",
        textOranfe: "#ba2c00",
        newTextOrange: "#e8a200",
        newBlack: "#090404",
        whiteBg: "#E0E0E0",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bg: "#dfe5f2",
        main: "#fde047",
        mainAccent: "#4d80e6", // not needed for shadcn
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "darkOrange-bg": "#140904",
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(to right, #cc6800, #ff8200)",
      },
      boxShadow: {
        base: "0px 6px 0px 0px rgba(0,0,0,1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        base: "20px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(50px)" },
          "20%": { transform: "translateX(-50px)" },
          "30%": { transform: "translateX(45px)" },
          "40%": { transform: "translateX(-45px)" },
          "50%": { transform: "translateX(40px)" },
          "60%": { transform: "translateX(-40px)" },
          "70%": { transform: "translateX(35px)" },
          "80%": { transform: "translateX(-35px)" },
          "90%": { transform: "translateX(30px)" },
        },
        "card-shake": {
          "0%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-200px)" },
          "30%": { transform: "translateX(200px)" },
          "45%": { transform: "translateX(-150px)" },
          "60%": { transform: "translateX(150px)" },
          "75%": { transform: "translateX(-100px)" },
          "90%": { transform: "translateX(50px)" },
          "100%": { transform: "translateX(0)" }
        },
      },
      translate: {
        boxShadowX: "0px",
        boxShadowY: "6px",
        reverseBoxShadowX: "0px",
        reverseBoxShadowY: "-6px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.3s ease-in-out",
        "card-shake": "card-shake 0.8s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
