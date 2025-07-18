import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",  // scan everything inside src recursively
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
