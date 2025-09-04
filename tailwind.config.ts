/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vk: ["VK Sans Display", "system-ui", "sans-serif"],
      },

      screens: {
        mobile: { max: "400px" },
        desktop: { min: "401px" },
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        gradient: {
          blue: "#5A8CFF",
          cyan: "#43D6FF",
          purple: "#8F3FFF",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #5A8CFF 0%, #43D6FF 50%, #8F3FFF 100%)",
        "gradient-blue-cyan":
          "linear-gradient(135deg, #5A8CFF 0%, #43D6FF 100%)",
        "gradient-cyan-purple":
          "linear-gradient(135deg, #43D6FF 0%, #8F3FFF 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #5A8CFF 0%, #8F3FFF 100%)",
      },
    },
  },
  plugins: [],
};
