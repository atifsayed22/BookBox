/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        'primary-dark': '#1557b0',
      },
    },
  },
  plugins: [],
}

