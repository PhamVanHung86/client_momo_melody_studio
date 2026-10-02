import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import qrCode from "../assets/qr-code.png";
import { toast } from "react-toastify";
import LoadingStatusModal from "../components/LoadingStatusModal";
import { apiFetch } from "../api/client";
import FireworksButton from "../components/FireworksButton";

// Hằng số ngưỡng miễn phí vận chuyển
const FREE_SHIPPING_THRESHOLD = 300000;

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
  const { user, syncUser } = useAuth();

  // Tự điền thông tin người dùng từ profile
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    note: "",
  });

  // Mặc định cố định phương thức thanh toán chuyển khoản
  const [paymentMethod] = useState("transfer");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tính toán tổng tiền & phí giao hàng (dùng chung cho cả logic gửi đơn và render UI)
  const subtotal = getCartTotal();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.warn("Vui lòng điền đầy đủ thông tin giao hàng 🎀");
      return;
    }

    setLoading(true);

    try {
      // Chuyển đổi cartItems sang mảng các sản phẩm trong đơn hàng
      const items = Object.entries(cartItems).map(([id, quantity]) => {
        const product = products.find((p) => p._id === id);
        return {
          product: id,
          name: product?.name || "",
          image: product?.image?.[0] || "",
          price: getProductPrice(id), // Giá đã tính giảm giá (Flash Sale)
          quantity,
        };
      });

      const res = await apiFetch("/api/orders", {
        method: "POST",
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
        syncUser(data.user);
        setSubmitted(true);
        clearCart();
        setTimeout(() => navigate("/orders"), 2500);
      } else {
        toast.error(data.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (err) {
      toast.error("Không thể kết nối Momo Melody, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <LoadingStatusModal
        title="Đặt hàng thành công!"
        subtitle="Cảm ơn bạn đã ghé thăm studio ☁️"
        statusText="Đang chuyển đến trang đơn hàng..."
        badge="✨"
      />
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

      <div className="flex flex-col lg:flex-row gap-10">
        {/* CỘT TRÁI: FORM ĐỊA CHỈ & THÔNG TIN CHUYỂN KHOẢN */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Form địa chỉ */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#CBD1F2]/50 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[#4A4A6A] tracking-widest uppercase">
              Thông tin giao hàng
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Họ và tên <span className="text-[#8B98E3]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3] bg-[#FFFAF5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Số điện thoại <span className="text-[#8B98E3]">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901 234 567"
                className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3] bg-[#FFFAF5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Địa chỉ giao hàng <span className="text-[#8B98E3]">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Địa chỉ SAU SÁP NHẬP (số nhà, đường, phường/xã, tỉnh/thành phố)"
                rows={3}
                className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3] bg-[#FFFAF5] resize-none"
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
                className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3] bg-[#FFFAF5] resize-none"
              />
            </div>
          </div>

          {/* Phương thức thanh toán Chuyển Khoản Ngân Hàng */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#CBD1F2]/50">
            <h2 className="text-sm font-semibold text-[#4A4A6A] tracking-widest uppercase mb-4 flex items-center gap-2">
              <span>🏦</span> Phương thức thanh toán
            </h2>

            <div className="bg-[#FFFAF5] p-5 rounded-2xl border border-[#CBD1F2]/80">
              <div className="flex items-center gap-2 text-sm font-medium text-[#4A4A6A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B98E3]" />
                Chuyển khoản Ngân hàng (QR Code)
              </div>

              {/* KHU VỰC QR CODE VÀ THÔNG TIN TÀI KHOẢN */}
              <div className="mt-4 pt-4 border-t border-[#CBD1F2]/60 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center bg-white p-3 rounded-2xl border border-[#CBD1F2] shadow-sm flex-shrink-0">
                  <img
                    src={qrCode}
                    alt="Mã QR Chuyển khoản"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                  <span className="text-[11px] text-[#4A4A6A]/60 mt-2 font-medium">
                    Quét mã để chuyển khoản 🌸
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col gap-2.5 text-xs text-[#4A4A6A]">
                  <div className="bg-white p-3 rounded-xl border border-[#CBD1F2]/40">
                    <span className="text-[#4A4A6A]/60 block text-[11px] mb-0.5">
                      Ngân hàng:
                    </span>
                    <span className="font-semibold text-sm text-[#4A4A6A]">
                      TP Bank
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#CBD1F2]/40">
                    <span className="text-[#4A4A6A]/60 block text-[11px] mb-0.5">
                      Số tài khoản:
                    </span>
                    <span className="font-bold text-base text-[#8B98E3] tracking-wider">
                      24182951170
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#CBD1F2]/40">
                    <span className="text-[#4A4A6A]/60 block text-[11px] mb-0.5">
                      Chủ tài khoản:
                    </span>
                    <span className="font-semibold text-sm text-[#4A4A6A] uppercase">
                      TRAN THI NGOC ANH
                    </span>
                  </div>

                  <p className="text-[11px] text-[#4A4A6A]/70 italic mt-1 bg-[#CBD1F2]/20 p-2.5 rounded-xl border border-[#CBD1F2]/40">
                    💡 <span className="font-medium">Nội dung CK:</span>{" "}
                    <span className="text-[#8B98E3] font-semibold">
                      {form.phone
                        ? `${form.phone} - Thanh toan`
                        : "[SĐT của bạn] - Thanh toan"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#CBD1F2]/50 sticky top-[120px]">
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
                </span>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-[#4A4A6A]/50 italic">
                  Mua thêm{" "}
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{" "}
                  {currency} để được miễn phí vận chuyển
                </p>
              )}

              <hr className="border-[#CBD1F2] my-1" />
              <div className="flex justify-between font-semibold text-base">
                <span>Tổng cộng</span>
                <span className="text-[#8B98E3]">
                  {total.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            <FireworksButton
              onClick={handleOrder}
              disabled={!form.name || !form.phone || !form.address || loading}
              className="mt-6 w-full text-sm"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đã chuyển khoản 🎀"}
            </FireworksButton>

            <button
              onClick={() => navigate("/cart")}
              className="mt-3 w-full text-center text-xs text-[#4A4A6A]/50 hover:text-[#8B98E3] transition-colors"
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
