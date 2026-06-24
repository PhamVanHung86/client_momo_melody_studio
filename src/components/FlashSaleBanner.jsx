import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FlashSaleBanner = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/flash-sales/active");
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
    <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] my-12">
      <div className="bg-gradient-to-r from-[#FF6B81] to-[#FFB7C5] rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {flashSale.title}
              </h2>
              <p className="text-xs text-white/80">
                Giảm ngay {flashSale.discountPercent}% — số lượng có hạn!
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            {[
              { label: "Giờ", value: timeLeft.hours },
              { label: "Phút", value: timeLeft.minutes },
              { label: "Giây", value: timeLeft.seconds },
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                <div className="bg-white/20 rounded-xl px-3 py-2 text-center min-w-[50px]">
                  <p className="text-lg font-bold text-white">
                    {String(unit.value).padStart(2, "0")}
                  </p>
                  <p className="text-[9px] text-white/70 uppercase">
                    {unit.label}
                  </p>
                </div>
                {i < 2 && <span className="text-white text-lg">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {flashSale.products.map((p) => {
            const salePrice = Math.round(
              p.price * (1 - flashSale.discountPercent / 100),
            );
            return (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="bg-white rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden bg-[#FFF0F5]">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#FF6B81] text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{flashSale.discountPercent}%
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#4A4A6A] truncate mb-1">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#FF6B81]">
                      {salePrice.toLocaleString()}đ
                    </p>
                    <p className="text-xs text-[#4A4A6A]/40 line-through">
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
