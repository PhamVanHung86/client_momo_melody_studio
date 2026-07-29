import React, { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { ProductGridSkeleton } from "../components/ProductSkeleton";
import SEO from "../components/SEO";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

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
  const { products = [], loadingProducts } = useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  // 1. Sử dụng State riêng cho ô input để nhập liệu luôn mượt mà
  const [searchInput, setSearchInput] = useState(urlSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // 2. Đồng bộ từ URL vào Input state khi URL thay đổi (ví dụ bấm tìm kiếm từ Navbar)
  useEffect(() => {
    setSearchInput(urlSearchQuery);
  }, [urlSearchQuery]);

  // 3. Reset về trang 1 khi thay đổi bộ lọc hoặc ô tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy, searchInput]);

  // 4. Xử lý Lọc & Sắp xếp
  const filtered = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    // Lọc theo Category
    if (activeCategory !== "all") {
      result = result.filter((p) => p?.category === activeCategory);
    }

    // Lọc theo Từ khóa Search
    const keyword = searchInput.trim().toLowerCase();
    if (keyword) {
      result = result.filter((p) => p?.name?.toLowerCase().includes(keyword));
    }

    // Sắp xếp
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case "bestseller":
        result.sort(
          (a, b) => (b?.bestseller ? 1 : 0) - (a?.bestseller ? 1 : 0),
        );
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, searchInput]);

  // Logic phân trang
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchParams({});
  };

  // Hàm cập nhật ô nhập liệu + Cập nhật URL
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (val.trim()) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <SEO
        title="Tất cả sản phẩm"
        description="Khám phá toàn bộ sản phẩm handmade của momo's melody studio — phone charms, keychain, pins, stickers và nhiều hơn nữa."
        url="/collection"
      />

      <div className="min-h-screen bg-[#FFFAF5]">
        {/* Banner */}
        <div className="bg-[#FFD6E0] py-14 sm:-mt-5 sm:pt-20 text-center px-4">
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
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm... 🔍"
                className="w-full border border-[#FFD6E0] rounded-2xl px-5 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A6A]/40 hover:text-[#FFB7C5] transition-colors text-lg"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
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

          {/* Danh sách sản phẩm & Phân trang */}
          {loadingProducts ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length > 0 ? (
            <>
              <p className="text-xs text-[#4A4A6A]/50 mb-6">
                Hiển thị{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} /{" "}
                {filtered.length} sản phẩm
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
                {currentProducts.map((item) => (
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

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-[#FFD6E0] text-[#4A4A6A] text-sm hover:bg-[#FFD6E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const show =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      if (!show) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-[#FFB7C5] text-white shadow-sm"
                              : "border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFD6E0]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-[#FFD6E0] text-[#4A4A6A] text-sm hover:bg-[#FFD6E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Trạng thái không tìm thấy sản phẩm */
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
                  handleClearSearch();
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
    </>
  );
};

export default Collection;
