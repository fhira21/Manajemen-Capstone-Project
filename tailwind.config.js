/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '380px',
        'xs': '480px',
      },
      colors: {
        primary: '#152259', // 
        secondary: '#1877F2', // 
        // accent: '#EF4444', // 
        // background: '#F3F4F6', // 
        // text: '#111827', // 
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5rem',   // 8px
      },
    },
  },
  plugins: [],
}