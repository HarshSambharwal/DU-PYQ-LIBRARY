import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          deep: "#163937",
          green: "#32624D",
          gold: "#DDB643",
          earth: "#905F1E",
          rust: "#561C0D",
          cream: "#F6F1E3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
