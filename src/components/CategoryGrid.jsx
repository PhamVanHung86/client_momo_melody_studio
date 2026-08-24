import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Phone Charms",
    path: "/phone-charms",
    image: "keychan.jpg",
    desc: "Charm xinh xắn",
  },
  {
    name: "Keychain",
    path: "/keychain",
    image: "phonecharm.jpg",
    desc: "Móc khóa độc đáo",
  },
  {
    name: "Pins",
    path: "/pins",
    image: "pins.jpg",
    desc: "Ghim cài cute",
  },

  {
    name: "Postcards",
    path: "/postcards",
    image: "postcard.jpg",
    desc: "Bưu thiếp vẽ tay",
  },
  {
    name: "Stickers",
    path: "/stickers",
    image: "sticker.jpg",
    desc: "Sticker đủ kiểu",
  },
  {
    name: "Mail Club",
    path: "/mail-club",
    image: "mail.png",
    desc: "Mail club bất ngờ",
  },
];

const CategoryGrid = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  // Cập nhật chỉ số khi trượt slide trên mobile
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.7)) + 1;
      setCurrentIndex(Math.min(Math.max(index, 1), categories.length));
    }
  };

  // Điều hướng nút bấm trái / phải trên mobile
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="my-12 md:my-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Tiêu đề */}
      <div className="text-center mb-10 md:mb-14">
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A]"
        >
          Bộ sưu tập 🌸
        </h2>
        <div className="w-16 h-[3px] bg-gradient-to-r from-[#FFD6E0] via-[#8B98E3] to-[#FFD6E0] rounded-full mx-auto mt-3" />
        <p className="text-sm text-[#4A4A6A]/60 mt-3">
          Tất cả đều được làm thủ công tỉ mỉ với tất cả tình yêu thương 🩵
        </p>
      </div>

      {/* Danh sách thẻ danh mục */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6 overflow-x-auto sm:overflow-visible pb-6 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {categories.map((cat) => (
          <Link
            key={cat.path}
            to={cat.path}
            className="flex-none w-[200px] sm:w-auto snap-start group cursor-pointer"
          >
            {/* KHUNG THẺ VỚI HIỆU ỨNG 3D & NỔI BÓNG */}
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#CBD1F2]/50 shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-xl group-hover:shadow-[#8B98E3]/25 group-hover:border-[#8B98E3]/70">
              {/* Hình ảnh có hiệu ứng zoom mượt */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Lớp phủ gradient chèn lên ảnh khi hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A4A6A]/70 via-[#4A4A6A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badge nút "Khám phá ✨" trượt từ dưới lên khi hover */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="bg-white/90 backdrop-blur-md text-[#4A4A6A] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  Khám phá <span className="text-[#8B98E3]">✨</span>
                </span>

                {/* Nút tròn mũi tên chỉ dẫn */}
                <span className="w-7 h-7 rounded-full bg-[#8B98E3] text-white flex items-center justify-center text-xs shadow-md transform group-hover:rotate-45 transition-transform duration-300">
                  ↗
                </span>
              </div>
            </div>

            {/* Thông tin tên & mô tả phía dưới */}
            <div className="mt-3 px-1 text-center">
              <h3 className="text-sm md:text-base font-bold text-[#4A4A6A] group-hover:text-[#8B98E3] transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-xs text-[#4A4A6A]/50 mt-0.5 group-hover:text-[#4A4A6A]/80 transition-colors">
                {cat.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Điều hướng Slider trên Điện thoại */}
      <div className="flex sm:hidden items-center justify-center gap-6 mt-6 text-[#4A4A6A]/70 text-xs">
        <button
          onClick={() => scroll("prev")}
          className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#CBD1F2]/40 flex items-center justify-center hover:text-[#8B98E3] active:scale-90 transition-all"
          aria-label="Previous"
        >
          ❮
        </button>
        <span className="font-mono text-[11px] tracking-widest font-semibold bg-white px-3 py-1 rounded-full border border-[#CBD1F2]/40">
          {currentIndex} / {categories.length}
        </span>
        <button
          onClick={() => scroll("next")}
          className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#CBD1F2]/40 flex items-center justify-center hover:text-[#8B98E3] active:scale-90 transition-all"
          aria-label="Next"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default CategoryGrid;
