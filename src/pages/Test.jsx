import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { Sparkles, Heart } from "lucide-react";

/**
 * MailClub.jsx
 * -----------------------------------------------------------------------
 * Chuyển đổi toàn bộ landing page "Momo Melody Studio" (index.html) sang
 * component React (JSX) duy nhất, giữ nguyên mọi tính năng gốc:
 *   - Font chữ Quicksand (tiêu đề) & Nunito (nội dung) load qua Google Fonts
 *   - Toàn bộ màu sắc / box-shadow tuỳ chỉnh của Tailwind config gốc
 *     (pastelBlue, borderBlue, melodyBlue, paperDark, cream, pastelRed,
 *     pastelMint, pastelYellow, pastelGreen, shadow-hand-drawn-blue...)
 *     -> được viết lại thành class Tailwind "arbitrary value" (vd:
 *     bg-[#CBE2FD]) để KHÔNG cần chỉnh tailwind.config.js, component
 *     tự chạy đúng màu ngay cả khi dự án chỉ dùng Tailwind mặc định.
 *   - Toàn bộ animation (wiggle, floatY/float, drift), custom scrollbar,
 *     scallop-border, stamp-edge (2 class này không được dùng ở đâu cả
 *     trong bản gốc, nhưng vẫn giữ lại để không "bỏ tính năng")
 *   - Đồng hồ đếm ngược + khoá/mở form theo khung ngày 10 -> 27 hàng tháng
 *   - Máy tính giá theo tháng đã chọn (giảm 10% khi chọn "Quý 3")
 *   - Accordion FAQ đóng/mở
 *   - Carousel vuốt ngang (swipe) cho từng bộ ảnh tháng
 *   - Hàm createGallery kiểu nút bấm (.custom-gallery/.gallery-btn...) —
 *     LƯU Ý: trong bản HTML gốc, hàm này được định nghĩa nhưng KHÔNG có
 *     phần tử nào gắn class "custom-gallery" nên nó không thực sự chạy.
 *     Mình giữ lại y hệt dưới dạng hook không kích hoạt để bám sát bản gốc.
 *   - Submit form qua Formspree + popup thông báo thành công
 *
 * Yêu cầu khi dùng trong dự án của bạn:
 *   1. Đặt ảnh vào thư mục public/images/... (component đang trỏ tới
 *      "/images/..." theo chuẩn public folder của Vite/CRA/Next). Nếu
 *      cấu trúc dự án khác, chỉ cần đổi lại các đường dẫn IMAGE bên dưới.
 *   2. Không cần cài thêm gì ngoài Tailwind CSS (bản thường, không cần
 *      cấu hình theme mở rộng vì mình đã dùng arbitrary value hết).
 * -----------------------------------------------------------------------
 */

// ============================= HẰNG SỐ CẤU HÌNH =============================

const FORMSPREE_ACTION_URL = "https://formspree.io/f/mjgdaorq";

const PRICE_PER_MONTH = 135000; // Đã đổi thành 135k khớp với giá hiển thị bên gói quà của bạn
const QUARTERLY_DISCOUNT = 0.1;

// Khung ngày mở/đóng đăng ký trong tháng
const OPEN_DAY = 10; // Ngày mở form trong tháng
const CLOSE_DAY = 27; // Ngày cuối cùng còn mở (đóng lúc 23:59:59 ngày này)

const MONTH_OPTIONS = [
  { value: "Tháng 4", label: "🌱 Tháng 4" },
  { value: "Tháng 5", label: "🐱 Tháng 5" },
  { value: "Tháng 7", label: "🍅 Tháng 7" },
  { value: "Quý 3", label: "🎉 Quý 3(Tháng 7,8,9)" },
];

