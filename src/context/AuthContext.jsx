import { createContext, useContext, useState, useEffect } from "react";

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
      const res = await fetch("http://localhost:4000/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  const logout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    localStorage.removeItem("cartItems"); // ← xóa cart luôn
  };

  const updateProfile = async (formData) => {
    const res = await fetch("http://localhost:4000/api/auth/profile", {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  // Thêm vào value:
  // updateProfile,

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
