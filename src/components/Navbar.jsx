import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { timeAgo } from "../utils/timeAgo";
import { apiFetch } from "../api/client";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { getCartCount, products, clearCart } = useContext(ShopContext);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setNotifLoading(true);
    try {
      const res = await apiFetch("/api/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Phone Charms", path: "/phone-charms" },
    { label: "Keychain", path: "/keychain" },
    { label: "Pins", path: "/pins" },
    { label: "Postcards", path: "/postcards" },
    { label: "Stickers", path: "/stickers" },
    { label: "Mail Club", path: "/mail-club" },
    { label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSuggestions([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSuggestions(results.slice(0, 5));
  }, [searchQuery, products]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSelectProduct = (id) => {
    setSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const handleLogout = async () => {
    await logout();
    clearCart();
    navigate("/");
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await apiFetch("/api/notifications/mark-all-read", { method: "PUT" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotifClick = async (notif) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notif._id ? { ...item, read: true } : item,
      ),
    );
    setNotifOpen(false);
    if (notif.link) navigate(notif.link);
    try {
      await apiFetch(`/api/notifications/${notif._id}/read`, {
        method: "PUT",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHome
            ? "bg-gradient-to-r from-[#8B98e3]/90 via-[#D4D0F0]/90 to-[#C9C9EA]/90 backdrop-blur-md border-b border-[#8B98E3]/20"
            : "to-[#C9C9EA]/80 backdrop-blur-md border-b border-[#C9C9EA]/40"
        } shadow-sm`}
      >
        {/* TẦNG 1: TOP BAR */}
        <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-4 md:py-5">
          {/* Trái: Search Desktop */}
          <div className="hidden md:flex md:w-1/4 justify-start">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 group p-1"
            >
              <img
                src={assets.search_icon}
                className="w-4 opacity-40 group-hover:opacity-80 transition-opacity"
                alt="Search"
              />
              <span className="text-xs tracking-wider text-[#4A4A6A]/50 group-hover:text-[#8B98E3] transition-colors">
                Tìm kiếm
              </span>
            </button>
          </div>

          {/* Giữa: Logo */}
          <div className="flex-1 md:w-2/4 flex justify-start md:justify-center">
            <Link to="/">
              <h1
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-2xl md:text-4xl lg:text-5xl text-[#4A4A6A] tracking-wide font-normal lowercase cursor-pointer hover:text-[#8B98E3] transition-colors select-none"
              >
                momo's melody studio
              </h1>
            </Link>
          </div>

          {/* Phải: Các Icon thao tác */}
          <div className="flex items-center justify-end gap-3.5 sm:gap-5 md:w-1/4">
            {/* 🔔 Chuông Thông báo */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-1 flex items-center justify-center outline-none group cursor-pointer"
                  aria-label="Thông báo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#4A4A6A]/70 group-hover:text-[#8B98E3] transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 0 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 0-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-center leading-4 bg-[#FFB7C5] text-white font-bold rounded-full text-[9px] shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Thông báo */}
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 sm:hidden"
                      onClick={() => setNotifOpen(false)}
                    />
                    <div className="fixed left-4 right-4 top-16 z-50 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#C9C9EA]/50 py-4 px-4 text-[#4A4A6A]">
                      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#C9C9EA]/30">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🔔</span>
                          <h3 className="font-semibold text-sm text-[#4A4A6A]">
                            Thông báo
                          </h3>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-[#8B98E3] hover:underline"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>

                      <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotifClick(notif)}
                              className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                                notif.read
                                  ? "bg-white border-transparent hover:bg-[#FFFAF5]"
                                  : "bg-[#F5F4FF] border-[#C9C9EA]/40 shadow-sm"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-semibold text-[#4A4A6A]">
                                  {notif.title}
                                </h4>
                                <span className="text-[10px] text-[#4A4A6A]/40 flex-shrink-0">
                                  {timeAgo(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#4A4A6A]/70 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-[#4A4A6A]/40 text-xs">
                            🌸 Bạn chưa có thông báo nào
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 👤 Profile Icon & Dropdown Menu (Chỉ hiện trên Desktop) */}
            <div className="hidden sm:block group relative">
              <div className="cursor-pointer p-1 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#8B98E3]/40 hover:ring-[#8B98E3] transition-all"
                    alt={user.name}
                  />
                ) : (
                  <img
                    className="w-5 opacity-60 hover:opacity-90 transition-opacity"
                    src={assets.profile_icon}
                    alt="Profile"
                  />
                )}
              </div>

              {/* ✨ DROPDOWN DESKTOP ĐÃ ĐƯỢC THIẾT KẾ LẠI RỘNG RÃI & ĐẸP HƠN */}
              <div className="group-hover:block hidden absolute right-0 pt-3 z-30">
                <div className="flex flex-col gap-1 w-60 p-3 bg-white/95 backdrop-blur-md text-[#4A4A6A] rounded-2xl shadow-xl border border-[#C9C9EA]/50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  {user ? (
                    <>
                      {/* User Info Header */}
                      <div className="flex items-center gap-2.5 px-2 py-2 mb-1 bg-[#F5F4FF] rounded-xl border border-[#C9C9EA]/30">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8B98E3]/30"
                            alt={user.name}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#8B98E3]/20 flex items-center justify-center text-xs font-bold text-[#8B98E3]">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-[#4A4A6A]/50">
                            Tài khoản
                          </p>
                          <p className="font-semibold text-xs text-[#4A4A6A] truncate">
                            {user.name}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F4FF] hover:text-[#8B98E3] transition-all font-medium"
                      >
                        <span className="text-sm">👤</span>
                        <span>Hồ sơ của tôi</span>
                      </Link>

                      {/* 👉 Yêu thích đã được chuyển vào đây! */}
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFFAF5] hover:text-[#FFB7C5] transition-all font-medium"
                      >
                        <span className="text-sm">❤️</span>
                        <span>Sản phẩm yêu thích</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F4FF] hover:text-[#8B98E3] transition-all font-medium"
                      >
                        <span className="text-sm">📦</span>
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      <div className="my-1 border-t border-[#C9C9EA]/30" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFB7C5]/15 text-[#FF8A9A] transition-all font-medium text-left"
                      >
                        <span className="text-sm">🚪</span>
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F5F4FF] hover:text-[#8B98E3] transition-all font-medium"
                      >
                        <span>🔑</span> Đăng nhập
                      </Link>
                      <Link
                        to="/login?mode=register"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F5F4FF] hover:text-[#8B98E3] transition-all font-medium"
                      >
                        <span>✨</span> Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 🛍️ Giỏ hàng */}
            <Link
              to="/cart"
              id="nav-cart-icon"
              className="relative p-1 flex items-center justify-center"
            >
              <img
                src={assets.cart_icon}
                className="w-5 md:w-4 opacity-60 hover:opacity-90 transition-opacity"
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-center leading-4 bg-[#8B98E3] text-white font-bold rounded-full text-[8px]">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Nút Hamburger Menu (Mobile) */}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="p-1 sm:hidden flex items-center justify-center outline-none"
            >
              <img
                src={assets.menu_icon}
                className="w-5 opacity-60 hover:opacity-90"
                alt="Menu"
              />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] h-[1px] bg-gradient-to-r from-transparent via-[#8B98E3]/30 to-transparent" />

        {/* TẦNG 2: Nav Links Desktop */}
        <div className="hidden sm:flex justify-center items-center gap-10 px-4 py-3">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-[18px] font-medium tracking-wide transition-all duration-200 pb-1 ${
                  isActive
                    ? "text-[#8B98E3]"
                    : "text-[#4A4A6A]/65 hover:text-[#8B98E3]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B98E3] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="h-[65px] sm:h-[115px]" />

      {/* SEARCH POPUP */}
      {searchOpen && (
        <>
          <div
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          />
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[70] w-full max-w-xl px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#C9C9EA]/50 overflow-hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex items-center gap-3 px-5 py-4 border-b border-[#C9C9EA]/30"
              >
                <img
                  src={assets.search_icon}
                  className="w-4 opacity-30 flex-shrink-0"
                  alt=""
                />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 text-sm text-[#4A4A6A] outline-none placeholder:text-[#4A4A6A]/25"
                />
              </form>
            </div>
          </div>
        </>
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out shadow-2xl flex flex-col ${
          visible ? "w-[82vw] max-w-[320px]" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#C9C9EA]/30">
          <span
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-xl text-[#4A4A6A] font-bold"
          >
            momo's studio
          </span>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 rounded-full bg-[#F5F4FF] flex items-center justify-center text-[#4A4A6A]/60 hover:text-[#8B98E3] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 custom-scrollbar">
          {user ? (
            <div className="bg-gradient-to-r from-[#F5F4FF] to-[#FAF8FF] p-4 rounded-2xl border border-[#C9C9EA]/40">
              <div className="flex items-center gap-3 mb-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B98E3]/30"
                    alt={user.name}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#8B98E3]/20 flex items-center justify-center text-lg text-[#8B98E3] font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#4A4A6A]/50">Xin chào 🌸</p>
                  <p className="text-sm font-semibold text-[#4A4A6A] truncate">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9C9EA]/30">
                <Link
                  to="/profile"
                  onClick={() => setVisible(false)}
                  className="text-center text-xs py-1.5 px-2 rounded-xl bg-white text-[#4A4A6A] shadow-sm hover:text-[#8B98E3] transition-colors"
                >
                  👤 Hồ sơ
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setVisible(false)}
                  className="text-center text-xs py-1.5 px-2 rounded-xl bg-white text-[#4A4A6A] shadow-sm hover:text-[#8B98E3] transition-colors"
                >
                  📦 Đơn hàng
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#F5F4FF] p-4 rounded-2xl text-center border border-[#C9C9EA]/40">
              <p className="text-xs text-[#4A4A6A]/70 mb-3">
                Đăng nhập để theo dõi đơn hàng & nhận ưu đãi 🎀
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => setVisible(false)}
                  className="flex-1 py-2 text-xs font-medium bg-[#8B98E3] text-white rounded-xl shadow-sm hover:bg-[#7A87D2] transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/login?mode=register"
                  onClick={() => setVisible(false)}
                  className="flex-1 py-2 text-xs font-medium bg-white text-[#4A4A6A] rounded-xl border border-[#C9C9EA]/50 hover:bg-[#FAF8FF] transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-[#8B98E3] uppercase tracking-wider mb-2 px-1">
              Danh mục sản phẩm
            </p>
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-[#8B98E3] text-white shadow-sm font-semibold"
                        : "text-[#4A4A6A]/80 hover:bg-[#F5F4FF] hover:text-[#8B98E3]"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span className="opacity-40 text-[10px]">›</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#C9C9EA]/30">
            <Link
              to="/wishlist"
              onClick={() => setVisible(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-[#4A4A6A]/80 hover:bg-[#FFFAF5] hover:text-[#FFB7C5] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>❤️</span>
                <span>Sản phẩm yêu thích</span>
              </div>
              <span className="text-[10px] text-[#4A4A6A]/40">›</span>
            </Link>
          </div>
        </div>

        {user && (
          <div className="p-4 border-t border-[#C9C9EA]/30 bg-[#FAF8FF]">
            <button
              onClick={() => {
                setVisible(false);
                handleLogout();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-[#FF8A9A] font-medium bg-white hover:bg-[#FFB7C5]/10 border border-[#FFB7C5]/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>🚪</span>
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        )}
      </div>

      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity"
        />
      )}
    </>
  );
};

export default Navbar;
