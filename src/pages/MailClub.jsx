import React, { useState, useEffect, useRef } from "react";

const PRICE_PER_MONTH = 135000;
const QUARTERLY_DISCOUNT = 0.1;

const GALLERY_T4 = [
  "/images/t4_menu.jpg",
  "/images/t4_postcard.jpg",
  "/images/t4_stickers.jpg",
  "/images/t4_calander.jpg",
];

const GALLERY_T5 = [
  "/images/pic_menu.png",
  "/images/pic_postcard.jpg",
  "/images/pic_letter.jpg",
  "/images/pic_washi.jpg",
];

const FAQS = [
  {
    q: "📬 Bao lâu thì mình nhận được Mail club?",
    a: "Momo Melody Studio sẽ mở phiếu đăng ký từ ngày 10 đến ngày 25 mỗi tháng và Momo sẽ gửi cho bạn vào ngày 15 và 25. Thường bạn sẽ nhận được mailclub sau 2-4 ngày kể từ ngày momo giao hàng nhé!",
  },
  {
    q: "✨ Chất liệu giấy postcard có tốt không?",
    a: "Dạ cực kỳ xịn luôn nha! Postcard A6 sử dụng giấy mỹ thuật sần nhập khẩu định lượng 300gsm cứng cáp, sờ vào rất đã tay.",
  },
  {
    q: "❌ Mình có thể huỷ hoặc bảo lưu gói đăng ký không?",
    a: "Có chứ bạn yêu ơi. Bạn chỉ cần inbox về cho page của Momo Melody Studio trước ngày 25 của tháng là có thể thoải mái tạm dừng hoặc dời sang tháng kế tiếp, chúng mình bảo lưu hoàn toàn miễn phí nhé!",
  },
  {
    q: "🌻 Chi phí trên đã bao gồm tiền ship chưa?",
    a: "Mức chi phí 135,000đ/tháng đã bao gồm trọn vẹn chi phí sản xuất hộp quà handmade cùng trọn bộ sản phẩm bao gồm cả phí ship toàn khu vực nước Việt Nam.",
  },
];

// Carousel ngang dùng lại cho nhiều bộ ảnh
const Gallery = ({ images, ctaLabel }) => (
  <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
    {images.map((src, i) => (
      <div
        key={i}
        className="snap-center shrink-0 w-[60vw] sm:w-[240px] flex flex-col items-center group"
      >
        <img
          src={src}
          alt=""
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x500/E0F2FE/334155?text=Momo";
          }}
          className="w-full h-[320px] md:h-[320px] object-cover rounded-3xl border-4 border-[#334155] shadow-[4px_4px_0px_#334155] group-hover:-translate-y-2 transition-transform"
        />
        {i === 0 && ctaLabel && (
          <span className="inline-block bg-[#8f9eeb] hover:bg-[#ff8387] text-white font-bold mt-5 px-5 py-2.5 rounded-full shadow-[4px_4px_0px_#334155] border-2 border-[#334155] transition-all text-sm tracking-wide cursor-default">
            {ctaLabel}
          </span>
        )}
      </div>
    ))}
  </div>
);

