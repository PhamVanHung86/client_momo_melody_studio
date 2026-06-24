import React from "react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] my-16">
      <div className="relative bg-[#FFB7C5] rounded-3xl px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FFF0A0]/40 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#B8DEFF]/40 rounded-full"></div>

        <div className="relative z-10 text-center md:text-left">
          <p className="text-xs tracking-widest text-[#4A4A6A]/70 uppercase mb-2">
            Ưu đãi đặc biệt 🎀
          </p>
          <h2
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-3xl md:text-4xl text-[#4A4A6A] font-normal leading-snug mb-3"
          >
            Miễn phí vận chuyển <br /> đơn từ 300k
          </h2>
          <p className="text-sm text-[#4A4A6A]/70">
            Áp dụng toàn quốc — không cần mã giảm giá
          </p>
        </div>

        <Link
          to="/collection"
          className="relative z-10 bg-white text-[#4A4A6A] font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#FFF0A0] transition-all duration-300 whitespace-nowrap shadow-md"
        >
          Mua ngay 🛍️
        </Link>
      </div>
    </div>
  );
};

export default PromoBanner;