const FAQ_ITEMS = [
  {
    id: 1,
    question: "📬 Bao lâu thì mình nhận được Mail club?",
    answer:
      "Momo Melody Studio sẻ mở phiếu đăng ký từ ngày 10 đến ngày 27 mỗi tháng và Momo sẻ gửi cho bạn vào ngày 20 và 28. Thường bạn sẽ nhận được mailclub sau 2-4 ngày kể từ ngày momo giao hàng nhé!",
  },
  {
    id: 2,
    question: "✨ Chất liệu giấy postcard có tốt không?",
    answer:
      "Dạ cực kỳ xịn luôn nha! Postcard A6 sử dụng giấy mỹ thuật sần nhập khẩu định lượng 300gsm cứng cáp, sờ vào rất đã tay.",
  },
  {
    id: 3,
    question: "❌ Mình có thể huỷ hoặc bảo lưu gói đăng ký không?",
    answer:
      "Có chứ bạn yêu ơi. Bạn chỉ cần inbox về cho page của Momo Melody Studio trước ngày 25 của tháng là có thể thoải mái tạm dừng hoặc dời sang tháng kế tiếp, chúng mình bảo lưu hoàn toàn miễn phí nhé!",
  },
  {
    id: 4,
    question: "🌻 Chi phí trên đã bao gồm tiền ship chưa?",
    answer:
      "Mức chi phí 135,000đ/tháng đã bao gồm trọn vẹn chi phí sản xuất, quà handmade cùng trọn bộ sản phẩm bao gồm cả phí ship toàn khu vực nước Việt Nam",
  },
];

// Ảnh giới thiệu Mail club Tháng 7 (carousel swipe trong section "about")
const ABOUT_T7_IMAGES = [
  { src: "/images/t7_postcard.jpg", alt: "Menu" },
  { src: "/images/t7_stick.jpg", alt: "stickers" },
  { src: "/images/t7_stick2.jpg", alt: "stickers" },
  { src: "/images/t7_note.jpg", alt: "Stickers" },
  { src: "/images/t7_calendar.jpg", alt: "Calendar" },
];

// Ảnh gallery Tháng 4 (carousel swipe, có ảnh fallback onError giống bản gốc)
const GALLERY_T4_IMAGES = [
  {
    src: "/images/t4_menu.jpg",
    alt: "Menu",
    fallback: "https://placehold.co/400x500/E0F2FE/334155?text=Anh+Menu",
  },
  {
    src: "/images/t4_postcard.jpg",
    alt: "Postcard",
    fallback: "https://placehold.co/400x500/FFF2CC/334155?text=Postcard",
  },
  {
    src: "/images/t4_stickers.jpg",
    alt: "Stickers",
    fallback:
      "https://placehold.co/400x500/D1FAE5/334155?text=Sticker+Kim+Tuyen",
  },
  {
    src: "/images/t4_calander.jpg",
    alt: "Calendar",
    fallback: "https://placehold.co/400x500/FFE4E6/334155?text=Note+Washi",
  },
];

// Ảnh gallery Tháng 5 (carousel swipe)
const GALLERY_T5_IMAGES = [
  { src: "/images/pic_menu.png", alt: "Menu T5" },
  { src: "/images/pic_postcard.jpg", alt: "Postcard" },
  { src: "/images/pic_letter.jpg", alt: "Stickers Pack" },
  { src: "/images/pic_washi.jpg", alt: "Washi" },
];

// Dữ liệu dự phòng cho kiểu gallery "bấm nút chuyển ảnh" (createGallery ở bản
// gốc) — hiện KHÔNG được gắn vào giao diện nào (xem ghi chú đầu file), giữ
// lại chỉ để bám sát 100% tính năng của bản HTML gốc.
const LEGACY_BUTTON_GALLERIES_IMAGES = [
  [
    "/images/t4_menu.jpg",
    "/images/t4_postcard.jpg",
    "/images/t4_stickers.jpg",
    "/images/t4_.jpg",
    "/images/t4_calander.jpg",
  ],
  [
    "/images/pic_menu.png",
    "/images/pic_postcard.jpg",
    "/images/pic_stickers.jpg",
    "/images/pic_letter.jpg",
    "/images/pic_washi.jpg",
  ],
];

