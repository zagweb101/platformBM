import type { Config } from "tailwindcss";

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
          indigo:  '#4F46E5',
          violet:  '#7C3AED',
          fuchsia: '#D946EF',
          gold:    '#F59E0B',
        },
        dark: {
          primary:   '#0a0a0f',
          secondary: '#0f0f1a',
          card:      '#13131f',
          elevated:  '#1a1a2e',
        }
      },
      fontFamily: {
        cairo:   ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        almarai: ['Almarai', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4F46E5, #7C3AED, #D946EF)',
        'gradient-hero':  'linear-gradient(135deg, #1e1b4b, #2d1b69, #4a044e)',
        'gradient-card':  'linear-gradient(145deg, #1e1b4b, #2e1065)',
      }
    },
  },
  plugins: [],
};
export default config;
