import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4', // Koyulaştırıldı
          400: '#f472b6', // Koyulaştırıldı
          500: '#ec4899', // Koyulaştırıldı
          600: '#db2777', // Koyulaştırıldı
          700: '#be185d', // Koyulaştırıldı
          800: '#9d174d', // Koyulaştırıldı
          900: '#831843', // Koyulaştırıldı
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd', // Koyulaştırıldı
          400: '#a78bfa', // Koyulaştırıldı
          500: '#8b5cf6', // Koyulaştırıldı
          600: '#7c3aed', // Koyulaştırıldı
          700: '#6d28d9', // Koyulaştırıldı
          800: '#5b21b6', // Koyulaştırıldı
          900: '#4c1d95', // Koyulaştırıldı
        },
        indigo: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc', // Koyulaştırıldı
          400: '#38bdf8', // Koyulaştırıldı
          500: '#0ea5e9', // Koyulaştırıldı
          600: '#0284c7', // Koyulaştırıldı
          700: '#0369a1', // Koyulaştırıldı
          800: '#075985', // Koyulaştırıldı
          900: '#0c4a6e', // Koyulaştırıldı
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
});

export default config;