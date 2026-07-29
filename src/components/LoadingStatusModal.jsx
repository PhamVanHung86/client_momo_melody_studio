import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

/**
 * LoadingStatusModal - Component hiển thị thông báo tone XANH DƯƠNG PASTEL
 *
 * Props:
 * - isOpen (boolean): Bật/Tắt modal
 * - title (string): Tiêu đề chính
 * - subtitle (string): Dòng mô tả nhỏ
 * - statusText (string): Dòng chữ hiển thị kèm thanh loading
 * - logoSrc (string): Đường dẫn logo trong thư mục public (VD: "/logo.png" hoặc "/images/my-logo.svg")
 * - logoAlt (string): Thẻ alt cho logo
 * - badge (string): Nhãn dán nhỏ góc logo (mặc định: "✨")
 * - showConfetti (boolean): Bật hiệu ứng pháo hoa pastel xanh
 */
export default function LoadingStatusModal({
  isOpen = true,
  title = "Đặt hàng thành công!",
  subtitle = "Cảm ơn bạn đã ghé thăm studio ☁️",
  statusText = "Đang chuyển đến trang đơn hàng...",
  logoSrc = "/logo_red.png", // 👈 Đường dẫn ảnh từ thư mục public
  logoAlt = "Studio Logo",
  badge = "✨",
  showConfetti = true,
}) {
  // Hiệu ứng pháo hoa giấy Pastel Xanh Dương
  useEffect(() => {
    if (isOpen && showConfetti) {
      // Bắn đợt 1
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#A0C4FF", "#BEE3F8", "#E8F0FE", "#D0E1FD", "#60A5FA"],
        scalar: 0.9,
      });

      // Bắn đợt 2 tạo độ trễ sinh động
      const timer = setTimeout(() => {
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#A0C4FF", "#BEE3F8", "#93C5FD"],
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#A0C4FF", "#BEE3F8", "#93C5FD"],
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, showConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#F4F8FF]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#A0C4FF]"
        >
          {/* ================= 1. BONG BÓNG, MÂY & SAO BAY LƠ LỬNG (BACKGROUND) ================= */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { char: "☁️", top: "15%", left: "10%", duration: 4.5, delay: 0 },
              { char: "✨", top: "25%", right: "12%", duration: 5, delay: 1 },
              {
                char: "🫧",
                bottom: "20%",
                left: "15%",
                duration: 3.5,
                delay: 0.5,
              },
              {
                char: "💙",
                bottom: "25%",
                right: "18%",
                duration: 4.2,
                delay: 1.5,
              },
              { char: "⭐", top: "12%", right: "32%", duration: 6, delay: 2 },
            ].map((item, idx) => (
              <motion.span
                key={idx}
                style={{
                  position: "absolute",
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  bottom: item.bottom,
                }}
                className="text-2xl opacity-50 select-none"
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
              >
                {item.char}
              </motion.span>
            ))}
          </div>

          {/* ================= 2. THẺ CHÍNH (GLASSMORPHISM CARD) ================= */}
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative z-10 bg-white/85 backdrop-blur-xl border border-[#93C5FD]/40 rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-[0_20px_60px_rgba(160,196,255,0.3)] flex flex-col items-center gap-6"
          >
            {/* LOGO CHÍNH + GLOW XANH DƯƠNG ANIMATION */}
            <div className="relative flex items-center justify-center">
              {/* Vệt sáng xanh dương lan tỏa phía sau */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-24 h-24 bg-[#93C5FD]/50 rounded-full blur-xl"
              />

              {/* Khung chứa Logo */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-20 h-20 bg-gradient-to-tr from-[#D0E1FD] via-[#E8F0FE] to-white border-2 border-white rounded-2xl flex items-center justify-center shadow-md p-3.5 overflow-hidden"
              >
                {/* 🖼️ Ảnh Logo từ thư mục public */}
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />

                {/* Badge đính kèm góc phải */}
                {badge && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 bg-[#80B3FF] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-sm select-none"
                  >
                    {badge}
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* TIÊU ĐỀ & MÔ TẢ */}
            <div className="space-y-1.5">
              <h2
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-4xl font-bold text-[#2B3A55] drop-shadow-sm"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs font-medium text-[#4B5A75]/80 tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>

            {/* THANH TIẾN TRÌNH BLUE PASTEL PROGRESS BAR */}
            <div className="w-full bg-[#E8F0FE] border border-[#93C5FD]/30 h-3 rounded-full overflow-hidden p-0.5 relative shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "70%", "100%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full bg-gradient-to-r from-[#93C5FD] via-[#A0C4FF] to-[#60A5FA] rounded-full"
              />
            </div>

            {/* TRẠNG THÁI / LỜI NHẮN */}
            {statusText && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-xs font-medium text-[#4B5A75]/70 flex items-center justify-center gap-1.5"
              >
                <span>🫧</span> {statusText}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