// ============================= HÀM TIỆN ÍCH =============================

// Tính trạng thái mở/khoá form theo khung ngày 10 -> 27 của tháng hiện tại
function getFormWindowState(now) {
  const year = now.getFullYear();
  const month = now.getMonth();

  // Mốc mở cửa của THÁNG HIỆN TẠI: ngày 10, 00:00:00
  const openStart = new Date(year, month, OPEN_DAY, 0, 0, 0);
  // Mốc đóng cửa của THÁNG HIỆN TẠI: ngày 27, 23:59:59
  const closeEnd = new Date(year, month, CLOSE_DAY, 23, 59, 59);

  if (now >= openStart && now <= closeEnd) {
    // Đang trong khung 10-27: MỞ, đếm ngược tới lúc đóng
    return { isOpen: true, target: closeEnd };
  }

  // Ngoài khung 10-27: KHÓA
  let nextOpen;
  if (now < openStart) {
    // Chưa tới ngày 10 của tháng này -> mở lại vào ngày 10 tháng này
    nextOpen = openStart;
  } else {
    // Đã qua ngày 27 -> mở lại vào ngày 10 tháng KẾ TIẾP
    // new Date tự cộng dồn tháng/năm hợp lệ (vd tháng 12 -> tháng 1 năm sau)
    nextOpen = new Date(year, month + 1, OPEN_DAY, 0, 0, 0);
  }
  return { isOpen: false, target: nextOpen };
}

function formatCountdownPart(distanceMs) {
  const days = Math.floor(distanceMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distanceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distanceMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distanceMs % (1000 * 60)) / 1000);
  return {
    days: days.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
}

// ============================= COMPONENT CON =============================

// Carousel vuốt ngang dùng chung cho các bộ ảnh (giống class .no-scrollbar
// + snap-x của bản gốc, không cần JS điều khiển vì đây là scroll-snap CSS)
function SwipeGallery({
  images,
  imgHeightClass,
  borderColorClass,
  rounded = "rounded-3xl",
  withFallback = false,
}) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="snap-center shrink-0 w-[85vw] sm:w-[320px] flex flex-col items-center group"
        >
          <img
            src={img.src}
            alt={img.alt}
            onError={
              withFallback && img.fallback
                ? (e) => {
                    e.currentTarget.src = img.fallback;
                  }
                : undefined
            }
            className={`w-full ${imgHeightClass} object-cover ${rounded} border-4 ${borderColorClass} group-hover:-translate-y-2 transition-transform`}
          />
        </div>
      ))}
    </div>
  );
}

