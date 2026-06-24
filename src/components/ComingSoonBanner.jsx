import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ComingSoonBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/banners/active");
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

  return (
    <div className="my-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center mb-8">
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl md:text-4xl text-[#4A4A6A]"
        >
          Sắp ra mắt ✨
        </h2>
        <p className="text-sm text-[#4A4A6A]/50 mt-2">
          Những điều thú vị đang chờ bạn phía trước
        </p>
      </div>

      <div
        className={`grid gap-5 ${banners.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
      >
        {banners.map((banner) => {
          const daysLeft = banner.launchDate
            ? getDaysLeft(banner.launchDate)
            : null;
          const content = (
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-full">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Badge */}
              <span className="absolute top-4 left-4 bg-white/90 text-[#4A4A6A] text-xs font-semibold px-3 py-1.5 rounded-full">
                ✨ {banner.badge}
              </span>

              {/* Countdown */}
              {daysLeft !== null && daysLeft > 0 && (
                <span className="absolute top-4 right-4 bg-[#FFB7C5] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Còn {daysLeft} ngày
                </span>
              )}

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-xs text-white/80 line-clamp-2">
                    {banner.description}
                  </p>
                )}
              </div>
            </div>
          );

          return banner.linkTo ? (
            <Link key={banner._id} to={banner.linkTo}>
              {content}
            </Link>
          ) : (
            <div key={banner._id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
};

export default ComingSoonBanner;
