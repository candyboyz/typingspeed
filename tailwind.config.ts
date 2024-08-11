import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "blink-caret": {
          "0%, 100%": { "border-left-color": "#60a5fa" },
          "50%": { "border-left-color": "#ffffff4d" },
        },
        "blink-underline": {
          "0%, 100%": { "border-bottom": "1px solid #60a5fa" },
          "50%": { "border-bottom": "1px solid #ffffff4d" },
        },
      },
      animation: {
        "blink-caret": "blink-caret 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink-underline":
          "blink-underline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
