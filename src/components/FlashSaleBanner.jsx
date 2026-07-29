import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../api/client";

const FlashSaleBanner = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await fetch(apiUrl("/api/flash-sales/active"));
        const data = await res.json();
        if (data.success && data.flashSale) setFlashSale(data.flashSale);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFlashSale();
  }, []);

  useEffect(() => {
    if (!flashSale) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(flashSale.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale]);

  if (!flashSale || !timeLeft) return null;

  return (
    <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] my-14">
      {/* Khung Banner Chính - Dải màu Gradient Pastel + Bóng đổ Glow */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#8EC5FC] via-[#B490CA] to-[#FBC2EB] p-6 sm:p-8 md:p-10 shadow-xl shadow-[#FF85A1]/20 border border-white/40">
        {/* 🌟 Vệt sáng trang trí background (Aura Glow) */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#FF3B60]/20 rounded-full blur-3xl pointer-events-none" />

        {/* ⚡ HEADER: Tiêu đề & Đồng hồ đếm ngược */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/20">
          {/* Thông tin Flash Sale */}
          <div className="flex items-center gap-4">
            {/* Icon Sét có vòng halo phát sáng nhấp nháy */}
            <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/90 rounded-2xl shadow-md text-2xl md:text-3xl shrink-0">
              <span className="animate-bounce">⚡</span>
              <span className="absolute inset-0 rounded-2xl bg-white/50 animate-ping pointer-events-none opacity-40" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-white/30">
                  Limited Time
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm mt-0.5">
                {flashSale.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Giảm sốc{" "}
                <span className="text-yellow-200 font-bold">
                  {flashSale.discountPercent}%
                </span>{" "}
                — Nhanh tay kẻo hết! 🔥
              </p>
            </div>
          </div>

          {/* ⏱️ ĐỒNG HỒ ĐẾM NGƯỢC (Glassmorphism Cards) */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/10 px-4 py-3 rounded-2xl border border-white/20 shadow-inner">
            {[
              { label: "Giờ", value: timeLeft.hours },
              { label: "Phút", value: timeLeft.minutes },
              { label: "Giây", value: timeLeft.seconds },
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl shadow-md flex items-center justify-center border border-white/60">
                    <span className="text-base sm:text-lg font-black text-[#FF4766] tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider mt-1">
                    {unit.label}
                  </span>
                </div>
                {i < 2 && (
                  <span className="text-white font-bold text-xl mb-4 animate-pulse">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 📦 DANH SÁCH SẢN PHẨM */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {flashSale.products.map((p) => {
            const salePrice = Math.round(
              p.price * (1 - flashSale.discountPercent / 100),
            );
            return (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/80"
              >
                {/* Khung ảnh & Tag giảm giá */}
                <div className="relative aspect-square overflow-hidden bg-[#FFF0F5]">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Badge % Giảm giá dạng Ribbon cong */}
                  <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#FF4766] to-[#FF758C] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md border border-white/40 flex items-center gap-1">
                    <span>-{flashSale.discountPercent}%</span>
                  </div>

                  {/* Overlay khi Hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/90 text-[#FF4766] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      Xem ngay ✨
                    </span>
                  </div>
                </div>

                {/* Thông tin giá & tên */}
                <div className="p-3 sm:p-4 bg-white">
                  <p className="text-xs sm:text-sm font-medium text-[#4A4A6A] truncate mb-2 group-hover:text-[#FF4766] transition-colors">
                    {p.name}
                  </p>

                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <p className="text-sm sm:text-base font-black text-[#FF4766]">
                      {salePrice.toLocaleString()}đ
                    </p>
                    <p className="text-[11px] text-[#4A4A6A]/40 line-through">
                      {p.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
