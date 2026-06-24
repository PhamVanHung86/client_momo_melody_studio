import React from "react";
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, loading]);

  // Đang kiểm tra auth thì hiện loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-2xl text-[#4A4A6A]/50 animate-pulse"
        >
          momo's melody studio 🌸
        </p>
      </div>
    );
  }

  // Chưa đăng nhập thì redirect về login, lưu lại trang đang muốn vào
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
