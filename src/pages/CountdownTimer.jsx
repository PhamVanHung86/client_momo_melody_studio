import React, { useState, useEffect } from "react";

const CountdownTimer = ({ currentTheme, onStatusChange }) => {
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!currentTheme) return;

    const calculateTime = () => {
      const now = new Date();
      const openTime = currentTheme.openTime
        ? new Date(currentTheme.openTime)
        : null;
      const closeTime = currentTheme.closeTime
        ? new Date(currentTheme.closeTime)
        : null;
      const manualOpen = currentTheme.isOpen;

      const formatNum = (num) => String(num).padStart(2, "0");

      // 1. Đóng thủ công
      if (!manualOpen) {
        onStatusChange(false);
        setRegistrationMessage("Cổng đăng ký hiện tại đang đóng.");
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      // 2. Chờ ngày mở
      if (openTime && now < openTime) {
        onStatusChange(false);
        const diff = openTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        setRegistrationMessage("⏳ Cổng đăng ký sẽ mở sau:");
        setTimeLeft({
          days: formatNum(days),
          hours: formatNum(hours),
          minutes: formatNum(mins),
          seconds: formatNum(secs),
        });
        return;
      }

      // 3. Quá hạn đóng
      if (closeTime && now > closeTime) {
        onStatusChange(false);
        setRegistrationMessage("Cổng đăng ký của tháng này đã đóng mất rồi!");
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      // 4. Đang mở đăng ký
      onStatusChange(true);
      if (closeTime) {
        const diff = closeTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        setRegistrationMessage("⏳ Mail club của Momo sẽ đóng sau:");
        setTimeLeft({
          days: formatNum(days),
          hours: formatNum(hours),
          minutes: formatNum(mins),
          seconds: formatNum(secs),
        });
      } else {
        setRegistrationMessage("✨ Cổng đăng ký đang được mở tự do!");
        setTimeLeft({ days: "--", hours: "--", minutes: "--", seconds: "--" });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [currentTheme, onStatusChange]);

  return (
    <div className="w-full max-w-3xl mx-auto py-6 flex flex-col items-center justify-center">
      {/* Tiêu đề trạng thái */}
      <h3 className="text-base md:text-lg font-bold text-[#2d3a5a] mb-6 flex items-center gap-2">
        {registrationMessage}
      </h3>

      {/* Các ô số retro giống hệt ảnh mẫu */}
      <div className="flex items-center gap-2 md:gap-4 mb-6">
        {/* Ngày */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-20 md:w-20 md:h-24 bg-white rounded-2xl border-2 border-[#2d3a5a] shadow-[4px_4px_0px_#2d3a5a] flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#2d3a5a] font-mono leading-none">
              {timeLeft.days}
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 md:mt-2">
              Ngày
            </span>
          </div>
        </div>

        <span className="text-2xl md:text-3xl font-bold text-[#2d3a5a] self-center -translate-y-2">
          :
        </span>

        {/* Giờ */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-20 md:w-20 md:h-24 bg-white rounded-2xl border-2 border-[#2d3a5a] shadow-[4px_4px_0px_#2d3a5a] flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#2d3a5a] font-mono leading-none">
              {timeLeft.hours}
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 md:mt-2">
              Giờ
            </span>
          </div>
        </div>

        <span className="text-2xl md:text-3xl font-bold text-[#2d3a5a] self-center -translate-y-2">
          :
        </span>

        {/* Phút */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-20 md:w-20 md:h-24 bg-white rounded-2xl border-2 border-[#2d3a5a] shadow-[4px_4px_0px_#2d3a5a] flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#2d3a5a] font-mono leading-none">
              {timeLeft.minutes}
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 md:mt-2">
              Phút
            </span>
          </div>
        </div>

        <span className="text-2xl md:text-3xl font-bold text-[#2d3a5a] self-center -translate-y-2">
          :
        </span>

        {/* Giây */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-20 md:w-20 md:h-24 bg-white rounded-2xl border-2 border-[#2d3a5a] shadow-[4px_4px_0px_#2d3a5a] flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#2d3a5a] font-mono leading-none">
              {timeLeft.seconds}
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 md:mt-2">
              Giây
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs md:text-sm text-[#4A4A6A]/80 font-medium text-center px-4 leading-relaxed">
        Hãy đăng ký ngay hôm nay để trở thành người sớm nhất nhận được Mail club
        của Momo nhé!
      </p>
    </div>
  );
};

export default CountdownTimer;
