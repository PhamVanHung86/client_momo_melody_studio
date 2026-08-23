import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setTokens } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { hasPendingMailClubPlan } from "../utils/pendingMailClubPlan";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  // Thêm ref để chặn React Strict Mode chạy 2 lần
  const isHandled = useRef(false);

  useEffect(() => {
    if (isHandled.current) return;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) return;

    isHandled.current = true; // Đánh dấu đã xử lý

    const finish = async () => {
      setTokens({ accessToken, refreshToken });
      await checkAuth();

      const savedRedirect = sessionStorage.getItem("redirect_from");
      sessionStorage.removeItem("redirect_from");

      const redirectTo =
        savedRedirect || (hasPendingMailClubPlan() ? "/mail-club" : "/");

      navigate(redirectTo, { replace: true });
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
