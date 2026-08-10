import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { cldUrl } from "../utils/cldUrl";

const Cart = () => {
  const {
    products,
    currency,
    delivery_fee,
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getProductPrice,
  } = useContext(ShopContext);

  // Chuyển cartItems object thành array để render
  const cartList = Object.entries(cartItems).map(([id, quantity]) => ({
    _id: id,
    quantity,
  }));

  const getProduct = (id) => products.find((p) => p._id === id);

  const updateQty = (id, qty) => updateQuantity(id, qty);
  const removeItem = (id) => removeFromCart(id);

  const subtotal = getCartTotal();
  const total = subtotal + delivery_fee;

  if (cartList.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🛍️</span>
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-2xl text-[#4A4A6A]/60"
        >
          Giỏ hàng trống trơn...
        </p>
        <Link
          to="/"
          className="mt-2 bg-[#FFB7C5] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#ff9db5] transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
      {/* Tiêu đề */}
      <h1
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-4xl text-[#4A4A6A] mb-10"
      >
        Giỏ hàng của bạn 🛍️
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Danh sách sản phẩm */}
        <div className="flex-1 flex flex-col gap-4">
          {cartList.map((item) => {
            const p = getProduct(item._id);
            if (!p) return null;
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-[#FFD6E0]/50"
              >
                {/* Ảnh */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FFF0F5] flex-shrink-0">
                  <img
                    src={cldUrl(p.image[0], { width: 150 })}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#4A4A6A] truncate">
                    {p.name}
                  </p>
                  <p className="text-sm text-[#FFB7C5] font-semibold mt-1 flex items-center gap-2">
                    {getProductPrice(p._id).toLocaleString()} {currency}
                    {getProductPrice(p._id) < p.price && (
                      <span className="text-xs text-[#4A4A6A]/40 line-through">
                        {p.price.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>

                {/* Số lượng */}
                <div className="flex items-center gap-2 bg-[#FFF0F5] rounded-xl px-3 py-1">
                  <button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    className="text-[#4A4A6A] w-5 text-center hover:text-[#FFB7C5] transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="text-sm text-[#4A4A6A] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                    className="text-[#4A4A6A] w-5 text-center hover:text-[#FFB7C5] transition-colors font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Xóa */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <img src={assets.bin_icon} alt="Xóa" className="w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tổng tiền */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FFD6E0]/50 sticky top-[120px]">
            <h2
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-2xl text-[#4A4A6A] mb-6"
            >
              Tóm tắt đơn hàng
            </h2>

            <div className="flex flex-col gap-3 text-sm text-[#4A4A6A]">
              <div className="flex justify-between">
                <span className="text-[#4A4A6A]/60">Tạm tính</span>
                <span>
                  {subtotal.toLocaleString()} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A6A]/60">Phí vận chuyển</span>
                <span>
                  {delivery_fee.toLocaleString()} {currency}
                </span>
              </div>
              <hr className="border-[#FFD6E0] my-1" />
              <div className="flex justify-between font-semibold text-base">
                <span>Tổng cộng</span>
                <span className="text-[#FFB7C5]">
                  {total.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            <Link
              to="/place-order"
              className="mt-6 block w-full bg-[#FFB7C5] text-white text-center py-3 rounded-2xl text-sm font-semibold hover:bg-[#ff9db5] transition-colors"
            >
              Đặt hàng ngay →
            </Link>

            <Link
              to="/"
              className="mt-3 block w-full text-center text-xs text-[#4A4A6A]/50 hover:text-[#FFB7C5] transition-colors"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
