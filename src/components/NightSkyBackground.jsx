import { useMemo } from "react";
import { motion } from "framer-motion";

// ============================================================
// 🌌 NỀN SAO TRỜI + MƯA SAO BĂNG
// Tách riêng thành component dùng chung để cả ServerWakeGate và Hero
// (hoặc bất kỳ đâu khác) đều dùng lại được, không phải copy-paste.
// ============================================================

export function useStarField(count = 110) {
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

export function useShootingStars(stars, count = 22) {
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

/**
 * NightSkyBackground — nền bầu trời đêm có tinh vân, sao lấp lánh và mưa
 * sao băng. Dùng position: relative trên thẻ cha rồi đặt component này
 * làm lớp nền tuyệt đối (absolute inset-0), nội dung phía trên đặt
 * `relative z-10` để nổi lên trên nền sao.
 *
 * Dùng kèm useStarField() + useShootingStars() để tạo dữ liệu, ví dụ:
 *
 *   const stars = useStarField();
 *   const shootingStars = useShootingStars(stars);
 *   <div className="relative ...">
 *     <NightSkyBackground stars={stars} shootingStars={shootingStars} />
 *     <div className="relative z-10">...nội dung...</div>
 *   </div>
 */
export default function NightSkyBackground({ stars, shootingStars }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
