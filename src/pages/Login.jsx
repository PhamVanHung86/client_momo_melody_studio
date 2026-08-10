import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register, loginWithGoogle, user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập thì về trang chủ
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  // Hiển thị lỗi Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "google") {
      setError("Đăng nhập Google thất bại, thử lại nhé!");
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Lấy trang muốn vào trước đó
  const from = location.state?.from || "/";

  // Thay navigate("/") thành:
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = isLogin
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);

      if (data.success) {
        navigate(from, { replace: true }); // ← về trang cũ
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFD6E0]/50">
          {/* Tiêu đề */}
          <div className="text-center mb-8">
            <h1
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-4xl text-[#4A4A6A] mb-2"
            >
              {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
            </h1>
            <p className="text-xs text-[#4A4A6A]/50">
              {isLogin
                ? "Đăng nhập để tiếp tục mua sắm 🩷"
                : "Đăng ký để theo dõi đơn hàng 🎀"}
            </p>
          </div>

          {/* Lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Họ và tên</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="momo@example.com"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Mật khẩu</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5]"
              />
            </div>

            {isLogin && (
              <p className="text-xs text-right text-[#FFB7C5] cursor-pointer hover:underline">
                Quên mật khẩu?
              </p>
            )}

            {/* Nút submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full bg-[#FFB7C5] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-[#ff9db5] active:scale-95 transition-all disabled:opacity-60"
            >
              {loading
                ? "Đang xử lý..."
                : isLogin
                  ? "Đăng nhập 🌸"
                  : "Đăng ký 🎀"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <hr className="flex-1 border-[#FFD6E0]" />
              <span className="text-xs text-[#4A4A6A]/40">hoặc</span>
              <hr className="flex-1 border-[#FFD6E0]" />
            </div>

            {/* Google */}
            <button
              onClick={loginWithGoogle}
              className="disable w-full flex items-center justify-center gap-3 border border-[#FFD6E0] py-3 rounded-2xl text-sm text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </button>
          </div>

          {/* Chuyển login/register */}
          <p className="text-center text-xs text-[#4A4A6A]/50 mt-6">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#FFB7C5] font-medium cursor-pointer hover:underline ml-1"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </span>
          </p>
        </div>

        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-center text-[#4A4A6A]/30 mt-6 text-lg"
        >
          momo's melody studio
        </p>
      </div>
    </div>
  );
};

export default Login;
