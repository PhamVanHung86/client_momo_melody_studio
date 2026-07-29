/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pastel-pink": "#F8BBD0",
        "pastel-pink-light": "#FFD6E0",
        "pastel-yellow": "#FFF0A0",
        "pastel-blue": "#C0B9DD",
        "pastel-blue-1": "#8B98E3",

        "pastel-blue-light": "#E0F2F1",
        "primary-blue": "#3949AB",
        "bg-page": "#FFFAF5",
        "bg-card": "#FFF0F5",
        "text-main": "#4A4A6A",
      },
      fontFamily: {
        // Đăng ký toàn bộ danh sách font bạn đã import
        sans: ["Outfit", "sans-serif"], // Đặt Outfit làm mặc định
        balsamiq: ['"Balsamiq Sans"', "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        playwrite: ['"Playwrite GB J"', "cursive"],
        poppins: ["Poppins", "sans-serif"],
        prata: ["Prata", "serif"],
        urbanist: ["Urbanist", "sans-serif"],
      },
      keyframes: {
        cartBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
      animation: {
        "cart-bounce": "cartBounce 0.35s ease-in-out",
      },
    },
  },
  plugins: [],
};
