import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Phone Charms",
    path: "/phone-charms",
    emoji: "🌸",
    desc: "Charm xinh xắn",
  },
  {
    name: "Keychain",
    path: "/keychain",
    emoji: "🌻",
    desc: "Móc khóa độc đáo",
  },
  { name: "Pins", path: "/pins", emoji: "🍀", desc: "Ghim cài cute" },
  {
    name: "Mail Club",
    path: "/mail-clup",
    emoji: "🕊️",
    desc: "Mail club bất ngờ",
  },
  {
    name: "Postcards",
    path: "/postcards",
    emoji: "🪻",
    desc: "Bưu thiếp vẽ tay",
  },
  { name: "Stickers", path: "/stickers", emoji: "🌼", desc: "Sticker đủ kiểu" },
];

const bgColors = [
  "bg-[#F5E6FF] hover:bg-[#EDD6FF]",
  "bg-[#E6F0FF] hover:bg-[#D6E6FF]",
  "bg-[#FFE6F0] hover:bg-[#FFD6E8]",
  "bg-[#E6FFF5] hover:bg-[#D6FFEe]",
  "bg-[#FFF5E6] hover:bg-[#FFE8D6]",
  "bg-[#E6F5FF] hover:bg-[#D6EEFF]",
];

const CategoryGrid = () => {
  return (
    <div className="my-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Tiêu đề */}
      <div className="text-center mb-12">
        <p className="text-xs text-[#8B98E3] font-medium uppercase tracking-[0.2em] mb-3">
          Bộ sưu tập
        </p>
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A]"
        >
          Khám phá danh mục
        </h2>
        <div className="w-12 h-[2px] bg-[#C9C9EA] rounded-full mx-auto mt-4" />
        <p className="text-sm text-[#4A4A6A]/50 mt-4">
          Tất cả đều được làm thủ công tỉ mỉ với tất cả tình yêu thương 🩷
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.path}
            to={cat.path}
            className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl ${bgColors[i]} transition-all duration-300 group hover:scale-[1.04] hover:shadow-lg hover:shadow-[#8B98E3]/10`}
          >
            {/* Emoji */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-md transition-all duration-300">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </span>
            </div>

            {/* Text */}
            <div className="text-center">
              <p className="text-sm font-semibold text-[#4A4A6A]">{cat.name}</p>
              <p className="text-[11px] text-[#4A4A6A]/50 mt-0.5">{cat.desc}</p>
            </div>

            {/* Arrow */}
            <span className="text-[10px] text-[#8B98E3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wider">
              Xem ngay →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
