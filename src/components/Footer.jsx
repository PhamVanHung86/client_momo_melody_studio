import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-20 bg-pastel-blue/50 text-[#4A4A6A]">
      {/* Main footer */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Cột 1: Thương hiệu */}
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C9C9EA] flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo_red.png"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-base font-semibold text-[#4A4A6A]">
              Momo Melody Studio
            </p>
          </div>

          {/* Mô tả */}
          <p className="text-sm text-[#4A4A6A]/60 leading-relaxed">
            Momo Melody là góc nhỏ của sự sáng tạo và dễ thương, nơi những bức
            tranh được mình chăm chút vẽ, stickers lấp lánh và sticker washi
            được tạo nên để mang đến niềm vui, cảm hứng và những khoảnh khắc thư
            giãn trong cuộc sống thường ngày.
          </p>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#4A4A6A]">
              ✨ Ghé chơi với mình tại đây nhé:
            </p>
            <div className="flex gap-1.5 sm:gap-3 flex-nowrap">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/hieu.nguyenthi.1447"
                className="flex items-center gap-2 px-2.5 py-2.5 rounded-2xl border-2 border-[#4A4A6A]/15 hover:border-[#8B98E3] transition-colors text-[11px] sm:text-sm font-medium flex-1 sm:flex-initial justify-center whitespace-nowra"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/momo_meomeow"
                className="flex items-center gap-2 px-2.5 py-2.5 rounded-2xl border-2 border-[#4A4A6A]/15 hover:border-[#8B98E3] transition-colors text-[11px] sm:text-sm font-medium flex-1 sm:flex-initial justify-center whitespace-nowra"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#ig)"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
                Instagram
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@momo_meomeow"
                className="flex items-center gap-2 px-2.5 py-2.5 rounded-2xl border-2 border-[#4A4A6A]/15 hover:border-[#8B98E3] transition-colors text-[11px] sm:text-sm font-medium flex-1 sm:flex-initial justify-center whitespace-nowra"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="#4A4A6A"
                >
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.353 1.324-3.179.917-.824 2.188-1.306 3.579-1.364 1.224-.05 2.117.152 2.99.57V8.508c0-.303-.026-.604-.086-.9h2.14c.06.297.086.598.086.9v6.274c0 .303.026.598.086.896h-2.14a4.68 4.68 0 01-.086-.896V8.508z" />
                </svg>
                Threads
              </a>
            </div>
          </div>
        </div>

        {/* Cột 2: Thông tin */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-[#4A4A6A] uppercase tracking-[0.2em] mb-2">
            Thông tin
          </p>
          {[
            { label: "Mấy con mẹo của mình", path: "/collection" },
            { label: "Quy trình đóng gói", path: "/about" },
            { label: "Đăng ký giữ chỗ", path: "/mail-clup" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm text-[#4A4A6A]/65 hover:text-[#8B98E3] transition-colors w-fit"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Cột 3: Bưu cục Momo */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-[#4A4A6A] uppercase tracking-[0.2em] mb-2">
            Liên hệ với Momo
          </p>
          <div className="flex flex-col gap-3 text-sm text-[#4A4A6A]/65">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>hello@momomelody.vn</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>090 123 4567</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Góc Sổ Tay, Tầng Mơ Mộng, Momo Melody Studio 🎧</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#8B98E3]/20 py-5 text-center text-xs text-[#4A4A6A]/40 px-4">
        © 2026 Momo Melody Studio. Chúc bạn một ngày ngập tràn giai điệu và nắng
        ấm 💙
      </div>
    </footer>
  );
};

export default Footer;
