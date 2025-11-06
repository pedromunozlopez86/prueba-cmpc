/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4", // Verde muy claro
          100: "#dcfce7", // Verde pastel
          200: "#bbf7d0", // Verde suave
          300: "#86efac", // Verde claro
          400: "#4ade80", // Verde medio claro
          500: "#22c55e", // Verde CMPC (principal)
          600: "#16a34a", // Verde intenso
          700: "#15803d", // Verde oscuro
          800: "#166534", // Verde muy oscuro
          900: "#14532d", // Verde profundo
        },
        cmpc: {
          green: "#22c55e", // Verde corporativo CMPC
          "green-dark": "#16a34a", // Verde oscuro CMPC
          "green-light": "#4ade80", // Verde claro CMPC
        },
      },
    },
  },
  plugins: [],
};
