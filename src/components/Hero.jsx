import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    img: assets.hero_2,
    tag: "New Arrival",
    title: "Phone Charms",
    desc: "Những chiếc charm xinh xắn làm thủ công, biến điện thoại của bạn thành tác phẩm nghệ thuật mang đậm dấu ấn cá nhân.",
    link: "/phone-charms",
  },
  {
    img: assets.hero_3,
    tag: "Handmade",
    title: "Keychain",
    desc: "Móc khóa và ghim cài áo độc đáo — người bạn đồng hành của mọi chuyến đi.",
    link: "/keychain",
  },
  {
    img: assets.hero_1,
    tag: "Limited",
    title: "Stickers & Postcards",
    desc: "Sticker cute và bưu thiếp vẽ tay — gửi gắm yêu thương qua từng nét vẽ.",
    link: "/stickers",
  },
  {
    img: assets.hero_7,
    tag: "Bestseller",
    title: "Mail Club",
    desc: "Hộp thư bất ngờ hàng tháng — mỗi tháng một bộ sưu tập handmade độc quyền.",
    link: "/mail-clup",
  },
  {
    img: assets.home_7,
    tag: "Momo's Studio",
    title: "momo's melody studio",
    desc: "Tất cả đều được làm thủ công tỉ mỉ với tất cả tình yêu thương.",
    link: "/collection",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full bg-[url('/images/bg-mobile.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-8xl mx-auto px-8 md:px-16 lg:px-24 py-0 flex flex-col md:flex-row items-center min-h-[88vh]">
        {/* Trái: Text — 40% */}
        <div className="w-full md:w-[40%] flex flex-col gap-5 py-12 md:py-0 pr-0 md:pr-8 pl-16">
          {/* Tag */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-[1.5px] bg-[#FFB7C5]" />
            <span className="text-[11px] text-[#4A4A6A]/50 font-medium uppercase tracking-[0.2em]">
              {slides[activeIndex].tag}
            </span>
          </div>

          {/* Tiêu đề */}
          <h1
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-[3.5rem] md:text-[4rem] lg:text-[5rem] text-[#4A4A6A] font-normal leading-[1.1]"
          >
            {slides[activeIndex].title}
          </h1>

          {/* Divider */}
          <div className="w-10 h-[2px] bg-[#FFB7C5] rounded-full" />

          {/* Mô tả */}
          <p className="text-[13px] md:text-sm text-white leading-relaxed">
            {slides[activeIndex].desc}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-5 mt-1">
            <Link
              to={slides[activeIndex].link}
              className="inline-flex items-center gap-2 bg-[#4A4A6A] text-white text-[11px] font-semibold px-6 py-3 rounded-full hover:bg-[#FFB7C5] transition-all duration-300 shadow-md active:scale-95 uppercase tracking-[0.15em]"
            >
              Khám phá ngay →
            </Link>
            <Link
              to="/collection"
              className="text-[11px] text-[#4A4A6A]/40 hover:text-[#FFB7C5] transition-colors underline underline-offset-4 tracking-wide"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-3">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? "w-5 h-[7px] bg-[#FFB7C5]"
                    : "w-[7px] h-[7px] bg-[#4A4A6A]/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Phải: Ảnh — 60% */}
        <div className="w-full md:w-[55%] h-full flex items-right justify-end py-4 md:py-10">
          <div className="relative w-full">
            {/* Blob trang trí */}
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#FFD6E0]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 right-20 w-32 h-32 bg-[#B8DEFF]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Swiper */}
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              speed={1000}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="w-full rounded-2xl overflow-hidden shadow-xl shadow-[#4A4A6A]/10"
              style={{ aspectRatio: "16/10" }}
            >
              {slides.map((slide, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Badge */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md">
              <p className="text-[9px] text-[#4A4A6A]/40 uppercase tracking-wider">
                Handmade with love
              </p>
              <p
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-sm text-[#4A4A6A] mt-0.5"
              >
                momo's melody 🩷
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
