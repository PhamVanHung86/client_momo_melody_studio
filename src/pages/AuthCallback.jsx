import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setTokens } from "../api/client";
import { useAuth } from "../context/AuthContext";

// Trang trung gian sau khi đăng nhập Google thành công.
// Server redirect về đây kèm ?accessToken=xxx&refreshToken=yyy (xem
// server/routes/authRoutes.js). Ta lưu cả 2 token vào localStorage rồi gọi
// lại checkAuth() để nạp thông tin user, sau đó điều hướng về trang chủ —
// không để lộ token trên URL lâu.
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    const finish = async () => {
      if (accessToken && refreshToken) {
        setTokens({ accessToken, refreshToken });
        await checkAuth();
      }
      navigate("/", { replace: true });
    };

    finish();
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center text-[#4A4A6A]">
      Đang đăng nhập...
    </div>
  );
};

export default AuthCallback;
