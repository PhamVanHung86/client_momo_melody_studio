import React, { useContext, useState, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { ProductGridSkeleton } from "../components/ProductSkeleton";

const CATEGORIES = [
  { label: "Tất cả", value: "all" },
  { label: "Phone Charms 🌸", value: "phone-charms" },
  { label: "Keychain 🔑", value: "keychain" },
  { label: "Pins 📌", value: "pins" },
  { label: "Mail Club ✉️", value: "mail-club" },
  { label: "Postcards 🗺️", value: "postcards" },
  { label: "Stickers ⭐", value: "stickers" },
];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
  { label: "Bestseller", value: "bestseller" },
];

const Collection = () => {
  const { products, loadingProducts } = useContext(ShopContext);

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...products];

    // Filter theo category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter theo search
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.date - a.date);
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, search]);

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Banner */}
      <div className="bg-[#FFD6E0] py-14 text-center px-4">
        <span className="text-5xl">🛍️</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3"
        >
          Tất cả sản phẩm
        </h1>
        <p className="text-sm text-[#4A4A6A]/70 mt-2">
          {filtered.length} sản phẩm handmade dễ thương đang chờ bạn 🩷
        </p>
      </div>

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm... 🔍"
              className="w-full border border-[#FFD6E0] rounded-2xl px-5 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A6A]/40 hover:text-[#FFB7C5] transition-colors text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#FFD6E0] rounded-2xl px-5 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.value
                  ? "bg-[#FFB7C5] text-white shadow-sm"
                  : "bg-white text-[#4A4A6A] border border-[#FFD6E0] hover:border-[#FFB7C5]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid sản phẩm */}
        {loadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {filtered.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                stock={item.stock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl">🌸</span>
            <p
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-2xl text-[#4A4A6A]/60 mt-4"
            >
              Không tìm thấy sản phẩm nào...
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-4 text-sm text-[#FFB7C5] hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
