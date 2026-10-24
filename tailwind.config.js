/**
 * Tailwind is compiled to assets/tailwind.css with `npm run build:css`.
 * Re-run that (or `npm run watch:css`) after adding classes to index.html
 * or to a class string inside assets/app.js.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/app.js'],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#006666',
        'brand-gold': '#D4AF37',
        'brand-dark': '#1A1A1A',
        'brand-light': '#F9F9F9'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lato', 'Helvetica', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 60px -30px rgba(26, 26, 26, 0.35)'
      }
    }
  },
  plugins: []
};
