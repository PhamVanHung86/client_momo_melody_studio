import React, { useContext, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
// 🚚 Import hàm flyToCart từ file utils của bạn (Hãy kiểm tra lại đúng đường dẫn nhé)
import { flyToCart } from "../utils/flyToCart";
import { cldUrl } from "../utils/cldUrl";

const ProductItem = ({ id, image, name, price, stock }) => {
  const { currency, getProductPrice, addToCart, isInWishlist, toggleWishlist } =
    useContext(ShopContext);
  const imgRef = useRef(null); // Ref trỏ đến thẻ <img> để truyền trực tiếp vào flyToCart
  const isOutOfStock = stock === 0;
  const isWished = isInWishlist(id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleWishlist(id);
    if (result?.needLogin) {
      window.location.href = "/login";
    }
  };

  const salePrice = getProductPrice(id);
  const isOnSale = salePrice < price;

  const imgUrl = Array.isArray(image) ? image[0] : image;

  // 🛒 Xử lý khi bấm nút Giỏ Hàng góc dưới
  const handleAddToCartWithFly = (e) => {
    e.preventDefault(); // Chặn thẻ <Link> chuyển hướng
    e.stopPropagation(); // Chặn sự kiện nổi bọt

    if (isOutOfStock) return;

    // 1. Thêm sản phẩm vào giỏ
    addToCart(id);

    // 2. Kích hoạt hiệu ứng bay (Truyền ref trực tiếp)
    flyToCart(imgRef);
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group relative bg-white rounded-3xl p-2.5 border border-[#FFD6E0]/60 shadow-sm hover:shadow-xl hover:shadow-[#FFB7C5]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
    >
      {/* 🖼️ KHUNG ẢNH & CHI TIẾT HOVER */}
      <div className="overflow-hidden rounded-2xl bg-[#FFF0F5] relative aspect-[3/4]">
        <img
          ref={imgRef}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${
            isOutOfStock ? "opacity-50 grayscale" : ""
          }`}
          src={cldUrl(imgUrl, { width: 500 })}
          alt={name}
          loading="lazy"
          decoding="async"
        />

        {/* 😿 Badge Hết hàng */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
            <span className="bg-white/90 backdrop-blur-md text-[#4A4A6A] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-white/50">
              Hết hàng 😿
            </span>
          </div>
        )}

        {/* 🔥 Badge Sale */}
        {isOnSale && !isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#FF6B81] to-[#FF85A1] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md border border-white/40 animate-pulse z-10">
            Sale 🔥
          </span>
        )}

        {/* ❤️ Nút yêu thích góc trên phải */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          title={isWished ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-sm shadow-md z-10 transition-transform active:scale-90 hover:scale-110"
        >
          {isWished ? "❤️" : "🤍"}
        </button>

        {/* ✨ Nút "Xem chi tiết" trượt lên khi hover (Nhấn vào sẽ chuyển sang trang chi tiết sản phẩm) */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
            <span className="bg-white/90 backdrop-blur-md text-[#FF6B81] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              Xem chi tiết ✨
            </span>
          </div>
        )}
      </div>

      {/* 📝 THÔNG TIN SẢN PHẨM */}
      <div className="mt-3 px-1 pb-1 flex flex-col justify-between flex-1">
        <p className="text-sm font-medium text-[#4A4A6A] truncate group-hover:text-[#FF6B81] transition-colors">
          {name}
        </p>

        <div className="flex items-center justify-between gap-1.5 mt-1.5 pt-2 border-t border-[#FFD6E0]/30">
          {/* Giá bán & Giá gốc */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-sm font-extrabold text-[#FF6B81]">
              {salePrice.toLocaleString()} {currency}
            </p>
            {isOnSale && (
              <p className="text-[11px] text-[#4A4A6A]/40 line-through">
                {price.toLocaleString()}
              </p>
            )}
          </div>

          {/* 🛒 Nút Giỏ Hàng nhỏ góc dưới (Thực hiện thêm sản phẩm + Bay) */}
          {!isOutOfStock ? (
            <button
              type="button"
              onClick={handleAddToCartWithFly}
              title="Thêm vào giỏ hàng"
              className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FF6B81] hover:bg-[#FF6B81] hover:text-white flex items-center justify-center text-xs transition-all duration-300 shrink-0 shadow-sm active:scale-90 cursor-pointer"
            >
              🛒
            </button>
          ) : (
            <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] shrink-0">
              🚫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
