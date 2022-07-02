const config = require('tailwindcss/defaultConfig');

module.exports = {
  content: ['./src/**/*.{vue,ts}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', ...config.theme.fontFamily.sans],
      },

      content: {
        comma: "', '",
      },
      screens: {
        '3xl': '1800px',
      },
      maxWidth: {
        '8xl': '1800px',
      },
    },
  },
  plugins: [],
};
