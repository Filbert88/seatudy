import type { Config } from "tailwindcss";

const seatudyPreset = require("./themes/presets");
const tokens = require("./themes/tokens");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...tokens,
      ...seatudyPreset,
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
