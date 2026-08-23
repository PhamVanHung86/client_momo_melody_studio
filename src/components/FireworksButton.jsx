import React from "react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom"; // 👈 Thêm import này

const FireworksButton = ({
  children,
  onClick,
  disabled = false,
  fireworks = true,
  to, // 👈 Thêm prop 'to' dùng cho chuyển trang
  type = "button",
  className = "",
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled) return;

    if (fireworks) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x, y },
        colors: ["#8B98E3", "#FFB7C5", "#FFD6E0", "#A8B5FF"],
        disableForReducedMotion: true,
      });
    }

    if (onClick) onClick(e);
    if (to) navigate(to); // 👈 Tự động điều hướng trang nếu có 'to'
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        bg-[#8B98E3] text-white font-semibold py-3 px-6 rounded-2xl
        shadow-md shadow-[#8B98E3]/30
        transition-all duration-200 ease-out transform
        hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8B98E3]/50 hover:bg-[#7B88D3]
        active:translate-y-0 active:scale-95 active:shadow-sm
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default FireworksButton;
