/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'liberty-navy': '#1a2332',
        'liberty-teal': '#0d9488',
        'liberty-mint': '#00c48c',
        'liberty-gold': '#dc8b5e',
      },
    },
  },
  plugins: [],
}

