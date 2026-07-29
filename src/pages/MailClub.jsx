import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import qrCode from "../assets/qr-code.png";
import { MONTHS, PLANS } from "../constants/mailClubData";
import SEO from "../components/SEO";
import { apiUrl } from "../api/client";

const MailClub = () => {
  const { user } = useAuth();

  const [mcSettings, setMcSettings] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mySubscription, setMySubscription] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  // State quyết định form đăng ký có đang được phép mở hay không (dựa vào đếm ngược báo lên)
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State để lưu thông tin tháng mới nhất lấy từ danh sách collections
  const [currentTheme, setCurrentTheme] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      fetchMySubscription();
    }
    fetchCollections();
  }, [user]);

  useEffect(() => {
    if (!mcSettings?.isOpen || !mcSettings?.closeAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const close = new Date(mcSettings.closeAt).getTime();
      const diff = close - now;

      if (diff <= 0) {
        setCountdown(null);
        setMcSettings((prev) => ({ ...prev, isOpen: false }));
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mcSettings]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(apiUrl("/api/mail-club-settings"));
        const data = await res.json();
        if (data.success) setMcSettings(data.settings);
        setIsFormOpen(data.settings.isOpen);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch(
        apiUrl("/api/mail-club-collections"),
      );
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);

        if (data.collections.length > 1) {
          setExpandedMonth(data.collections[1]._id);
        }

        // LẤY THÁNG MỚI NHẤT VÀ CÁC THÔNG SỐ THỜI GIAN ĐỂ CHẠY COUNTDOWN
        if (data.collections.length > 0) {
          const latestCollection = data.collections[0];

          setCurrentTheme({
            title: latestCollection.title,
            description:
              latestCollection.description ||
              `Mail Club đặc biệt của ${MONTHS[latestCollection.month - 1]}`,
            menuImage: latestCollection.images[0] || "",
            productImages: latestCollection.images.slice(1, 5) || [],
            isOpen: latestCollection.isOpen !== false, // Nhận trạng thái đóng mở thủ công
            openTime: latestCollection.openTime || null, // Nhận thời gian mở cổng tự động
            closeTime: latestCollection.closeTime || null, // Nhận thời gian đóng cổng tự động
          });
        }
      }
    } catch (err) {
      console.error("Lỗi fetch collections:", err);
    }
  };

  const fetchMySubscription = async () => {
    try {
      const res = await fetch(apiUrl("/api/mail-club/my"), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.subscription)
        setMySubscription(data.subscription);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    console.log("📤 Gửi dữ liệu form lên Server:", {
      ...form,
      plan: selectedPlan,
      userId: user?._id || null,
    });
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/mail-club/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan,
          userId: user?._id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setShowForm(false);
        await fetchMySubscription();
        console.log("Check data gửi đi: ", data);
      } else setError(data.message);
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const statusInfo = {
    pending: { label: "⏳ Chờ xác nhận", color: "bg-[#FFF0A0] text-[#4A4A6A]" },
    active: { label: "✅ Đang active", color: "bg-[#D4F4DD] text-green-700" },
    expired: { label: "❌ Hết hạn", color: "bg-gray-100 text-gray-500" },
  };

  return (
    <>
      <SEO
        title="Mail Club"
        description="Đăng ký Mail Club — nhận quà handmade độc quyền mỗi tháng từ momo's melody studio."
        url="/mail-clup"
      />

      <div className="bg-[#FFFAF5]">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12 flex flex-col gap-16">
          {/* ===== SECTION: SẢN PHẨM THÁNG MỚI ===== */}
          {currentTheme && (
            <div className="relative bg-gradient-to-br from-[#8B98e3] to-[#E8E4F5] rounded-[2rem] px-4 py-8 md:p-10 border border-[#FFD6E0] shadow-[0_15px_40px_rgba(255,183,197,0.12)] overflow-hidden">
              {/* Decor ngôi sao lấp lánh */}
              <div className="absolute top-10 left-6 text-xl animate-bounce duration-1000">
                ✨
              </div>
              <div className="absolute top-24 right-8 text-lg animate-pulse text-[#FF8A9F]">
                💖
              </div>

              {/* Header chủ đề */}
              <div className="text-center mb-8">
                <span className="inline-block animate-pulse bg-gradient-to-r from-[#6db8e6] to-[#FF8A9F] text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  🎁 Mail Club tháng mới có gì? 🎁
                </span>
                <h2
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-4xl md:text-5xl bg-gradient-to-r from-[#FF8A9F] via-[#4A4A6A] to-[#FF8A9F] bg-clip-text text-transparent mt-3 font-bold"
                >
                  {currentTheme.title}
                </h2>
                {currentTheme.description && (
                  <p className="text-xs md:text-sm text-[#4A4A6A]/60 italic mt-2 px-4 max-w-md mx-auto">
                    "{currentTheme.description}"
                  </p>
                )}
              </div>

              {/* LAYOUT TRÊN - DƯỚI */}
              <div className="flex flex-col gap-8 items-center">
                {/* PHẦN TRÊN: POSTER CHÍNH CÓ WASHI TAPE */}
                {currentTheme.menuImage && (
                  <div className="relative w-full max-w-[360px] px-4">
                    <div className="absolute -top-3 left-8 z-10 w-24 h-6 bg-yellow-200/80 backdrop-blur-xs -rotate-12 border-b border-dashed border-yellow-300/50 flex items-center justify-center text-[9px] text-yellow-800 font-serif tracking-wider shadow-xs">
                      ★ MONTHLY SPECIAL ★
                    </div>
                    <div className="absolute -top-2 right-8 z-10 w-16 h-5 bg-[#FFD6E0]/90 backdrop-blur-xs rotate-6 border-b border-dashed border-red-300/50" />

                    <div
                      className="relative rounded-2xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.08)] border-4 border-white transform rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 cursor-pointer"
                      onClick={() => setSelectedImage(currentTheme.menuImage)}
                    >
                      <img
                        src={currentTheme.menuImage}
                        alt="Menu tháng mới"
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-end justify-center pb-3 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                          🔍 Chạm để phóng to
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHẦN DƯỚI: HÀNG ITEM TO HƠN TRÊN WEB, CĂN GIỮA */}
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between px-2 mb-3 max-w-5xl mx-auto">
                    <span className="text-xs font-bold text-[#4A4A6A] tracking-wide uppercase">
                      Items bên trong:
                    </span>
                    <span className="text-[10px] text-[#FF8A9F] flex items-center gap-1 animate-pulse md:hidden">
                      Vuốt để xem thêm ➔
                    </span>
                  </div>

                  <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none snap-x snap-mandatory touch-pan-x justify-start md:justify-center max-w-7xl mx-auto">
                    {currentTheme.productImages?.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className="flex-none w-[170px] md:flex-1 md:max-w-[250px] snap-start"
                      >
                        <div className="relative group/card cursor-pointer transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300">
                          <div className="bg-white p-2.5 md:p-3.5 pb-4 md:pb-6 rounded-xl md:rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-[#FFD6E0]/40">
                            <div className="w-full aspect-square overflow-hidden rounded-lg md:rounded-xl bg-[#FAF6F8] mb-2.5">
                              <img
                                src={img}
                                alt={`Sản phẩm ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                              />
                            </div>
                            <div className="text-center">
                              <span
                                style={{
                                  fontFamily: "'Dancing Script', cursive",
                                }}
                                className="text-lg md:text-2xl text-[#FF8A9F] font-bold block"
                              >
                                Item #{index + 1}
                              </span>
                            </div>
                          </div>
                          <span className="absolute -top-1.5 -left-1.5 text-base md:text-xl drop-shadow-xs">
                            {index % 2 === 0 ? "🍒" : "🍅"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DƯỜNG KẺ NGĂN CÁCH */}
              <hr className="border-t border-dashed border-[#FFD6E0]/80 my-6 max-w-4xl mx-auto" />
            </div>
          )}

          {/* ===== SECTION: GALLERY THEO THÁNG CŨ ===== */}
          {collections.length > 1 && (
            <div>
              <div className="text-center mb-10">
                <h2
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-3xl md:text-4xl text-[#4A4A6A] font-bold"
                >
                  Sản phẩm các tháng trước
                </h2>
                <p className="text-xs text-[#4A4A6A]/50 mt-1">
                  Xem những gì đã có trong Mail Club mỗi tháng 🎁
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {collections.slice(1).map((col) => {
                  const isExpanded = expandedMonth === col._id;

                  return (
                    <div
                      key={col._id}
                      className="bg-gradient-to-br from-[#8B98e3] to-[#E8E4F5] rounded-3xl border border-[#FFD6E0]/60 shadow-xs overflow-hidden transition-all duration-300"
                    >
                      {/* Header bar */}
                      <button
                        onClick={() =>
                          setExpandedMonth(isExpanded ? null : col._id)
                        }
                        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
                          isExpanded ? "bg-[#FFF5F7]" : "hover:bg-[#FFFFAF]/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">✨</span>
                          <div className="text-left">
                            <p className="text-base  text-[#4A4A6A]">
                              {col.title}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#4A4A6A]/40 text-xs font-mono">
                          {isExpanded ? "▲ Đóng" : "▼ Xem thêm"}
                        </span>
                      </button>

                      {/* Nội dung: Gộp chung 1 hàng duy nhất */}
                      {isExpanded && (
                        <div className="px-4 py-6 md:p-8 bg-[#FFF9FA]/50 border-t border-[#FFD6E0]/40 flex flex-col gap-4 animate-fadeIn">
                          {col.description && (
                            <p className="text-xs md:text-sm text-[#4A4A6A]/60 italic text-center max-w-md mx-auto bg-white/80 px-4 py-2 rounded-xl border border-dashed border-[#FFD6E0] mb-2">
                              "{col.description}"
                            </p>
                          )}

                          <div className="w-full">
                            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory touch-pan-x justify-start md:justify-center max-w-7xl mx-auto">
                              {col.images?.map((img, index) => (
                                <div
                                  key={index}
                                  onClick={() => setSelectedImage(img)}
                                  className="flex-none w-[150px] md:flex-1 md:max-w-[220px] snap-start"
                                >
                                  <div className="relative group/card cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300">
                                    <div className="bg-white p-2 md:p-3 pb-3.5 md:pb-5 rounded-xl md:rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.03)] border border-[#FFD6E0]/40">
                                      <div className="w-full aspect-square overflow-hidden rounded-lg md:rounded-xl bg-[#FAF6F8] mb-2">
                                        <img
                                          src={img}
                                          alt={`Sản phẩm cũ ${index + 1}`}
                                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-500"
                                        />
                                      </div>
                                      <div className="text-center">
                                        <span
                                          style={{
                                            fontFamily:
                                              "'Dancing Script', cursive",
                                          }}
                                          className="text-base md:text-xl text-[#FF8A9F] font-bold block"
                                        >
                                          {index === 0
                                            ? "Poster"
                                            : `Item #${index}`}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="absolute -top-1.5 -left-1.5 text-sm md:text-lg drop-shadow-2xs">
                                      {index % 2 === 0 ? "🍓" : "🍏"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== SECTION: MỞ ĐÓNG FORM ===== */}
          {mcSettings && mySubscription?.status !== "active" && (
            <div
              className={`rounded-3xl p-6 text-center ${
                mcSettings.isOpen
                  ? "bg-[#D4F4DD] border border-green-200"
                  : "bg-[#FFF0F5] border border-[#FFD6E0]"
              }`}
            >
              {mcSettings.isOpen ? (
                <>
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    🟢 {mcSettings.openMessage}
                  </p>
                  {countdown && (
                    <div>
                      <p className="text-xs text-green-600 mb-3">
                        Form đóng sau:
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        {[
                          { label: "Ngày", value: countdown.days },
                          { label: "Giờ", value: countdown.hours },
                          { label: "Phút", value: countdown.minutes },
                          { label: "Giây", value: countdown.seconds },
                        ].map((unit, i) => (
                          <React.Fragment key={unit.label}>
                            <div className="bg-white rounded-xl px-3 py-2 text-center min-w-[52px] shadow-sm">
                              <p className="text-lg font-bold text-[#4A4A6A]">
                                {String(unit.value).padStart(2, "0")}
                              </p>
                              <p className="text-[9px] text-[#4A4A6A]/50 uppercase">
                                {unit.label}
                              </p>
                            </div>
                            {i < 3 && (
                              <span className="text-[#4A4A6A]/30 font-bold">
                                :
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <span className="text-3xl">🔒</span>
                  <p className="text-sm font-semibold text-[#FFB7C5] mt-2">
                    {mcSettings.closedMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== SECTION: TRẠNG THÁI SUB HIỆN TẠI ===== */}
          {mySubscription && (
            <div
              className={`rounded-3xl p-6 border-2 ${
                mySubscription.status === "active"
                  ? "border-[#B8DEFF] bg-[#F0F7FF]"
                  : mySubscription.status === "pending"
                    ? "border-[#FFF0A0] bg-[#FFFDF0]"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-[#4A4A6A]/50 mb-1">
                    Gói đăng ký của bạn
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-[#4A4A6A]">
                      Mail Club{" "}
                      {mySubscription.plan === "monthly" ? "Tháng" : "Quý"}
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${statusInfo[mySubscription.status]?.color}`}
                    >
                      {statusInfo[mySubscription.status]?.label}
                    </span>
                  </div>
                </div>
                {mySubscription.status === "active" &&
                  mySubscription.endDate && (
                    <div className="text-right">
                      <p className="text-xs text-[#4A4A6A]/50">Hết hạn</p>
                      <p className="text-sm font-semibold text-[#4A4A6A]">
                        {new Date(mySubscription.endDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                      {(() => {
                        const days = getDaysLeft(mySubscription.endDate);
                        if (days < 0)
                          return (
                            <p className="text-xs text-red-500 mt-0.5">
                              ⚠️ Đã hết hạn
                            </p>
                          );
                        if (days <= 7)
                          return (
                            <p className="text-xs text-orange-500 mt-0.5">
                              ⚠️ Còn {days} ngày
                            </p>
                          );
                        return null;
                      })()}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ===== SECTION: CHỌN GÓI ===== */}
          {!mySubscription && (
            <div>
              <div className="text-center mb-10">
                <h2
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-3xl md:text-4xl text-[#4A4A6A]"
                >
                  Đăng ký Mail Club
                </h2>
                <p className="text-sm text-[#4A4A6A]/50 mt-2">
                  Chọn gói phù hợp và nhận Mail club quà mỗi tháng 🎁
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => isFormOpen && setSelectedPlan(plan.id)} // Chỉ cho phép chọn gói khi cổng mở
                    className={`relative rounded-3xl p-6 transition-all duration-300 border-2 ${
                      !isFormOpen
                        ? "opacity-50 cursor-not-allowed border-transparent bg-gray-100"
                        : selectedPlan === plan.id
                          ? `${plan.border} ${plan.bg} scale-[1.02] shadow-lg cursor-pointer`
                          : "border-transparent bg-white hover:border-[#FFD6E0] shadow-sm cursor-pointer"
                    }`}
                  >
                    {plan.recommended && isFormOpen && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B98E3] text-white text-xs font-bold px-4 py-1 rounded-full">
                        Tiết kiệm hơn ⭐
                      </span>
                    )}
                    <div className="text-center mb-5">
                      <span className="text-4xl">{plan.emoji}</span>
                      <h3 className="text-lg font-semibold text-[#4A4A6A] mt-2">
                        {plan.label}
                      </h3>
                      <p className="text-2xl font-bold text-[#FFB7C5] mt-1">
                        {plan.price}
                      </p>
                      <p className="text-xs text-[#4A4A6A]/50">
                        /{plan.duration}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {plan.benefits.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#4A4A6A]/70"
                        >
                          <span className="text-[#FFB7C5] mt-0.5">✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() =>
                    selectedPlan && isFormOpen && setShowForm(true)
                  }
                  disabled={!selectedPlan || !isFormOpen} // Khóa hoàn toàn nút nếu chưa chọn gói hoặc cổng đóng
                  className="bg-[#FFB7C5] text-white px-12 py-4 rounded-full text-sm font-semibold hover:bg-[#ff9db5] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  {!isFormOpen
                    ? "Cổng đăng ký đang đóng 🔒"
                    : "Đăng ký ngay 🌸"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== POPUP FORM ĐĂNG KÝ ===== */}
        {showForm && !submitted && (
          <>
            <div
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <h3
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-2xl text-[#4A4A6A] mb-1"
                >
                  {selectedPlan === "monthly" ? "Gói Tháng 🌸" : "Gói Quý 🎀"}
                </h3>
                <p className="text-xs text-[#4A4A6A]/50 mb-5">
                  Điền thông tin để nhận Mail Club nhé!
                </p>

                {error && (
                  <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Họ và tên
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      disabled={!!user}
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="momo@example.com"
                      disabled={!!user}
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Số điện thoại
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="0901 234 567"
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
                    <input
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="14, đường A, quận B..."
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A]"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận 🌸"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== POPUP CHUYỂN KHOẢN THÀNH CÔNG ===== */}
        {submitted && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <span className="text-5xl">🎀</span>
              <h2
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-3xl text-[#4A4A6A] mt-4 mb-2"
              >
                Đăng ký thành công!
              </h2>
              <p className="text-sm text-[#4A4A6A]/60 mb-6">
                Bạn chuyển khoản theo thông tin bên dưới để hoàn tất đăng ký nhé
                🩷
              </p>
              <div className="bg-[#FFF0F5] rounded-2xl p-4 text-left text-sm text-[#4A4A6A] mb-5">
                <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
                <p>
                  Ngân hàng: <strong>TP Bank</strong>
                </p>
                <p>
                  Số TK: <strong>24182951170</strong>
                </p>
                <p>
                  Chủ TK: <strong>TRAN THI NGOC ANH</strong>
                </p>
                <p className="text-[#FFB7C5] font-semibold mt-2">
                  Nội dung CK: TÊN - SĐT
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-[#FFD6E0]/50 shadow-xs max-w-[400px] mx-auto">
                <img
                  src={qrCode}
                  alt="Mã QR Chuyển Khoản"
                  className="w-full aspect-square object-contain rounded-lg"
                />
                <span className="text-[10px] text-gray-400 mt-1.5 font-medium">
                  Quét mã để thanh toán nhanh
                </span>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setShowForm(false);
                  fetchMySubscription();
                }}
                className="w-full py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* ===== Lightbox xem lớn ảnh =====*/}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
          >
            <img
              src={selectedImage}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              alt=""
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MailClub;
