import { createContext, useState, useEffect } from "react";
import { apiUrl, apiFetch } from "../api/client";
import { useAuth } from "./AuthContext";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VND";
  const delivery_fee = 20000;
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [flashSale, setFlashSale] = useState(null);
  // ❤️ Wishlist — chỉ lưu mảng ID để check nhanh (Set-like), danh sách đầy
  // đủ (có ảnh, giá...) chỉ load khi vào hẳn trang Wishlist.
  const [wishlistIds, setWishlistIds] = useState([]);

  // Lấy sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const res = await fetch(apiUrl("/api/products"));
      const data = await res.json();
      if (data.success) {
        // Map "images" (DB) → "image" (code cũ đang dùng)
        const formatted = data.products.map((p) => ({
          ...p,
          image: p.images,
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchFlashSale = async () => {
    try {
      const res = await fetch(apiUrl("/api/flash-sales/active"));
      const data = await res.json();
      if (data.success && data.flashSale) setFlashSale(data.flashSale);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

  // Nạp wishlist khi user đăng nhập, xoá khi đăng xuất
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    const fetchWishlist = async () => {
      try {
        const res = await apiFetch("/api/wishlist");
        const data = await res.json();
        if (data.success) setWishlistIds(data.products.map((p) => p._id));
      } catch (err) {
        console.error("Lỗi lấy wishlist:", err);
      }
    };
    fetchWishlist();
  }, [user]);

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId) => {
    if (!user) return { needLogin: true };
    try {
      const res = await apiFetch(`/api/wishlist/${productId}/toggle`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setWishlistIds((prev) =>
          data.inWishlist
            ? [...prev, productId]
            : prev.filter((id) => id !== productId),
        );
      }
      return data;
    } catch (err) {
      console.error("Lỗi cập nhật wishlist:", err);
      return { success: false };
    }
  };

  // Load cart từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const getCartCount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const exists = products.some((p) => p._id === id);
      return exists ? sum + qty : sum;
    }, 0);
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return 0;

    if (flashSale && flashSale.products) {
      const onSale = flashSale.products.some((p) => p._id === productId);
      if (onSale) {
        return Math.round(
          product.price * (1 - flashSale.discountPercent / 100),
        );
      }
    }
    return product.price;
  };

  // Cập nhật getCartTotal dùng giá đã tính sale:
  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      return sum + getProductPrice(id) * qty;
    }, 0);
  };

  const value = {
    products,
    loadingProducts,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartTotal,
    clearCart,
    fetchProducts,
    flashSale,
    getProductPrice,
    wishlistIds,
    isInWishlist,
    toggleWishlist,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
