import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../api/client";

// ============================================================
// 🌸 4 SLIDE CHỦ ĐỀ MAIL CLUB — ĐÂY LÀ MẪU, THAY NỘI DUNG THẬT VÀO ĐÂY
// Mỗi slide ứng với 1 chủ đề mail club đã từng làm trong quá khứ.
// accent: màu nhấn cho tag + progress dot của riêng slide đó.
// ============================================================
export const MAILCLUB_SLIDES = [
  {
    id: "theme-01",
    tag: "SPRING BLOOM",
    title: "Spring & Floral Garden",
    description:
      "Bộ sản phẩm lấy cảm hứng từ những đóa hoa đầu xuân nở rộ, mang hơi thở thiên nhiên tươi mát, những lá thư tay thơm mùi hoa cỏ và cảm giác bình yên nơi góc vườn nhỏ.",
    image: "/images/theme4.png",
    accent: "#86EFAC", // Green-300 (Xanh mầm xuân / Hoa cỏ tươi mát)
  },
  {
    id: "theme-02",
    tag: "COZY CAFÉ",
    title: "Coffee & Sweet Treats",
    description:
      "Hương vị cà phê nồng nàn cùng những chiếc bánh ngọt thơm lừng trong không gian ấm cúng, tái hiện những phút giây thư thái và ngọt ngào dành cho tâm hồn lãng mạn.",
    image: "/images/theme3.png",
    accent: "#FDBA74", // Orange-300 (Cam Caramel / Bánh nướng ấm áp)
  },
  {
    id: "theme-03",
    tag: "DEEP HEART",
    title: "Whispers of the Sea",
    description:
      "Cảm hứng từ sóng biển rì rào, ngọn hải đăng xa xăm và vô số vỏ ốc lấp lánh dưới ánh nắng hè, mang đến nguồn năng lượng tự do và sự khoáng đạt tươi mới.",
    image: "/images/theme2.png",
    accent: "#38BDF8", // Sky-400 (Xanh đại dương trong trẻo)
  },
  {
    id: "theme-04",
    tag: "LITTLE DARK WITCH",
    title: "Cosmic Night & Magic",
    description:
      "Chuyến phiêu lưu vào không gian phép thuật với dải ngân hà huyền ảo, những lọ nước phép lấp lánh và chòm sao đêm, khơi gợi ước mơ và sự tò mò bí ẩn.",
    image: "/images/theme1.png",
    accent: "#C084FC", // Purple-400 (Tím dải ngân hà & chòm sao)
  },
];

// ============================================================
// 🌌 NỀN SAO TRỜI + MƯA SAO BĂNG (tái dùng từ bản trước)
// ============================================================
function useStarField(count = 110) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.12 ? 3 : Math.random() < 0.5 ? 2 : 1.2,
        color: Math.random() < 0.25 ? "#BFDBFE" : "#FFFFFF",
        duration: 1.8 + Math.random() * 2.5,
        delay: Math.random() * 4,
      })),
    [count],
  );
}

const FALL_ANGLE_DEG = 35; // góc rơi so với phương ngang
function useShootingStars(stars, count = 22) {
  return useMemo(() => {
    if (!stars || stars.length === 0) return [];
    const rad = (FALL_ANGLE_DEG * Math.PI) / 180;
    // Quãng đường đủ dài để luôn chạy hết ra ngoài màn hình, bất kể
    // điểm xuất phát nằm ở đâu (lấy theo đường chéo viewport).
    const viewportDiagonal =
      typeof window !== "undefined"
        ? Math.hypot(window.innerWidth, window.innerHeight)
        : 1400;
    return Array.from({ length: count }, (_, i) => {
      const travel = viewportDiagonal * (1.1 + Math.random() * 0.3);
      // Xuất phát từ vị trí của 1 ngôi sao (chấm trắng) có sẵn, chọn ngẫu nhiên.
      const originStar = stars[Math.floor(Math.random() * stars.length)];
      return {
        id: i,
        top: originStar.top,
        left: originStar.left,
        length: 70 + Math.random() * 70,
        thickness: 1.2 + Math.random() * 1.3,
        dx: travel * Math.cos(rad),
        dy: travel * Math.sin(rad),
        duration: 1.8 + Math.random() * 1.2,
        delay: Math.random() * 2.5,
        repeatDelay: 0.15 + Math.random() * 0.9,
      };
    });
  }, [stars, count]);
}

