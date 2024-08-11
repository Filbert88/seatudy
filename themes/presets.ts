"use strict";

/** @type {import('tailwindcss').Config} */
module.exports = {
  backgroundImage: {
    "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
    "gradient-conic":
      "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  },
  backgroundColor: {
    default: "#ECECEC",
  },
  fontFamily: {
    nunito: ["Nunito Sans", "sans-serif"],
  },
};
