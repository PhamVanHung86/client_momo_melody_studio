import React, { useState, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    img: assets.hero_7,
    tag: "Bestseller",
    title: "Mail Club",
    desc: "Hộp thư bất ngờ hàng tháng — mỗi tháng một bộ sưu tập handmade giới hạn đặc biệt.",
    link: "/mail-club",
    badge: "💌 Surprise Box",
    tabColor: "bg-[#C8E6C9]",
    tapeColor: "bg-[#C8E6C9]/80",
    stampText: "MAIL CLUB",
    span: "Buy artwork",
  },
  {
    img: assets.home_7,
    tag: "Momo's Studio",
    title: "Momo's Melody",
    desc: "Tất cả sản phẩm đều được chăm chút tỉ mỉ với tất cả tình yêu thương gửi tới bạn.",
    link: "/collection",
    badge: "💖 Made With Love",
    tabColor: "bg-[#E1BEE7]",
    tapeColor: "bg-[#E1BEE7]/80",
    stampText: "WITH LOVE",
    span: "Khám phá ngay",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleTabClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <div className="relative w-full min-h-[88vh] bg-[url('/images/bg-mobile.jpg')] bg-no-repeat bg-cover bg:content py-10 md:py-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden">
      {/* 🌸 Các phần tử trang trí bồng bềnh xung quanh bàn làm việc */}
      <div className="absolute top-12 right-12 text-3xl animate-bounce duration-[4000ms] opacity-70 select-none pointer-events-none -rotate-12">
        <img
          src="/logo_red.png"
          alt="Logo"
          className="w-10 h-10 object-contain drop-shadow-sm"
        />
      </div>
      {/* 📖 BÌA SỔ CHÍNH (OPEN JOURNAL / BINDER) */}
      <div className="relative max-w-5xl w-full mx-auto my-auto flex flex-col md:flex-row items-stretch bg-[#FFFDF9] bg-[radial-gradient(#E8DFD1_1px,transparent_1px)] [background-size:18px_18px] rounded-3xl shadow-[0_20px_50px_rgba(74,74,106,0.12)] border-2 border-[#F0E6D8] p-6 sm:p-10 md:p-12">
        {/* 📚 THẺ ĐÁNH DẤU TRANG STICKY TABS (Nhô ra ở cạnh phải) */}
        <div className="absolute -right-3 md:-right-5 top-12 flex flex-col gap-3 z-30">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-[#4A4A6A] rounded-r-xl border-y border-r border-[#4A4A6A]/10 shadow-sm transition-all duration-300 flex items-center gap-1 ${
                slide.tabColor
              } ${
                activeIndex === i
                  ? "translate-x-1.5 shadow-md scale-105 font-black text-[#2B2B42]"
                  : "opacity-70 hover:opacity-100 hover:translate-x-1"
              }`}
            >
              <span>0{i + 1}</span>
              <span className="hidden lg:inline-block max-w-[80px] truncate">
                {slide.title}
              </span>
            </button>
          ))}
        </div>

        {/* 📝 TRANG SỔ TRÁI: NỘI DUNG VĂN BẢN (Page 1) */}
        <div className="w-full md:w-1/2 flex flex-col justify-between gap-6 pr-0 md:pr-8 z-10">
          <div key={activeIndex} className="space-y-4 animate-fadeIn">
            {/* Tag Thẻ Tape dán góc */}
            <div className="inline-flex items-center gap-2 bg-[#FF85A1]/15 text-[#FF85A1] border border-[#FF85A1]/30 px-3.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider -rotate-1 shadow-sm">
              <span>📌</span>
              <span>{slides[activeIndex].tag}</span>
            </div>

            {/* Tiêu đề viết tay dạng Nhật Ký */}
            <h1
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#4A4A6A] leading-tight"
            >
              {slides[activeIndex].title}
            </h1>

            {/* Dòng kẻ tay trang trí */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-[2px] bg-[#FF85A1]" />
              <div className="w-2 h-[2px] bg-[#FFB7C5]" />
              <div className="w-2 h-[2px] bg-[#FFD6E0]" />
            </div>

            {/* Đoạn mô tả mộc mạc */}
            <p className="text-sm md:text-base text-[#4A4A6A]/80 font-normal leading-relaxed">
              {slides[activeIndex].desc}
            </p>
          </div>

          {/* Cụm Action Buttons & Dấu Tem Vintage */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Link
              to={slides[activeIndex].link}
              className="inline-flex items-center gap-2 bg-[#4A4A6A] hover:bg-[#FF85A1] text-white text-xs font-bold px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider"
            >
              <span>{slides[activeIndex].span}</span>
              <span>→</span>
            </Link>

            {/* Dấu tem tròn Vintage (Postal Stamp) */}
            <div className="hidden sm:flex w-14 h-14 rounded-full border-2 border-dashed border-[#FF85A1]/50 items-center justify-center rotate-12 p-1 text-center bg-white/60 shadow-sm pointer-events-none">
              <span className="text-[8px] font-black tracking-widest text-[#FF85A1] uppercase leading-tight">
                {slides[activeIndex].stampText}
              </span>
            </div>
          </div>

          {/* Phân trang dạng chấm nhỏ ở góc trang sổ */}
          <div className="flex items-center gap-2 pt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleTabClick(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? "w-6 bg-[#FF85A1]"
                    : "w-2 bg-[#4A4A6A]/20 hover:bg-[#FF85A1]/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🔗 GÁY LÒ XO GIỮA SỔ (SPIRAL BINDER RINGS) */}
        <div className="hidden md:flex flex-col justify-between items-center h-[90%] my-auto w-6 py-2 relative z-20 -mx-3 pointer-events-none">
          {[...Array(7)].map((_, idx) => (
            <div
              key={idx}
              className="w-8 h-3 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 rounded-full shadow-md border border-gray-300/80 flex items-center justify-between px-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700/50 shadow-inner" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700/50 shadow-inner" />
            </div>
          ))}
        </div>

        {/* 🖼️ TRANG SỔ PHẢI: KHUNG ẢNH POLAROID & WASHI TAPE (Page 2) */}
        <div className="w-full md:w-1/2 flex items-center justify-center pl-0 md:pl-8 pt-8 md:pt-0 z-10">
          <div className="relative w-full max-w-[380px] bg-white p-3 sm:p-4 rounded-2xl border border-[#E8DFD1] shadow-xl rotate-1 transition-transform hover:rotate-0 duration-500">
            {/* 🩹 Đoạn Băng Dính Washi Tape đè lên đầu bức ảnh */}
            <div
              className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-28 h-6 ${slides[activeIndex].tapeColor} backdrop-blur-sm -rotate-2 border-y border-white/60 shadow-sm opacity-90`}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)",
              }}
            />

            {/* Tag Badge Nổi ở góc ảnh */}
            <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md text-[#4A4A6A] text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-[#FFD6E0]">
              {slides[activeIndex].badge}
            </div>

            {/* Swiper Slider ảnh sản phẩm */}
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              speed={800}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="w-full aspect-[4/3] sm:aspect-[1/1] rounded-xl overflow-hidden bg-[#FFF0F5]"
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

            {/* Ghi chú chân ảnh kiểu Sổ Tay */}
            <div className="flex items-center justify-between pt-3 px-1">
              <span className="text-[10px] font-mono text-[#4A4A6A]/50 uppercase tracking-wider">
                PAGE 0{activeIndex + 1} / 05
              </span>
              <span
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-sm font-bold text-[#FF85A1]"
              >
                Momo's Journal 💖
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
