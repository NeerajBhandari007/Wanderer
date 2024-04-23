/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
],
  theme: {
    extend: {
      backgroundImage: {
        'back': "url('/src/components/auth/page/out.jpg')",
        'coveer': "url('/src/components/user/page/cover.jpg')",
      }
    }
  },
  plugins: [],
}

