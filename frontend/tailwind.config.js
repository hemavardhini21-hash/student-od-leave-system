/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // "Institutional ledger" palette: ink navy + campus green + brass gold on parchment.
        ink: {
          50: "#eef1f6",
          100: "#dde3ec",
          400: "#4a5872",
          600: "#26324a",
          700: "#1c2739",
          800: "#16233D",
          900: "#101a2c",
        },
        campus: {
          50: "#EFF8FD",
          100: "#DCEFFA",
          200: "#B9DFF5",
          300: "#8FCBEE",
          400: "#5FB0E0",
          500: "#3D93CB",
          600: "#2C79AC",
          700: "#235F87",
          800: "#1D4C6C",
        },
        brass: {
          50: "#EFF8FD",
          100: "#DCEFFA",
          300: "#8FCBEE",
          400: "#5FB0E0",
          500: "#3D93CB",
          600: "#2C79AC",
        },
        parchment: {
          DEFAULT: "#FAF8F2",
          100: "#F3EFE4",
          200: "#EAE3D2",
        },
        slate: {
          50: "#f4f5f6",
          400: "#7c8598",
          500: "#5B6472",
          600: "#454e5c",
        },
        // Kept for any residual references; now mapped onto the campus green scale.
        primary: {
          50: "#EFF8FD",
          100: "#DCEFFA",
          200: "#B9DFF5",
          300: "#8FCBEE",
          400: "#5FB0E0",
          500: "#3D93CB",
          600: "#2C79AC",
          700: "#235F87",
          800: "#1D4C6C",
          900: "#173F58",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 35, 61, 0.06), 0 1px 3px rgba(22, 35, 61, 0.08)",
      },
    },
  },
  plugins: [],
};
