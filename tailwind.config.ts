import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
      },
      colors: {
        primary: "#ECECEC",
        secondary: "#222831",
        third: "#393E46",
        fourth: "#00ADB5",
        grays: "#7F7F7F",
      },
    },
  },
  plugins: [],
};
export default config;