// Vài mảng tinh vân (nebula) mờ ảo, đặt cố định quanh khung hình, tự phập
// phồng nhẹ để bầu trời có chiều sâu thay vì chỉ là 1 màu nền phẳng.
const NEBULAE = [
  { top: "-10%", left: "-10%", size: 480, color: "#3B2E8C", duration: 9 },
  { top: "10%", right: "-15%", size: 520, color: "#1E5FA8", duration: 11 },
  { top: "55%", left: "-15%", size: 420, color: "#7C3AED", duration: 8 },
  { bottom: "-15%", right: "-10%", size: 460, color: "#0EA5E9", duration: 10 },
];

function NightSkyBackground({ stars, shootingStars }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Nền trời đêm ngả xanh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #060A1F 0%, #0B1A45 40%, #123A72 75%, #1B5FA6 100%)",
        }}
      />

      {/* Các mảng tinh vân mờ, phập phồng chậm */}
      {NEBULAE.map((n, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            top: n.top,
            left: n.left,
            right: n.right,
            bottom: n.bottom,
            width: n.size,
            height: n.size,
            background: `radial-gradient(circle, ${n.color}66 0%, ${n.color}00 70%)`,
            filter: "blur(30px)",
          }}
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{
            duration: n.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Dải ngân hà chéo qua nền, rất mờ */}
      <div
        className="absolute"
        style={{
          top: "-20%",
          left: "-30%",
          width: "160%",
          height: "70%",
          background:
            "linear-gradient(115deg, transparent 30%, rgba(191,219,254,0.10) 48%, rgba(255,255,255,0.16) 50%, rgba(191,219,254,0.10) 52%, transparent 70%)",
          filter: "blur(6px)",
          transform: "rotate(-8deg)",
        }}
      />

      {/* Sao trời lấp lánh */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.color,
          }}
          className="rounded-full select-none"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}

      {/* Mưa sao băng — xuất phát từ 1 ngôi sao có sẵn, đột ngột xuất hiện,
          chạy hết ra ngoài màn hình */}
      {shootingStars.map((s) => (
        <motion.div
          key={`shoot-${s.id}`}
          className="absolute"
          style={{ top: s.top, left: s.left }}
          animate={{
            x: [0, s.dx],
            y: [0, s.dy],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            delay: s.delay,
            ease: "linear",
            times: [0, 0.02, 0.92, 1],
          }}
        >
          <div
            style={{
              width: s.length,
              height: s.thickness,
              transform: `rotate(${FALL_ANGLE_DEG}deg)`,
              transformOrigin: "left center",
              position: "relative",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(191,224,255,0.85) 55%, #FFFFFF 100%)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                right: -2,
                top: "50%",
                width: s.thickness * 3.5,
                height: s.thickness * 3.5,
                transform: "translateY(-50%)",
                background: "#FFFFFF",
                boxShadow:
                  "0 0 12px 4px rgba(255,255,255,0.9), 0 0 24px 10px rgba(147,197,253,0.6)",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// ⏳ Logic đánh thức server (giữ nguyên như bản trước)
// ============================================================
const SHOW_OVERLAY_AFTER_MS = 900;
const PING_TIMEOUT_MS = 12000;

// Đổi câu chữ theo thời gian chờ để người dùng thấy app "còn sống"
// chứ không phải bị treo, càng chờ lâu càng trấn an nhiều hơn.
function getMessage(elapsedMs) {
  if (elapsedMs < 10_000) {
    return "Meow~ Momo đang chạy tới đây! 🐈💨";
  }

  if (elapsedMs < 25_000) {
    return "Momo đang ngái ngủ... đợi bé một chút nha 💤🐾";
  }

  if (elapsedMs < 45_000) {
    return "Gần tới rồi nè~ đừng bỏ Momo nha 🥺✨";
  }

  return "Hôm nay Momo hơi chậm một chút... nhưng bé vẫn đang cố gắng 🐱💗";
}

async function pingServer() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl("/"), { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * ServerWakeGate — "Đánh thức" backend Render free tier trước khi cho
 * người dùng thao tác, thay vì để họ thấy trang trắng/lỗi vì mọi request
 * gọi API đều fail trong lúc server đang cold start.
 *
 * Trong lúc chờ: hiện slider giới thiệu 4 chủ đề mail club (nội dung mẫu,
 * thay bằng chủ đề thật của bạn) trên nền bầu trời đêm có mưa sao băng.
 */
export default function ServerWakeGate({ children }) {
  const [ready, setReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [userPreference, setUserPreference] = useState(null);

  const startedAt = useRef(Date.now());
  const cancelled = useRef(false);

  const stars = useStarField();
  const shootingStars = useShootingStars(stars);

  // Tiến trình ước tính 0% -> 95%
  const progressPercent = Math.min(Math.round((elapsed / 45000) * 100), 95);

  useEffect(() => {
    const overlayTimer = setTimeout(
      () => setShowOverlay(true),
      SHOW_OVERLAY_AFTER_MS,
    );
    const tick = setInterval(
      () => setElapsed(Date.now() - startedAt.current),
      500,
    );

    // Tự động chuyển slide mỗi 7 giây
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % MAILCLUB_SLIDES.length);
    }, 7000);

    (async () => {
      while (!cancelled.current) {
        const ok = await pingServer();
        if (ok) {
          if (!cancelled.current) setReady(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    })();

    return () => {
      cancelled.current = true;
      clearTimeout(overlayTimer);
      clearInterval(tick);
      clearInterval(slideInterval);
    };
  }, []);

  if (ready) return children;
  if (!showOverlay) return null;

  const currentSlide = MAILCLUB_SLIDES[activeSlide];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-12 overflow-hidden text-white font-sans"
      >
        {/* Nền: bầu trời đêm + mưa sao băng */}
        <NightSkyBackground stars={stars} shootingStars={shootingStars} />

        {/* Lớp phủ màu nhấn theo từng slide, rất mờ để không che mất sao */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${currentSlide.accent}, transparent 60%)`,
            }}
          />
        </AnimatePresence>

        {/* Header: Logo + trạng thái */}
        <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo_red.png"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-medium tracking-wider text-sm text-slate-300">
              Momomeomeow
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={getMessage(elapsed)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {getMessage(elapsed)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Nội dung chính: slider 4 chủ đề mail club */}
        <div className="relative z-10 my-auto max-w-4xl mx-auto w-full flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
            >
              {/* Ảnh chủ đề của tháng */}
              <div
                className="w-40 h-40 sm:w-52 sm:h-52 shrink-0 rounded-2xl overflow-hidden border shadow-lg"
                style={{
                  borderColor: `${currentSlide.accent}55`,
                  boxShadow: `0 0 40px -10px ${currentSlide.accent}55`,
                }}
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Chữ giới thiệu chủ đề */}
              <div className="space-y-4 text-center sm:text-left">
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-md border"
                  style={{
                    color: currentSlide.accent,
                    borderColor: `${currentSlide.accent}66`,
                    background: `${currentSlide.accent}1A`,
                  }}
                >
                  {currentSlide.tag}
                </span>
                <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                  {currentSlide.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300/90 max-w-xl leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Micro-interaction: chọn nhanh sở thích (mẫu, có thể chỉnh nội dung) */}
          <div className="pt-4 border-t border-slate-700/50 text-center sm:text-left">
            <p className="text-xs text-slate-400 mb-3">
              Bạn thích phong cách mail club nào?
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {["Pastel", "Tối giản", "Vintage", "Rực rỡ"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setUserPreference(cat)}
                  className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
                    userPreference === cat
                      ? "bg-white text-slate-950 border-white font-medium"
                      : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {cat} {userPreference === cat ? "✓" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: progress bar + chuyển slide thủ công */}
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex gap-2">
              {MAILCLUB_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: activeSlide === idx ? 32 : 8,
                    background: activeSlide === idx ? slide.accent : "#334155",
                  }}
                />
              ))}
            </div>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background: `linear-gradient(90deg, ${currentSlide.accent}, #FFFFFF)`,
              }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
