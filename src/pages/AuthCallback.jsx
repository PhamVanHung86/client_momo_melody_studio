// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { setTokens } from "../api/client";
// import { useAuth } from "../context/AuthContext";
// import { hasPendingMailClubPlan } from "../utils/pendingMailClubPlan";

// // Trang trung gian sau khi đăng nhập Google thành công.
// // Server redirect về đây kèm ?accessToken=xxx&refreshToken=yyy (xem
// // server/routes/authRoutes.js). Ta lưu cả 2 token vào localStorage rồi gọi
// // lại checkAuth() để nạp thông tin user, sau đó điều hướng về trang chủ —
// // không để lộ token trên URL lâu.
// const AuthCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { checkAuth } = useAuth();

//   useEffect(() => {
//     const accessToken = searchParams.get("accessToken");
//     const refreshToken = searchParams.get("refreshToken");

//     const finish = async () => {
//       if (accessToken && refreshToken) {
//         setTokens({ accessToken, refreshToken });
//         await checkAuth();
//       }
//       const redirectTo = hasPendingMailClubPlan() ? "/mail-club" : "/";
//       navigate(redirectTo, { replace: true });
//     };

//     finish();
//   }, [searchParams, navigate, checkAuth]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-[#4A4A6A]">
//       Đang đăng nhập...
//     </div>
//   );
// };

// export default AuthCallback;

// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { setTokens } from "../api/client";
// import { useAuth } from "../context/AuthContext";
// import { hasPendingMailClubPlan } from "../utils/pendingMailClubPlan";

// const AuthCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { checkAuth } = useAuth();

//   useEffect(() => {
//     const accessToken = searchParams.get("accessToken");
//     const refreshToken = searchParams.get("refreshToken");

//     const finish = async () => {
//       if (accessToken && refreshToken) {
//         setTokens({ accessToken, refreshToken });
//         await checkAuth();
//       }

//       // 1. Đọc trang lưu tạm từ sessionStorage (nếu có)
//       const savedRedirect = sessionStorage.getItem("redirect_from");
//       sessionStorage.removeItem("redirect_from");

//       // 2. Thứ tự ưu tiên: Trang lưu tạm -> Mail Club (nếu có plan) -> Trang chủ
//       const redirectTo =
//         savedRedirect || (hasPendingMailClubPlan() ? "/mail-club" : "/");

//       navigate(redirectTo, { replace: true });
//     };

//     finish();
//   }, [searchParams, navigate, checkAuth]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-[#4A4A6A]">
//       Đang đăng nhập...
//     </div>
//   );
// };

// export default AuthCallback;

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
