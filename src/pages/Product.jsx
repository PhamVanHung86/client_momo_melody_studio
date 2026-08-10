import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ProductReviews from "../components/ProductReviews";
import { flyToCart } from "../utils/flyToCart";
import { cldUrl } from "../utils/cldUrl";
import SEO from "../components/SEO";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, getProductPrice } =
    useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [added, setAdded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (found) {
      setProduct(found);
      setMainImage(Array.isArray(found.image) ? found.image[0] : found.image);
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    flyToCart(imgRef);
    addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF9FA] flex flex-col items-center justify-center gap-3">
        <span className="text-4xl animate-bounce">🌸</span>
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-xl text-[#FF85A1] font-semibold"
        >
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  const salePrice = product ? getProductPrice(product._id) : 0;
  const isOnSale = product && salePrice < product.price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F8FF] via-[#FFF5F8] to-[#F2F8FF] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8 transition-all duration-300">
      {product && (
        <SEO
          title={product.name}
          description={
            product.description ||
            `${product.name} — handmade từ momo's melody studio`
          }
          image={product.image?.[0]}
          url={`/product/${product._id}`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description || product.name,
            image: product.image,
            offers: {
              "@type": "Offer",
              price: salePrice,
              priceCurrency: "VND",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `https://momomelody.vn/product/${product._id}`,
            },
            // Chỉ thêm aggregateRating nếu đã có review — Google phạt SEO
            // nếu khai báo rating giả/rỗng.
            ...(product.ratingCount > 0 && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.ratingAvg,
                reviewCount: product.ratingCount,
              },
            }),
          }}
        />
      )}

      {/* 🧭 BREADCRUMB THANH ĐIỀU HƯỚNG */}
      <nav className="flex items-center gap-2 text-[11px] font-medium text-[#4A4A6A]/60 mb-6 bg-white/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/80 shadow-sm w-fit">
        <Link to="/" className="hover:text-[#FF85A1] transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="hover:text-[#FF85A1] transition-colors capitalize">
          {product.category}
        </span>
        <span>/</span>
        <span className="text-[#FF85A1] font-bold truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 📦 KHUNG SẢN PHẨM CHÍNH */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 sm:p-7 md:p-8 border border-white shadow-xl shadow-[#FFB7C5]/15 flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* 🖼️ BÊN TRÁI: BỘ BỘ ẢNH SẢN PHẨM */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          {/* Khung Ảnh Chính */}
          <div className="relative bg-[#FFF0F5] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-[#FFD6E0]/50 shadow-inner group">
            <img
              ref={imgRef}
              src={cldUrl(mainImage, { width: 800 })}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
              decoding="async"
            />

            {/* Badges Phân Loại */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.bestseller && (
                <span className="bg-gradient-to-r from-[#FFE066] to-[#FFD000] text-[#4A4A6A] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm border border-white/60 flex items-center gap-1 animate-pulse">
                  ⭐ Bestseller
                </span>
              )}
              {isOnSale && (
                <span className="bg-gradient-to-r from-[#FF6B81] to-[#FF85A1] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm border border-white/40 flex items-center gap-1">
                  🔥 Giảm giá
                </span>
              )}
            </div>

            {/* Màn Phủ Hết Hàng */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-20">
                <span className="bg-white/95 text-[#4A4A6A] text-xs font-extrabold px-4 py-2 rounded-full shadow-md border border-white">
                  Hết hàng 😢
                </span>
              </div>
            )}
          </div>

          {/* Danh Sách Ảnh Phụ (Thumbnails) */}
          {product.image.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {product.image.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                    mainImage === img
                      ? "border-[#FF85A1] scale-105 shadow-sm ring-2 ring-[#FF85A1]/30"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-[#FFD6E0]"
                  }`}
                >
                  <img
                    src={cldUrl(img, { width: 150 })}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📝 BÊN PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
          {/* Cụm thông tin trên: Tên, Đánh giá, Giá, Mô tả */}
          <div className="flex flex-col gap-3">
            {/* Tên Sản Phẩm */}
            <h1
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-2xl sm:text-3xl font-bold text-[#4A4A6A] leading-snug"
            >
              {product.name}
            </h1>

            {/* Đánh Giá */}
            <div className="flex items-center gap-2 bg-[#FFF0F5] w-fit px-2.5 py-1 rounded-full border border-[#FFD6E0]/50">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={assets.star_icon}
                    alt=""
                    className="w-3 h-3"
                  />
                ))}
                <img src={assets.star_dull_icon} alt="" className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-bold text-[#FF85A1] border-l border-[#FFD6E0] pl-2">
                4.8 / 5.0 (122 đánh giá)
              </span>
            </div>

            {/* Giá Tiền */}
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#FF6B81] to-[#FF85A1] bg-clip-text text-transparent">
                {salePrice.toLocaleString()} {currency}
              </p>
              {isOnSale && (
                <p className="text-sm text-[#4A4A6A]/40 line-through font-medium">
                  {product.price.toLocaleString()} {currency}
                </p>
              )}
            </div>

            {/* Cảnh Báo Sắp Hết Hàng */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg w-fit animate-pulse">
                ⚡ Hàng hiếm: Chỉ còn {product.stock} sản phẩm!
              </div>
            )}

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD6E0] to-transparent my-0.5" />

            {/* Mô Tả */}
            <p className="text-xs sm:text-sm text-[#4A4A6A]/80 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Cụm đáy: Mini Cards + Nút Bấm (Được đẩy xuống nhờ mt-auto) */}
          <div className="flex flex-col gap-3 pt-2 mt-auto">
            {/* Mini Cards Tiện Ích Thu Nhỏ Nằm Ở Đây */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-[#FFF5F8] p-2 rounded-xl border border-[#FFD6E0]/50 flex items-center gap-2">
                <span className="text-base">💖</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#4A4A6A]/80 leading-tight">
                  Handmade 100% thủ công
                </span>
              </div>
              <div className="bg-[#FFF5F8] p-2 rounded-xl border border-[#FFD6E0]/50 flex items-center gap-2">
                <span className="text-base">📦</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#4A4A6A]/80 leading-tight">
                  Freeship đơn từ 300k
                </span>
              </div>
              <div className="bg-[#FFF5F8] p-2 rounded-xl border border-[#FFD6E0]/50 flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#4A4A6A]/80 leading-tight">
                  Thiết kế độc quyền by Momo
                </span>
              </div>
            </div>

            {/* Nút Thêm Vào Giỏ Hàng */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : added
                    ? "bg-[#FFE066] text-[#4A4A6A] shadow-[#FFE066]/40 scale-[0.98]"
                    : "bg-gradient-to-r from-[#FF85A1] to-[#FFB7C5] text-white shadow-[#FF85A1]/30 hover:shadow-lg hover:shadow-[#FF85A1]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              }`}
            >
              {product.stock === 0 ? (
                <span>Hết hàng tạm thời 😢</span>
              ) : added ? (
                <>
                  <span className="text-lg">🎉</span>
                  <span>Đã thêm vào giỏ hàng!</span>
                </>
              ) : (
                <>
                  <span className="text-base">🛍️</span>
                  <span>Thêm vào giỏ hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ ĐÁNH GIÁ SẢN PHẨM */}
      <ProductReviews
        productId={product._id}
        ratingAvg={product.ratingAvg || 0}
        ratingCount={product.ratingCount || 0}
      />

      {/* 🌸 SẢN PHẨM LIÊN QUAN */}
      <div className="mt-12">
        <RelatedProducts category={product.category} currentId={product._id} />
      </div>
    </div>
  );
};

export default Product;
