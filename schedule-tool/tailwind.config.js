/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        pink: 'var(--color-pink)',
        teal: 'var(--color-teal)',
        gray: 'var(--color-gray)',
      },
    },
  },
  plugins: [],
}

