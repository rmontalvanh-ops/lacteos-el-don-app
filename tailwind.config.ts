import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        campo: "#4B8B3B",
        campoClaro: "#6B9E3E",
        fondo: "#E3F9E5",
        bosque: "#2A463A",
        bosqueOscuro: "#2E3A25"
      }
    }
  },
  plugins: [],
};

export default config;