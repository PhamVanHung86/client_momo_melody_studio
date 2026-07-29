import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../api/client";

const ComingSoonBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(apiUrl("/api/banners/active"));
        const data = await res.json();
        if (data.success) setBanners(data.banners);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanners();
  }, []);

  if (banners.length === 0) return null;

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isSingle = banners.length === 1;

  return (
    <section className="my-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* 🌟 TIÊU ĐỀ BẮT MẮT CÓ ANIMATION */}
      <div className="text-center mb-10 flex flex-col items-center">
        {/* Tag nhỏ xinh phía trên */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#FFD6E0]/50 text-[#FF85A1] border border-[#FFB7C5]/40 mb-2 animate-pulse">
          ✦ Upcoming Release ✦
        </span>

        {/* Tiêu đề chính với hiệu ứng Lồng Chữ & Sparkle Nhún Nhảy */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#4A4A6A] flex items-center justify-center gap-2">
          <span
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="bg-gradient-to-r from-[#FF85A1] via-[#FFB7C5] to-[#4A4A6A] bg-clip-text text-transparent drop-shadow-sm pr-1"
          >
            Sắp ra mắt
          </span>
          <span className="inline-block animate-bounce text-2xl md:text-3xl">
            ✨
          </span>
        </h2>

        <p className="text-xs md:text-sm text-[#4A4A6A]/60 mt-1 max-w-md">
          Những bộ sưu tập giới hạn sắp sửa xuất hiện tại Mail Club
        </p>
      </div>

      {/* 📦 DANH SÁCH BANNER */}
      <div
        className={`grid gap-8 ${
          isSingle
            ? "max-w-4xl mx-auto grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {banners.map((banner) => {
          const daysLeft = banner.launchDate
            ? getDaysLeft(banner.launchDate)
            : null;

          const CardContent = (
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 border-[#FFD6E0]/60 shadow-md hover:shadow-2xl transition-all duration-500 bg-[#FFF0F5]">
              {/* Khung chứa ảnh */}
              <div
                className={`w-full overflow-hidden ${
                  isSingle
                    ? "aspect-[16/9] md:aspect-[21/9] min-h-[220px]"
                    : "aspect-[16/10] min-h-[240px]"
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Phủ Gradient mượt mà */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A4A]/90 via-[#2A2A4A]/30 to-transparent transition-opacity group-hover:opacity-95" />

              {/* 🏷️ TAG PHÂN LOẠI (Góc trái) */}
              {banner.badge && (
                <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 text-[#4A4A6A] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md border border-white/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF85A1]" />
                  {banner.badge}
                </div>
              )}

              {/* ⏱️ ĐỒNG HỒ ĐẾM NGƯỢC NỔI BẬT (Góc phải) */}
              {daysLeft !== null && daysLeft > 0 && (
                <div className="absolute top-4 right-4 backdrop-blur-md bg-gradient-to-r from-[#FF85A1] to-[#FFB7C5] text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  {/* Đèn LED đỏ nhấp nháy báo động live */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span>
                    Chỉ còn{" "}
                    <strong className="text-sm text-yellow-200">
                      {daysLeft}
                    </strong>{" "}
                    ngày
                  </span>
                </div>
              )}

              {/* 📝 NỘI DUNG CHỮ PHÍA DƯỚI */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-md mb-1.5 group-hover:text-[#FFD6E0] transition-colors">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-xs md:text-sm text-white/85 line-clamp-2 font-light leading-relaxed drop-shadow-sm">
                    {banner.description}
                  </p>
                )}
              </div>
            </div>
          );

          return banner.linkTo ? (
            <Link key={banner._id} to={banner.linkTo} className="block">
              {CardContent}
            </Link>
          ) : (
            <div key={banner._id}>{CardContent}</div>
          );
        })}
      </div>
    </section>
  );
};

export default ComingSoonBanner;
