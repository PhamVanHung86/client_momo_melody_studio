import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import ProductItem from "../components/ProductItem";
import SEO from "../components/SEO";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistIds } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchWishlist = async () => {
      try {
        const res = await apiFetch("/api/wishlist");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Lỗi lấy wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
    // Đồng bộ lại khi wishlistIds đổi (VD: bỏ tim ngay tại trang khác rồi quay lại)
  }, [user, wishlistIds.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-[60vh]">
      <SEO title="Sản phẩm yêu thích" />
      <h1 className="text-2xl font-bold text-[#4A4A6A] mb-6">
        ❤️ Sản phẩm yêu thích
      </h1>

      {!user ? (
        <div className="text-center py-16 text-[#4A4A6A]/60">
          <p className="mb-4">Đăng nhập để xem danh sách yêu thích của bạn</p>
          <Link
            to="/login"
            className="inline-block bg-[#FF6B81] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#FF5069] transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      ) : loading ? (
        <p className="text-center py-16 text-[#4A4A6A]/50">Đang tải...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-[#4A4A6A]/60">
          <p className="mb-4">Bạn chưa thích sản phẩm nào cả 🤍</p>
          <Link
            to="/collection"
            className="inline-block bg-[#FF6B81] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#FF5069] transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductItem
              key={p._id}
              id={p._id}
              image={p.images}
              name={p.name}
              price={p.price}
              stock={p.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
