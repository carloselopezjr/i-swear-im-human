import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-5px,3px)" },
          "40%": { transform: "translate(4px,-4px)" },
          "60%": { transform: "translate(-4px,4px)" },
          "80%": { transform: "translate(3px,-3px)" },
        },
      },
      animation: {
        shake: "shake 0.05s infinite",
      },
    },
  },
};

export default config;
