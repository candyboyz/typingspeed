import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "blink-left-caret": {
          "0%": { "border-left-color": "#60a5fa" },
          "25%": { "border-left-color": "#ffffff4d" },
          "50%": { "border-left-color": "#60a5fa" },
          "75%": { "border-left-color": "#ffffff4d" },
          "100%": { "border-left-color": "#60a5fa" },
        },
        "blink-right-caret": {
          "0%": { "border-right-color": "#60a5fa" },
          "25%": { "border-right-color": "#ffffff4d" },
          "50%": { "border-right-color": "#60a5fa" },
          "75%": { "border-right-color": "#ffffff4d" },
          "100%": { "border-right-color": "#60a5fa" },
        },
        "blink-underline": {
          "0%": { "border-bottom-color": "#60a5fa" },
          "25%": { "border-bottom-color": "#ffffff4d" },
          "50%": { "border-bottom-color": "#60a5fa" },
          "75%": { "border-bottom-color": "#ffffff4d" },
          "100%": { "border-bottom-color": "#60a5fa" },
        },
      },
      animation: {
        "blink-left-caret":
          "blink-left-caret 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink-right-caret":
          "blink-right-caret 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink-underline":
          "blink-underline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;

// "blink-underline": {
//           "0%": { "border-bottom": "1px solid #60a5fa" },
//           "25%": { "border-bottom": "1px solid #ffffff4d" },
//           "50%": { "border-bottom": "1px solid #60a5fa" },
//           "75%": { "border-bottom": "1px solid #ffffff4d" },
//           "100%": { "border-bottom": "1px solid #60a5fa" },
//         },
