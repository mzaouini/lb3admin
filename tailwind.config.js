/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official LibertyPay Color Palette
        'liberty-navy': '#1A237E',      // Primary Background (Deep Blue)
        'liberty-teal': '#00C48C',      // Accent (Green)
        'liberty-mint': '#4CAF50',      // Success/Secondary Green
        'liberty-gray': '#B0BEC5',      // Secondary Text
        'liberty-error': '#F44336',     // Error Red
        
        // Aliases for consistency
        'liberty-primary': '#1A237E',
        'liberty-accent': '#00C48C',
        'liberty-success': '#4CAF50',
        'liberty-text-primary': '#FFFFFF',
        'liberty-text-secondary': '#B0BEC5',
      },
    },
  },
  plugins: [],
}
