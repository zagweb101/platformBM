import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./actions/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            950: "#01092D",
            900: "#07113F",
            800: "#101A55",
          },
          indigo: "#2437E8",
          violet: {
            DEFAULT: "#6535E8",
            700: "#5127D9",
            600: "#6535E8",
            500: "#7C4DFF",
          },
          magenta: "#C21D7A",
          rose: "#E32655",
          red: "#EF334F",
          /* legacy aliases — للمكونات الحالية */
          fuchsia: "#C21D7A",
          gold: "#F59E0B",
        },
        page: "#FAFAFD",
        surface: {
          DEFAULT: "#FFFFFF",
          hover: "#FBFAFF",
          section: "#F5F4FA",
        },
        border: {
          default: "#E8E6F0",
          soft: "#F0EEF5",
          focus: "#6535E8",
        },
        /* لوحة التحكم — semantic tokens */
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        dark: {
          primary: "#0a0a0f",
          secondary: "#0f0f1a",
          card: "#13131f",
          elevated: "#1a1a2e",
        },
      },
      fontFamily: {
        heading: ["Almarai", "sans-serif"],
        body: ["IBM Plex Sans Arabic", "Almarai", "sans-serif"],
        /* legacy */
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
        almarai: ["Almarai", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 12px 35px rgba(12,10,35,0.08)",
        hover: "0 20px 50px rgba(12,10,35,0.13)",
        brand: "0 16px 45px rgba(101,53,232,0.25)",
        sm: "0 4px 14px rgba(12,10,35,0.05)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #2437E8 0%, #6535E8 38%, #C21D7A 72%, #E32655 100%)",
        "gradient-hero": "linear-gradient(135deg, #01092D 0%, #07113F 50%, #101A55 100%)",
        "gradient-card": "linear-gradient(145deg, #ffffff 0%, #F5F4FA 100%)",
      },
    },
  },
  plugins: [],
};

export default withUt(config);
