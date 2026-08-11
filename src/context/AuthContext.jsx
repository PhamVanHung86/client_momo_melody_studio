import { createContext, useContext, useState, useEffect } from "react";
import {
  apiFetch,
  setTokens,
  getRefreshToken,
  removeToken,
} from "../api/client";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập khi load app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
      else removeToken(); // token hết hạn/không hợp lệ → dọn luôn
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setTokens(data);
      setUser(data.user);
    }
    return data;
  };

  const login = async (email, password) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setTokens(data);
      setUser(data.user);
    }
    return data;
  };

  const loginWithGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:4000"
    }/api/auth/google`;
  };

  const logout = async () => {
    // Gửi kèm refreshToken để server thu hồi hẳn (không dùng lại được nữa),
    // không chỉ đơn thuần xoá ở phía trình duyệt.
    await apiFetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    });
    removeToken();
    setUser(null);
    localStorage.removeItem("cartItems"); // ← xóa cart luôn
  };

  const updateProfile = async (formData) => {
    const res = await apiFetch("/api/auth/profile", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  const syncUser = (updatedUser) => {
    if (updatedUser) setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        checkAuth,
        updateProfile,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
