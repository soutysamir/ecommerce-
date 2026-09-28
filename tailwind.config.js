/** @type {import('tailwindcss').Config } */

module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        marcellus: ["Marcellus", "serif"],
        lato: ["Lato", "sans-serif"],
        poppins: ["Poppins", "serif"],
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "selector",
};