const MailClub = () => {
  // ---- Countdown ----
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const tick = () => {
      const distance = targetDate.getTime() - new Date().getTime();
      if (distance < 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---- Form: tháng đã chọn + giá ----
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMonth = (value) => {
    setSelectedMonths((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value],
    );
  };

  const hasQuarterly = selectedMonths.includes("Quý 3");
  const otherMonthsCount = selectedMonths.filter((m) => m !== "Quý 3").length;

  let totalPrice = 0;
  if (selectedMonths.length > 0) {
    if (hasQuarterly) {
      const quarterlyPrice = PRICE_PER_MONTH * 3 * (1 - QUARTERLY_DISCOUNT);
      totalPrice = quarterlyPrice + otherMonthsCount * PRICE_PER_MONTH;
    } else {
      totalPrice = selectedMonths.length * PRICE_PER_MONTH;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    payload.append("Họ Tên", formData.name);
    payload.append("Email", formData.email);
    payload.append("SĐT", formData.phone);
    payload.append("Địa chỉ", formData.address);
    selectedMonths.forEach((m) => payload.append("months", m));

    try {
      await fetch("https://formspree.io/f/mjgdaorq", {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      console.error("Lỗi gửi form:", err);
    } finally {
      setShowModal(true);
      setFormData({ name: "", email: "", phone: "", address: "" });
      setSelectedMonths([]);
      setSubmitting(false);
    }
  };

  // ---- FAQ accordion ----
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="font-['Nunito',sans-serif] text-[#1E293B] bg-[#F4F9FF] relative overflow-x-hidden">
      {/* Keyframes dùng cho hiệu ứng động trong toàn trang */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle { animation: wiggle 3s ease-in-out infinite; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: floatY 4s ease-in-out infinite; }

        @keyframes drift {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(10%); }
          100% { transform: translateX(-10%); }
        }
        .animate-drift { animation: drift 25s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.7s ease-out forwards; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.35s; }
        .fade-up-4 { animation-delay: 0.5s; }
        .fade-up-5 { animation-delay: 0.65s; }
      `}</style>

      {/* Hero Section */}
      <section className="bg-[#8f9eeb] relative pt-8 pb-12 md:py-16 overflow-hidden px-6">
        {/* Mây trôi trang trí */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] animate-drift opacity-40">
            <svg
              className="w-20 h-12 text-white fill-current"
              viewBox="0 0 100 60"
            >
              <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,45 C85,55 60,60 45,50 C30,60 15,55 20,40 Z" />
            </svg>
          </div>
          <div
            className="absolute top-[55%] right-[4%] animate-drift opacity-30"
            style={{ animationDelay: "-8s" }}
          >
            <svg
              className="w-28 h-16 text-white fill-current"
              viewBox="0 0 100 60"
            >
              <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,45 C85,55 60,60 45,50 C30,60 15,55 20,40 Z" />
            </svg>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-7 space-y-8 text-center md:text-left">
            <div className="fade-up fade-up-1 inline-flex items-center gap-2 bg-[#ff8387] border-2 border-[#334155] px-4 py-1.5 rounded-full text-sm font-bold text-[#334155] animate-wiggle">
              <span className="text-lg">✨</span> Chào mừng bạn đến với thế giới
              đầy sáng tạo của Momo!
            </div>
            <h1 className="fade-up fade-up-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Quicksand',sans-serif] text-[#1E293B] tracking-tight leading-tight">
              💌 Nhận một Mail club{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CBE2FD] to-[#ff8387]">
                dễ thương
              </span>{" "}
              mỗi tháng
            </h1>
            <p className="fade-up fade-up-3 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
              Từ những tấm postcard A6 vẽ tay đầy chân thành, những bộ sticker
              phủ kim tuyến lấp lánh độc quyền đến các mẫu washi sticker nhỏ
              xinh, tất cả đều được Momomeomeow nâng niu đóng gói và gửi thẳng
              đến góc nhỏ thân thương của bạn.
            </p>
            <div className="fade-up fade-up-4 flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
              <a
                href="#register"
                className="bg-[#FFF2CC] text-[#1E293B] font-bold text-lg px-8 py-4 rounded-2xl border-4 border-[#334155] shadow-[4px_4px_0px_#334155] hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-[1.03] transition-all text-center group"
              >
                🎁 Đăng ký nhận Mail club tháng tới{" "}
                <span className="inline-block group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
            <div className="fade-up fade-up-5 flex items-center justify-center md:justify-start gap-3 text-sm text-[#334155] font-bold">
              <span className="w-8 h-8 rounded-full border-2 border-dashed border-[#334155]/40 flex items-center justify-center text-xs animate-wiggle">
                🎶
              </span>
              Momo Melody Studio
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[340px] md:max-w-[400px] fade-up fade-up-3">
              <div className="bg-white border-4 border-[#334155] p-6 rounded-3xl shadow-[4px_4px_0px_#334155] relative animate-float">
                <div className="border-2 border-dashed border-[#334155]/40 bg-[#FFFDF9] rounded-2xl p-4 mt-4 text-center space-y-4">
                  <span className="text-5xl block animate-wiggle">🍀</span>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    "Momomeomeow thường lấy cảm hứng từ mèo, những cô gái và các
                    yếu tố thần tiên, huyền ảo để xây dựng thế giới sáng tạo của
                    mình."
                  </p>
                  <div className="flex justify-center gap-1.5 text-xs">
                    ⭐️ ⭐️ ⭐️ ⭐️ ⭐️
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 bg-[#E0F2FE] border-4 border-[#334155] p-3 rounded-2xl flex items-center gap-2 shadow-[4px_4px_0px_#334155]">
                  <span className="text-3xl">🎨</span>
                  <div>
                    <h4 className="font-extrabold text-xs leading-tight">
                      Momo Mascot
                    </h4>
                    <p className="text-[9px] text-gray-500">
                      Người gom nhặt mộng mơ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu sản phẩm tháng này */}
      <section id="about" className="py-12 bg-white relative z-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-block bg-[#CBE2FD] text-[#ff8387] font-bold px-4 py-1.5 rounded-full text-xs border-2 border-[#334155]">
              🎨 DESIGN BY MOMO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ff8387]">
              Mail club tháng 7 này có gì bất ngờ?
            </h2>
            <p className="text-slate-500">
              Mỗi ấn phẩm đều được mình tự tay phác thảo, in ấn trên chất liệu
              chọn lọc để chạm tới trái tim người yêu nghệ thuật.
            </p>
            <img
              className="aspect-[3/4] w-full"
              src="/images/t7_menu.jpg"
              alt=""
              className="rounded-xl"
            />
          </div>

          <Gallery
            images={[
              "/images/t7_postcard.jpg",
              "/images/t7_stick.jpg",
              "/images/t7_stick2.jpg",
              "/images/t7_note.jpg",
              "/images/t7_calendar.jpg",
            ]}
          />
        </div>
      </section>

      {/* Gallery tháng 4 & tháng 5 */}
      <section
        id="gallery"
        className="py-12 bg-[#F4F9FF]/50 relative border-t-2 border-b-2 border-dashed border-[#334155]/10 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-extrabold mb-3">
                📸 Ngắm nghía ấn phẩm của mình
              </h2>
              <p className="text-slate-500 max-w-xl">
                Bạn hãy <strong>vuốt sang trái</strong> để khám phá từng món đồ
                lấp lánh của Momo nhé!
              </p>
            </div>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <span className="bg-[#4D7C0F] text-white border-2 border-[#334155] px-5 py-2 rounded-full text-lg font-bold">
                Tháng 4: 🍵 Giai Điệu Matcha Ngọt Ngào 🐱
              </span>
            </div>
            <Gallery images={GALLERY_T4} ctaLabel="Set Matcha Mèo" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <span className="bg-[#d6a362] text-white border-2 border-[#334155] px-5 py-2 rounded-full text-lg font-bold">
                Tháng 5: ☕ Tiệm Cà Phê Mèo Bận Rộn 🐱
              </span>
            </div>
            <Gallery images={GALLERY_T5} ctaLabel="Set Cà Phê Mèo" />
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-10 bg-gradient-to-br from-[#CBE2FD] via-[#E2EFFF] to-[#FFF2CC] px-6 relative border-t-2 border-b-2 border-[#334155]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2 flex-wrap">
            ⏳ Đăng ký Mail club{" "}
            <span className="text-[#8f9eeb] underline decoration-wavy">
              Tháng 7
            </span>{" "}
            của Momo sẽ đóng sau:
          </h3>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              ["days", "Ngày"],
              ["hours", "Giờ"],
              ["minutes", "Phút"],
              ["seconds", "Giây"],
            ].map(([key, label]) => (
              <React.Fragment key={key}>
                <div className="bg-white border-2 border-[#334155] px-4 py-3 rounded-2xl shadow-[4px_4px_0px_#334155] text-center w-20">
                  <span className="text-3xl font-extrabold block">
                    {countdown[key]}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    {label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <p className="text-sm font-bold text-slate-600">
            Hãy đăng ký ngay hôm nay để trở thành người sớm nhất nhận được Mail
            club tháng 7 này của Momo nhé!
          </p>
        </div>
      </section>

      {/* Form đăng ký */}
      <section id="register" className="py-8 bg-[#F4F9FF] px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-4 border-[#334155] rounded-3xl shadow-[4px_4px_0px_#334155] overflow-hidden flex flex-col md:flex-row relative">
            {/* Bên trái: thông tin gói + chuyển khoản */}
            <div className="bg-[#CBE2FD] p-6 md:w-5/12 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-[#334155] gap-6">
              <div className="space-y-6">
                <span className="text-4xl">🎁✨</span>
                <h3 className="text-2xl font-bold leading-tight">
                  Món quà nhỏ vỗ về tâm hồn
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Mở hộp quà dễ thương đầy ắp niềm vui sáng tạo bất ngờ hằng
                  tháng tại Momo Melody Studio.
                </p>
                <ul className="space-y-3.5 text-xs font-bold text-slate-700">
                  <li>✔️ Postcard A6 vẽ tay in giấy sần xịn</li>
                  <li>✔️ 2 Sticker Kim Tuyến lấp lánh</li>
                  <li>✔️ Combo Sticker Pack + Note A5</li>
                  <li>✔️ Giao hàng tận tâm</li>
                </ul>
              </div>

              <div className="pt-8 border-t border-[#334155]/25">
                <p className="text-[10px] text-gray-500 pb-5 uppercase tracking-widest font-bold">
                  Thành viên Momo Melody
                </p>
                <p className="text-lg font-extrabold text-[#8f9eeb]">
                  Trọn gói hộp quà: 135,000đ/tháng
                </p>
              </div>

              <div className="bg-white/90 border-2 border-dashed border-[#334155] p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#FFF2CC] rounded-full border-2 border-[#334155] flex items-center justify-center text-xs font-bold rotate-12">
                  BANK 💳
                </div>
                <h4 className="font-extrabold text-sm border-b-2 border-dashed border-[#334155]/10 pb-1.5">
                  Thông tin chuyển khoản:
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p>
                    <span className="text-gray-400 font-bold">Ngân hàng:</span>{" "}
                    TP Bank
                  </p>
                  <p>
                    <span className="text-gray-400 font-bold">
                      Số tài khoản:
                    </span>{" "}
                    <strong className="select-all font-mono">
                      24182951170
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-400 font-bold">
                      Chủ tài khoản:
                    </span>{" "}
                    TRAN THI NGOC ANH
                  </p>
                  <p>
                    <span className="text-gray-400 font-bold">
                      Số tiền cần chuyển:
                    </span>{" "}
                    <strong className="text-[#8f9eeb]">135,000đ</strong>{" "}
                    <span className="text-gray-400 font-normal">
                      (Đã gồm phí ship)
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400 font-bold">
                      Nội dung chuyển khoản:
                    </span>{" "}
                    <strong className="text-red-500 font-mono select-all">
                      [Tên bạn đã điền trong form - tháng ĐK]
                    </strong>
                  </p>
                  <span className="text-gray-400 font-bold">
                    Ví dụ: momo -T5 T7
                  </span>
                </div>
              </div>

              <img src="/images/QR.jpg" className="rounded-2xl" alt="" />
            </div>

            {/* Bên phải: form */}
            <div className="p-4 md:w-7/12 bg-white flex flex-col justify-center">
              <h3 className="text-lg font-bold mb-1">
                Phiếu Đăng Ký thành viên mới
              </h3>
              <p className="text-xs text-gray-500 mb-8 font-semibold">
                Bạn nhớ điền đúng thông tin để Momo giao đến thẳng hiên nhà bạn
                nhé!
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wide">
                    Tên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Trần Thị Thanh"
                    className="w-full px-3 py-2 bg-[#FFFDF9] border-2 border-[#334155]/40 focus:border-[#334155] rounded-xl outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wide">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="meocon@example.com"
                      className="w-full px-3 py-2 bg-[#FFFDF9] border-2 border-[#334155]/40 focus:border-[#334155] rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wide">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="0901234567"
                      className="w-full px-3 py-2 bg-[#FFFDF9] border-2 border-[#334155]/40 focus:border-[#334155] rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wide">
                    Địa chỉ
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh thành..."
                    className="w-full px-3 py-2 bg-[#FFFDF9] border-2 border-[#334155]/40 focus:border-[#334155] rounded-xl outline-none text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F4F9FF] p-3 rounded-2xl border-2 border-dashed border-[#334155]/20">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                      Bạn muốn nhận:
                    </label>
                    <div className="space-y-2">
                      {[
                        ["Tháng 4", "🌱 Tháng 4"],
                        ["Tháng 5", "🐱 Tháng 5"],
                        ["Tháng 7", "🍅 Tháng 7"],
                        ["Quý 3", "🎉 Quý 3 (Tháng 7,8,9)"],
                      ].map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedMonths.includes(value)}
                            onChange={() => toggleMonth(value)}
                          />
                          {label}
                        </label>
                      ))}
                      <span className="text-[#FF8387] text-xs">
                        (Theo Quý - Giảm 10%)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold">Đã chọn:</p>
                    <div className="mt-1 text-sm text-slate-600">
                      {selectedMonths.length > 0
                        ? selectedMonths.join(", ")
                        : "Chưa chọn tháng nào"}
                    </div>
                    <p className="text-sm font-semibold mt-3">
                      Tổng tiền:{" "}
                      <span className="text-pink-600">
                        {totalPrice.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#FFF2CC] hover:bg-[#FFDF80] text-[#1E293B] font-extrabold py-4 px-6 rounded-2xl border-4 border-[#334155] shadow-[4px_4px_0px_#334155] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex justify-center items-center gap-2 text-base disabled:opacity-60"
                >
                  {submitting ? "Đang gửi..." : "✨ Đăng ký ngay"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modal thành công */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border-4 border-[#334155] p-8 rounded-3xl max-w-sm w-full text-center shadow-[4px_4px_0px_#334155] space-y-6">
            <span className="text-6xl block">💌</span>
            <h4 className="text-2xl font-bold">Đăng ký thành công!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Momomeomeow đã ghi nhận tấm phiếu dễ thương từ bạn rồi nhé. Chúng
              mình sẽ gửi sản phẩm digital qua mail trong vòng 24h (nếu có).
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#CBE2FD] hover:bg-[#CBE2FD]/80 font-bold py-3 rounded-xl border-2 border-[#334155] transition-all"
            >
              Quay lại Momomeomeow
            </button>
          </div>
        </div>
      )}

      {/* FAQ */}
      <section id="faqs" className="py-12 bg-[#F4F9FF]/30 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            💌 Những thắc mắc nhỏ gửi về Momo Melody
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white border-2 border-[#334155] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold flex justify-between items-center bg-[#F4F9FF]/40 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-lg font-bold transition-transform ${
                      openFaq === i ? "text-[#8f9eeb]" : ""
                    }`}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="p-5 border-t-2 border-[#334155]/15 text-sm text-slate-600 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MailClub;
