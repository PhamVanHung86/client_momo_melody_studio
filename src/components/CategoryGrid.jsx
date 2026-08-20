import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// Bạn có thể import ảnh từ thư mục assets hoặc dùng link ảnh / Cloudinary URL
const categories = [
  {
    name: "Phone Charms",
    path: "/phone-charms",
    image: "phone.jpg",
    desc: "Charm xinh xắn",
  },
  {
    name: "Keychain",
    path: "/keychain",
    image: "key.png",
    desc: "Móc khóa độc đáo",
  },
  {
    name: "Pins",
    path: "/pins",
    image: "pins.jpg",
    desc: "Ghim cài cute",
  },
  {
    name: "Mail Club",
    path: "/mail-club",
    image: "mail.png",
    desc: "Mail club bất ngờ",
  },
  {
    name: "Postcards",
    path: "/postcards",
    image: "card.png",
    desc: "Bưu thiếp vẽ tay",
  },
  {
    name: "Stickers",
    path: "/stickers",
    image: "sticker.png",
    desc: "Sticker đủ kiểu",
  },
];

const CategoryGrid = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  // Xử lý cập nhật chỉ số khi trượt trên điện thoại
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.7)) + 1;
      setCurrentIndex(Math.min(Math.max(index, 1), categories.length));
    }
  };

  // Điều hướng nút bấm trái / phải
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
      <div className="text-center mb-8 md:mb-12">
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A]"
        >
          Bộ sưu tập
        </h2>
        <div className="w-12 h-[2px] bg-[#C9C9EA] rounded-full mx-auto mt-3" />
        <p className="text-sm text-[#4A4A6A]/60 mt-3">
          Tất cả đều được làm thủ công tỉ mỉ với tất cả tình yêu thương 🩷
        </p>
      </div>

      {/* Danh sách thẻ: Slide trượt trên Mobile / Grid trên Web */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {categories.map((cat) => (
          <Link
            key={cat.path}
            to={cat.path}
            className="flex-none w-[200px] sm:w-auto snap-start group flex flex-col cursor-pointer"
          >
            {/* Khung ảnh */}
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-[#FAF6F8] mb-3 border border-[#FFD6E0]/40 shadow-xs">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Thông tin tên & mô tả */}
            <div className="px-1 text-left sm:text-center">
              <h3 className="text-sm md:text-base font-semibold text-[#4A4A6A] group-hover:text-[#8B98E3] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#4A4A6A]/50 mt-0.5">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bộ điều hướng chỉ hiển thị trên Điện thoại (Giống ảnh mẫu) */}
      <div className="flex sm:hidden items-center justify-center gap-6 mt-4 text-[#4A4A6A]/70 text-xs">
        <button
          onClick={() => scroll("prev")}
          className="p-2 hover:text-[#8B98E3] active:scale-95 transition-transform"
          aria-label="Previous"
        >
          ❮
        </button>
        <span className="font-mono text-[11px] tracking-widest">
          {currentIndex} / {categories.length}
        </span>
        <button
          onClick={() => scroll("next")}
          className="p-2 hover:text-[#8B98E3] active:scale-95 transition-transform"
          aria-label="Next"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default CategoryGrid;
