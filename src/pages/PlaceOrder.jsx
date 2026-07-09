import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PlaceOrder = () => {
  const {
    products,
    currency,
    delivery_fee,
    cartItems,
    getCartTotal,
    clearCart,
    getProductPrice,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const { user } = useAuth();
  // Tự điền từ profile
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) return;

    setLoading(true);
    setError("");

    try {
      // Chuyển cartItems thành items array
      const items = Object.entries(cartItems).map(([id, quantity]) => {
        const product = products.find((p) => p._id === id);
        return {
          product: id,
          name: product.name,
          image: product.image[0],
          price: getProductPrice(id), // ← dùng giá đã tính sale
          quantity,
        };
      });

      const subtotal = getCartTotal();
      const total = subtotal + delivery_fee;

      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items,
          shippingInfo: form,
          paymentMethod,
          subtotal,
          deliveryFee: shippingFee,
          total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        clearCart();
        setTimeout(() => navigate("/orders"), 2500);
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const FREE_SHIPPING_THRESHOLD = 300000;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🎀</span>
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl text-[#4A4A6A]"
        >
          Đặt hàng thành công!
        </h2>
        <p className="text-sm text-[#4A4A6A]/60">
          Đang chuyển đến trang đơn hàng...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
      <h1
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-4xl text-[#4A4A6A] mb-10"
      >
        Thông tin đặt hàng 🎀
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FFD6E0]/50 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[#4A4A6A] tracking-widest uppercase">
              Thông tin giao hàng
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Họ và tên <span className="text-[#FFB7C5]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-[#FFFAF5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Số điện thoại <span className="text-[#FFB7C5]">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901 234 567"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-[#FFFAF5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Địa chỉ giao hàng <span className="text-[#FFB7C5]">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={3}
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-[#FFFAF5] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Ghi chú đơn hàng
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Yêu cầu đặc biệt, màu sắc, thiết kế..."
                rows={2}
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-[#FFFAF5] resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FFD6E0]/50">
            <h2 className="text-sm font-semibold text-[#4A4A6A] tracking-widest uppercase mb-4">
              Phương thức thanh toán
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "cod", label: "💵 Thanh toán khi nhận hàng (COD)" },
                { id: "transfer", label: "🏦 Chuyển khoản ngân hàng" },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-[#FFB7C5] w-4 h-4"
                  />
                  <span className="text-sm text-[#4A4A6A] group-hover:text-[#FFB7C5] transition-colors">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

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
                  {shippingFee === 0 ? (
                    <span className="text-green-500 font-medium">Miễn phí</span>
                  ) : (
                    `${shippingFee.toLocaleString()} ${currency}`
                  )}
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-[#4A4A6A]/50 italic">
                      Mua thêm{" "}
                      {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{" "}
                      {currency} để được miễn phí vận chuyển
                    </p>
                  )}
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

            <button
              onClick={handleOrder}
              disabled={!form.name || !form.phone || !form.address || loading}
              className="mt-6 w-full bg-[#FFB7C5] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-[#ff9db5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng 🎀"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="mt-3 w-full text-center text-xs text-[#4A4A6A]/50 hover:text-[#FFB7C5] transition-colors"
            >
              ← Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
