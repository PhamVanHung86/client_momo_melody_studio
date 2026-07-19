import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6">🌸</span>
      <h1
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-6xl text-[#4A4A6A] mb-3"
      >
        404
      </h1>
      <p
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-2xl text-[#4A4A6A]/60 mb-2"
      >
        Trang này không tồn tại
      </p>
      <p className="text-sm text-[#4A4A6A]/40 mb-8 max-w-sm">
        Có vẻ như bạn đã lạc đường rồi — nhưng không sao, momo sẽ dẫn bạn về nhà
        🩷
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-[#FFB7C5] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#ff9db5] transition-colors"
        >
          Về trang chủ
        </Link>
        <Link
          to="/collection"
          className="border border-[#FFD6E0] text-[#4A4A6A] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#FFF0F5] transition-colors"
        >
          Xem sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
