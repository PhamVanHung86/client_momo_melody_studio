import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VND";
  const delivery_fee = 20000;

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [flashSale, setFlashSale] = useState(null);

  // Lấy sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
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
      const res = await fetch("http://localhost:4000/api/flash-sales/active");
      const data = await res.json();
      if (data.success && data.flashSale) setFlashSale(data.flashSale);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

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
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