export default function MailClub() {
  // ----------------------------- Style / Font toàn cục -----------------------------
  // (Được render 1 lần, tương đương thẻ <style> + Google Fonts trong <head> bản gốc)

  // ----------------------------- Đếm ngược + khoá form -----------------------------
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [isHovered, setIsHovered] = useState(false);

  // Đường dẫn bạn muốn chuyển đến khi nhấn nút
  const targetUrl = "https://momo-melody.netlify.app/#register"; // Thay đổi URL này thành link của bạn

  const handleRegisterClick = () => {
    // Chuyển hướng người dùng đến đường dẫn đã lưu
    window.location.href = targetUrl;
  };

  useEffect(() => {
    function tick() {
      const now = new Date();
      const { isOpen, target } = getFormWindowState(now);
      setIsFormOpen(isOpen);

      const distance = target.getTime() - now.getTime();
      if (distance < 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      setCountdown(formatCountdownPart(distance));
    }

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // ----------------------------- FAQ accordion -----------------------------
  const [openFaqId, setOpenFaqId] = useState(null);
  const toggleFaq = useCallback((id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  }, []);

  // ----------------------------- Checkbox chọn tháng + tính giá -----------------------------
  const [selectedMonths, setSelectedMonths] = useState([]);

  const toggleMonth = useCallback((value) => {
    setSelectedMonths((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const { selectedMonthsText, finalTotalText } = useMemo(() => {
    if (selectedMonths.length === 0) {
      return {
        selectedMonthsText: "Chưa chọn tháng nào",
        finalTotalText: "0 VNĐ",
      };
    }

    const hasQuarterly = selectedMonths.includes("Quý 3");
    let finalTotal = 0;

    if (hasQuarterly) {
      // Quý 3 = 3 tháng, giảm 10%
      const quarterlyPrice = PRICE_PER_MONTH * 3 * (1 - QUARTERLY_DISCOUNT);
      // Các tháng lẻ còn lại (không phải Quý 3)
      const otherMonths = selectedMonths.filter((v) => v !== "Quý 3").length;
      finalTotal = quarterlyPrice + otherMonths * PRICE_PER_MONTH;
    } else {
      finalTotal = selectedMonths.length * PRICE_PER_MONTH;
    }

    return {
      selectedMonthsText: selectedMonths.join(", "),
      finalTotalText: finalTotal.toLocaleString("vi-VN") + " VNĐ",
    };
  }, [selectedMonths]);

  // ----------------------------- Gallery kiểu nút bấm (legacy, không dùng) -----------------------------
  // Giữ lại y hệt hành vi bản gốc: hàm tồn tại nhưng vì không có phần tử nào
  // mang class "custom-gallery" nên effect này sẽ không tìm thấy gì và
  // không làm gì cả (querySelectorAll trả về rỗng).
  useEffect(() => {
    function createGallery(containerSelector, imageList) {
      const containers = document.querySelectorAll(containerSelector);
      containers.forEach((container, index) => {
        const currentImages = imageList[index] || imageList[0];
        let currentIndex = 0;

        const galleryImg = container.querySelector(".gallery-img");
        const nextBtn = container.querySelector(".gallery-btn");
        const imgCounter = container.querySelector(".gallery-counter");

        if (!galleryImg || !nextBtn || !imgCounter) return;

        imgCounter.textContent = `1 / ${currentImages.length}`;

        nextBtn.addEventListener("click", function () {
          currentIndex++;
          if (currentIndex >= currentImages.length) {
            currentIndex = 0;
          }
          galleryImg.style.opacity = "0.3";
          setTimeout(() => {
            galleryImg.src = currentImages[currentIndex];
            imgCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            galleryImg.style.opacity = "1";
          }, 150);
        });
      });
    }

    createGallery(".custom-gallery", LEGACY_BUTTON_GALLERIES_IMAGES);
  }, []);

  // ----------------------------- Modal thành công -----------------------------
  const [showModal, setShowModal] = useState(false);
  const closeModal = useCallback(() => setShowModal(false), []);

  // ----------------------------- Submit form -----------------------------
  const formRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Chặn gửi form nếu đang ngoài khung ngày 10-27 (form bị khóa)
      if (!isFormOpen) return;

      const form = formRef.current;
      if (!form) return;

      const formData = new FormData(form);

      try {
        await fetch(FORMSPREE_ACTION_URL, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
      } catch (err) {
        // Giữ hành vi gốc: dù lỗi hay thành công đều vẫn hiện popup thông báo
      } finally {
        setShowModal(true);
        form.reset();
        setSelectedMonths([]);
      }
    },
    [isFormOpen],
  );

  return (
    <div
      className="relative overflow-x-hidden font-body text-[#1E293B]"
      style={{ backgroundColor: "#F4F9FF" }}
    >
      {/* ================= FONT + CSS TOÀN CỤC (giữ nguyên 100% bản gốc) ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap');

        .mailclub-root {
          font-family: "Nunito", sans-serif;
          background-color: #f4f9ff;
          color: #1e293b;
        }
        .mailclub-root h1,
        .mailclub-root h2,
        .mailclub-root h3,
        .mailclub-root h4,
        .mailclub-root h5,
        .mailclub-root h6 {
          font-family: "Quicksand", sans-serif;
        }

        /* Hiệu ứng rung nhẹ cho sticker và nút */
        @keyframes mailclub-wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle { animation: mailclub-wiggle 3s ease-in-out infinite; }
        .hover-wiggle:hover { animation: mailclub-wiggle 0.5s ease-in-out infinite; }

        /* Hiệu ứng lơ lửng nhẹ nhàng */
        @keyframes mailclub-floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: mailclub-floatY 4s ease-in-out infinite; }
        .animate-float-delayed { animation: mailclub-floatY 4s ease-in-out infinite; animation-delay: 2s; }

        /* Hiệu ứng trôi ngang của mây */
        @keyframes mailclub-drift {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(10%); }
          100% { transform: translateX(-10%); }
        }
        .animate-drift { animation: mailclub-drift 25s ease-in-out infinite; }

        /* Viền rách kiểu dán sổ Scrapbook (không dùng trong bản gốc, giữ lại cho đủ tính năng) */
        .scallop-border {
          background-image: radial-gradient(circle at 10px -5px, transparent 12px, #f4f9ff 13px);
          background-size: 20px 20px;
        }

        /* Custom viền tem thư (không dùng trong bản gốc, giữ lại cho đủ tính năng) */
        .stamp-edge {
          background: radial-gradient(circle, #f4f9ff 4px, transparent 5px);
          background-size: 14px 14px;
        }

        /* ====== CUSTOM SCROLLBAR ====== */
        .mailclub-root ::-webkit-scrollbar { width: 14px; }
        .mailclub-root ::-webkit-scrollbar-track { background: #F4F9FF; }
        .mailclub-root ::-webkit-scrollbar-thumb {
          background-color: #8f9eeb;
          border-radius: 20px;
          border: 3px solid #F4F9FF;
        }
        .mailclub-root ::-webkit-scrollbar-thumb:hover { background-color: #ff8387; }

        .mailclub-root { scrollbar-width: thin; scrollbar-color: #8f9eeb #F4F9FF; }

        /* Thanh scroll ngang cho các khu vực carousel (vuốt ảnh) */
        .no-scrollbar::-webkit-scrollbar { height: 8px; }
        .no-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar::-webkit-scrollbar-thumb { background-color: #CBE2FD; border-radius: 20px; }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div className="mailclub-root">
        {/* Các đám mây cổ tích trôi nổi xung quanh */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] animate-drift opacity-60">
            <svg
              className="w-24 h-16 text-white fill-current"
              viewBox="0 0 100 60"
            >
              <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,45 C85,55 60,60 45,50 C30,60 15,55 20,40 Z" />
            </svg>
          </div>
          <div
            className="absolute top-[35%] right-[3%] animate-drift opacity-50"
            style={{ animationDelay: "-5s" }}
          >
            <svg
              className="w-32 h-20 text-white fill-current"
              viewBox="0 0 100 60"
            >
              <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,45 C85,55 60,60 45,50 C30,60 15,55 20,40 Z" />
            </svg>
          </div>
          <div
            className="absolute bottom-[25%] left-[2%] animate-drift opacity-45"
            style={{ animationDelay: "-12s" }}
          >
            <svg
              className="w-14 sm:w-20 h-12 text-white fill-current"
              viewBox="0 0 100 60"
            >
              <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,45 C85,55 60,60 45,50 C30,60 15,55 20,40 Z" />
            </svg>
          </div>
        </div>

        {/* Thanh điều hướng bo cạnh nét chì màu xanh xám */}

        {/* Hero Section mang phong cách hoạt hình, sticker lấp lánh nghệ thuật */}
        <section className="bg-[url('/images/bg-mobile.jpg')] bg-cover bg-center bg-no-repeat relative pt-12 pb-24 md:py-32 overflow-hidden px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
            {/* Cột văn bản giới thiệu */}
            <div className="md:col-span-7 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#ff8387] border-2 border-[#334155] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm text-[#334155] animate-wiggle">
                <span className="text-lg">✨</span> Chào mừng bạn đến với thế
                giới đầy sáng tạo của Momo!
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
                💌 Nhận một Mail clup{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CBE2FD] to-[#ff8387]">
                  dễ thương
                </span>{" "}
                mỗi tháng
              </h1>
              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                Mail Club là bộ sưu tập những ấn phẩm mình minh hoạ theo chủ đề
                riêng của từng tháng.
                <br />
                <br />
                Mỗi phong bì sẽ bao gồm postcard, sticker pack, die-cut sticker,
                bookmark, notepad, art print và những artwork độc quyền chỉ có
                trong Mail Club. Đôi khi mình cũng sẽ gửi kèm những món quà nhỏ
                bất ngờ như một lời cảm ơn dành cho bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
                <a
                  href="#targetUrl"
                  onClick={handleRegisterClick}
                  className="bg-[#FFF2CC] text-[#1E293B] font-bold text-lg px-8 py-4 rounded-2xl border-4 border-[#334155] shadow-[4px_4px_0px_#334155] hover:shadow-[2px_2px_0px_#334155] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center group text-sm sm:text-base"
                >
                  🎁 Đăng ký nhận Mail clup tháng tới
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* Cột hình ảnh minh họa chiếc phong bì ruy-băng nhạc của Momo */}
            <div className="md:col-span-5 flex justify-center relative">
              <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-dashed border-[#8f9eeb]/10 -z-10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#8f9eeb]/15"></div>
              </div>

              <div className="relative w-full max-w-[340px] md:max-w-[400px]">
                {/* Khung hình minh họa chính */}
                <div className="bg-white border-4 border-[#334155] p-6 rounded-3xl shadow-[4px_4px_0px_#334155] relative animate-float">
                  {/* Tem thư bưu điện */}
                  <div className="absolute top-1 right-4 w-14 h-14 bg-[#CBE2FD] border-2 border-dashed border-[#334155] p-1 text-center flex flex-col justify-between items-center shadow-sm">
                    <span className="text-xs font-bold text-[#334155]">
                      Momo
                    </span>
                    <span className="text-xs font-bold text-[#334155]">🍃</span>
                    <span className="text-[9px] font-extrabold text-[#8f9eeb]">
                      meomeow
                    </span>
                  </div>

                  {/* Mặt bìa mô phỏng thiệp nhạc */}
                  <div className="border-2 border-dashed border-[#334155]/40 bg-[#FFFDF9] rounded-2xl p-4 mt-2 text-center space-y-4">
                    <p className="text-base mt-3 pb-3 text-slate-500 leading-relaxed italic">
                      "Momomeomeow thường lấy cảm hứng từ mèo, những cô gái và
                      các yếu tố thần tiên, huyền ảo để xây dựng thế giới sáng
                      tạo của mình."
                    </p>
                  </div>

                  {/* Badge nhỏ xinh dưới góc */}
                  <div className="absolute -bottom-8 -left-8 bg-[#E0F2FE] border-4 border-[#334155] p-3 rounded-2xl flex items-center gap-2 shadow-[4px_4px_0px_#334155]">
                    <span className="h-12 w-12">
                      <img src="/images/logo_blue.png" alt="" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#1E293B] leading-tight">
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

          {/* Khung trang trí viền sóng đáy Section */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
            <svg
              className="relative block w-full h-8 text-white fill-current"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C58.39,120,131.78,111,196.48,92.83,258.29,75.46,258.9,68,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Giới thiệu các sản phẩm văn phòng phẩm tinh xảo trong */}
        <section id="about" className="py-6 bg-white relative z-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="inline-block bg-[#CBE2FD] text-[#FF8387] font-bold px-4 py-1.5 rounded-full text-xs border-2 border-[#334155]">
                🎨 DESIGN BY MOMO
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FF8387]">
                Mail clup tháng 7 này có gì bất ngờ?
              </h2>
              <p className="text-slate-500">
                Mỗi ấn phẩm đều được mình tự tay phác thảo, in ấn trên chất liệu
                chọn lọc để chạm tới trái tim người yêu nghệ thuật.
              </p>
              <img src="/images/t7_menu.jpg" alt="" className="rounded-xl" />
            </div>

            <SwipeGallery
              images={ABOUT_T7_IMAGES}
              imgHeightClass="h-[350px]"
              borderColorClass="border-[#ff8387]"
            />
          </div>
        </section>

        {/* Bộ đếm ngược chốt đơn giới hạn của tháng */}
        <section className="py-8 bg-gradient-to-br from-[#CBE2FD] via-[#E2EFFF] to-[#FFF2CC] px-6 relative border-t-2 border-b-2 border-[#334155]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1E293B] flex items-center justify-center gap-2 flex-wrap">
              ⏳ Mail club{" "}
              <span className="text-[#8f9eeb] underline decoration-wavy">
                Tháng 8
              </span>{" "}
              của Momo <span>{isFormOpen ? "sẽ đóng sau:" : "sẽ mở sau:"}</span>
            </h3>

            {/* Hộp đếm lùi thời gian bằng số lớn dễ thương */}
            <div className="flex justify-center items-center gap-2 text-[#1E293B] flex-wrap">
              <div className="bg-white border-2 border-[#334155] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-[4px_4px_0px_#334155] text-center w-14 sm:w-20">
                <span className="text-lg sm:text-3xl font-extrabold block">
                  {countdown.days}
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Ngày
                </span>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="bg-white border-2 border-[#334155] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-[4px_4px_0px_#334155] text-center w-14 sm:w-20">
                <span className="text-lg sm:text-3xl font-extrabold block">
                  {countdown.hours}
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Giờ
                </span>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="bg-white border-2 border-[#334155] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-[4px_4px_0px_#334155] text-center w-14 sm:w-20">
                <span className="text-lg sm:text-3xl font-extrabold block">
                  {countdown.minutes}
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Phút
                </span>
              </div>
              <span className="text-2xl font-bold sm:inline">:</span>
              <div className="bg-white border-2 border-[#334155] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-[4px_4px_0px_#334155] text-center w-14 sm:w-20">
                <span className="text-lg sm:text-3xl font-extrabold block">
                  {countdown.seconds}
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Giây
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-600">
              {isFormOpen
                ? "Hãy đăng ký ngay hôm nay để trở thành người sớm nhất nhận được Mail club tháng này của Momo nhé!"
                : "Mail club đang tạm đóng đăng ký, hẹn gặp lại bạn khi mở lại nhé!"}
            </p>
          </div>
        </section>

        {/* Ngắm nghía ấn phẩm của chúng mình Momo Melody Studio */}
        <section
          id="gallery"
          className="py-6 bg-[#F4F9FF]/50 relative border-t-2 border-b-2 border-dashed border-[#334155]/10 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-extrabold text-[#1E293B] mb-3">
                  📸 Ngắm nghía ấn phẩm của mình
                </h2>
                <p className="text-slate-500 max-w-xl">
                  Bạn hãy <strong>vuốt sang trái</strong> để khám phá từng món
                  đồ lấp lánh của Momo nhé!
                </p>
              </div>
            </div>

            {/* BỘ ẢNH THÁNG 4: SWIPE CAROUSEL */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <span className="bg-[#4D7C0F] text-sm sm:text-base text-white border-2 border-[#334155] px-5 py-2 rounded-full font-bold shadow-sm">
                  Tháng 4: 🍵 Giai Điệu Matcha Ngọt Ngào 🐱
                </span>
                {/* Hướng dẫn nhấp nháy cho mobile */}
                <span className="animate-pulse text-sm font-bold text-[#334155] hidden sm:inline-block">
                  👉 Vuốt để xem thêm
                </span>
              </div>

              <SwipeGallery
                images={GALLERY_T4_IMAGES}
                imgHeightClass="h-[450px]"
                borderColorClass="border-[#334155] shadow-[4px_4px_0px_#334155]"
                withFallback
              />
            </div>

            {/* BỘ ẢNH THÁNG 5: SWIPE CAROUSEL */}
            <div>
              <div className="pt-4 flex items-center gap-3 mb-6 justify-center md:justify-start">
                <span className="bg-[#d6a362] text-sm sm:text-base text-white border-2 border-[#334155] px-5 py-2 rounded-full font-bold shadow-sm">
                  Tháng 5: ☕ Tiệm Cà Phê Mèo Bận Rộn 🐱
                </span>
              </div>

              <SwipeGallery
                images={GALLERY_T5_IMAGES}
                imgHeightClass="h-[350px]"
                borderColorClass="border-[#d6a362] shadow-[4px_4px_0px_#334155]"
              />
            </div>
          </div>
        </section>

        {/* Button đăng ký */}
        <div className=" bg-[#f4f9ff4d] flex items-center justify-center p-4 font-sans">
          {/* Container chứa nút để tạo thêm hiệu ứng hào quang (glow) */}
          <div className="relative group">
            {/* Lớp nền tạo hiệu ứng phát sáng mờ ảo phía sau */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>

            {/* Nút chính */}
            <button
              onClick={handleRegisterClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xl rounded-full shadow-xl transform transition-all duration-300 ease-bounce hover:scale-110 active:scale-95 border-2 border-white/50 overflow-hidden"
            >
              {/* Hiệu ứng lấp lánh chạy ngang nút khi hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>

              {/* Icon lấp lánh */}
              <Sparkles
                className={`w-6 h-6 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`}
                strokeWidth={2.5}
              />

              <span className="tracking-wide">Đăng Ký Ngay!</span>

              {/* Icon trái tim */}
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${isHovered ? "fill-white animate-bounce" : "fill-transparent"}`}
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Style tùy chỉnh cho animation shimmer */}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white border-4 border-[#334155] p-8 rounded-3xl max-w-sm w-full text-center shadow-[4px_4px_0px_#334155] space-y-6 relative">
              <span className="text-6xl block">💌</span>
              <h4 className="text-2xl font-bold text-[#1E293B]">
                Đăng ký thành công!
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Momomeomeow đã ghi nhận tấm phiếu dễ thương từ bạn rồi nhé.
                Chúng mình sẽ gửi sản phẩm digital qua mail trong vòng 24h(nếu
                có).
              </p>
              <button
                onClick={closeModal}
                className="w-full bg-[#CBE2FD] hover:bg-[#CBE2FD]/80 text-[#1E293B] font-bold py-3 rounded-xl border-2 border-[#334155] transition-all"
              >
                Quay lại Momomeomeow
              </button>
            </div>
          </div>
        )}

        {/* Câu hỏi thường gặp FAQ */}
        <section id="faqs" className="pt-6 pb-12 bg-[#F4F9FF]/30 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#1E293B] text-center mb-12">
              💌 Những thắc mắc nhỏ gửi về Momo Melody
            </h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#334155] rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-5 text-left font-bold text-[#1E293B] flex justify-between items-center bg-[#F4F9FF]/40 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base">
                      {item.question}
                    </span>
                    <span
                      className={`text-lg transition-transform font-bold ${openFaqId === item.id ? "text-[#8f9eeb]" : ""}`}
                    >
                      {openFaqId === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqId === item.id && (
                    <div className="p-5 border-t-2 border-[#334155]/15 text-sm text-slate-600 bg-white">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
