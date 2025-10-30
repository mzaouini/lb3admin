/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'liberty-primary': '#1A237E',
        'liberty-accent': '#00C48C',
        'liberty-success': '#4CAF50',
        'liberty-error': '#F44336',
        'liberty-text-primary': '#FFFFFF',
        'liberty-text-secondary': '#B0BEC5',
      },
    },
  },
  plugins: [],
}

