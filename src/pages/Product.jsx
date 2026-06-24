import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, getProductPrice } =
    useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [added, setAdded] = useState(false);

  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (found) {
      setProduct(found);
      setMainImage(found.image[0]);
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-2xl text-[#4A4A6A]/50"
        >
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  const salePrice = product ? getProductPrice(product._id) : 0;
  const isOnSale = product && salePrice < product.price;

  return (
    <div className="min-h-screen bg-pastel-blue-light px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#4A4A6A]/50 mb-8">
        Trang chủ / {product.category} /
        <span className="text-[#4A4A6A]"> {product.name}</span>
      </p>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Ảnh sản phẩm */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Ảnh chính */}
          <div className="bg-[#FFF0F5] rounded-3xl overflow-hidden flex items-center justify-center p-6">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-h-[420px] object-contain transition-all duration-300"
            />
          </div>

          {/* Ảnh phụ */}
          {product.image.length > 1 && (
            <div className="flex gap-3">
              {product.image.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    mainImage === img
                      ? "border-[#FFB7C5]"
                      : "border-transparent hover:border-[#FFD6E0]"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {/* Tên & giá */}
          <div>
            {product.bestseller && (
              <span className="inline-block bg-[#FFF0A0] text-[#4A4A6A] text-xs font-medium px-3 py-1 rounded-full mb-3">
                ⭐ Bestseller
              </span>
            )}
            <h1
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-3xl md:text-4xl text-[#4A4A6A] leading-snug mb-2"
            >
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(4)].map((_, i) => (
                <img key={i} src={assets.star_icon} alt="" className="w-3.5" />
              ))}
              <img src={assets.star_dull_icon} alt="" className="w-3.5" />
              <span className="text-xs text-[#4A4A6A]/50 ml-2">(122)</span>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-2xl font-semibold text-[#FFB7C5]">
                {salePrice.toLocaleString()} {currency}
              </p>
              {isOnSale && (
                <>
                  <p className="text-base text-[#4A4A6A]/40 line-through">
                    {product.price.toLocaleString()} {currency}
                  </p>
                  <span className="bg-[#FF6B81] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Giảm giá 🔥
                  </span>
                </>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-orange-400 mt-1">
                ⚠️ Chỉ còn {product.stock} sản phẩm
              </p>
            )}
          </div>

          <hr className="border-[#FFD6E0]" />

          {/* Mô tả */}
          <p className="text-sm text-[#4A4A6A]/70 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-[#FFD6E0]" />

          {/* Thông tin thêm */}
          <div className="flex flex-col gap-2 text-xs text-[#4A4A6A]/60">
            <p>🩷 Sản phẩm handmade — làm thủ công 100%</p>
            <p>📦 Miễn phí vận chuyển đơn từ 300k</p>
            <p>✨ Mỗi sản phẩm là một tác phẩm độc đáo</p>
          </div>

          {/* Nút thêm giỏ hàng */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-2 w-full py-4 rounded-2xl font-semibold text-sm tracking-wider transition-all duration-300 ${
              product.stock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : added
                  ? "bg-[#FFF0A0] text-[#4A4A6A]"
                  : "bg-[#FFB7C5] text-white hover:bg-[#ff9db5] active:scale-95"
            }`}
          >
            {product.stock === 0
              ? "Hết hàng 😢"
              : added
                ? "✓ Đã thêm vào giỏ hàng!"
                : "Thêm vào giỏ hàng 🛍️"}
          </button>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <RelatedProducts category={product.category} currentId={product._id} />
    </div>
  );
};

export default Product;
