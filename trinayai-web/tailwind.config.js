/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
        accent: '#00d2ff',
        futuristic: {
          blue: '#00d2ff',
          purple: '#9d50bb',
        }
      }
    },
  },
  plugins: [],
}
