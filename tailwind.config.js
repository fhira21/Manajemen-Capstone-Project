/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#152259', // 
        secondary: '#1877F2', // 
        // accent: '#EF4444', // 
        // background: '#F3F4F6', // 
        // text: '#111827', // 
      },
    },
  },
  plugins: [],
}