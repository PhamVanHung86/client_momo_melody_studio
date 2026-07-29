import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { ProductGridSkeleton } from "./ProductSkeleton";

const ITEMS_PER_PAGE = 8;

const CategoryPage = ({ title, category, emoji, description }) => {
  const { products, loadingProducts } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase(),
  );

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

  return (
    <div className="bg-[#FFFAF5]">
      {/* Banner */}
      <div className="bg-pastel-blue-light py-14 sm:pt-20 sm:-mt-5 text-center px-4">
        <span className="text-5xl">{emoji}</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3"
        >
          {title}
        </h1>
        <p className="text-sm text-[#4A4A6A]/70 mt-2 max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
        {loadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <>
            {/* Thông tin số lượng */}
            <p className="text-xs text-[#4A4A6A]/50 mb-6">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} /{" "}
              {filtered.length} sản phẩm
            </p>

            {/* Grid sản phẩm */}
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
                {/* Nút Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full border border-[#FFD6E0] text-[#4A4A6A] text-sm hover:bg-[#FFD6E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  ←
                </button>

                {/* Số trang */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Hiện trang đầu, trang cuối, trang hiện tại và 1 trang lân cận
                    const show =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    const showDotsBefore =
                      page === currentPage - 2 && currentPage > 3;

                    const showDotsAfter =
                      page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showDotsBefore)
                      return (
                        <span
                          key={`dots-before`}
                          className="text-[#4A4A6A]/30 text-sm px-1"
                        >
                          ...
                        </span>
                      );

                    if (showDotsAfter)
                      return (
                        <span
                          key={`dots-after`}
                          className="text-[#4A4A6A]/30 text-sm px-1"
                        >
                          ...
                        </span>
                      );

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

                {/* Nút Next */}
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
          <div className="text-center py-24">
            <span className="text-5xl spin-slow">🌸</span>
            <p
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-2xl text-[#4A4A6A]/60 mt-4"
            >
              Sản phẩm đang được chuẩn bị...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
