import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rentvora: {
          black: '#111111',
          red: '#D71920',
          redHover: '#b8141a',
          redLight: '#fef2f2',
          redBorder: '#fecaca',
        },
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#D71920',
          600: '#D71920',
          700: '#b8141a',
          800: '#991116',
          900: '#7a0e12',
          950: '#450a0a',
        },
        carbon: {
          800: '#1e293b',
          900: '#111111',
          950: '#0a0a0a',
        }
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'brand': '0.2em',       // 200 tracking
        'subtitle': '0.35em',    // 350 tracking
      }
    },
  },
  plugins: [],
};
export default config;
