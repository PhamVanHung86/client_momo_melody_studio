import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { getCartCount, products } = useContext(ShopContext);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { clearCart } = useContext(ShopContext);

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
      if (e.key === "Escape") setSearchOpen(false);
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

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHome
            ? "bg-gradient-to-r from-[#C9C9EA]/90 via-[#D4D0F0]/90 to-[#C9C9EA]/90 backdrop-blur-md border-b border-[#8B98E3]/20"
            : "bg-white/95 backdrop-blur-md border-b border-[#C9C9EA]/40"
        } shadow-sm`}
      >
        {/* TẦNG 1 */}
        <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-9 md:py-5">
          {/* Trái: Search */}
          <div className="hidden md:flex w-1/4 flex justify-start">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 group"
            >
              <img
                src={assets.search_icon}
                className="w-4 opacity-40 group-hover:opacity-80 transition-opacity"
                alt="Search"
              />
              <span className="hidden md:block text-xs tracking-wider text-[#4A4A6A]/50 group-hover:text-[#8B98E3] transition-colors">
                Tìm kiếm
              </span>
            </button>
          </div>

          {/* Giữa: Logo */}
          <div className="w-3/4 flex justify-center ">
            <Link to="/">
              <h1
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-2xl md:text-4xl lg:text-5xl text-[#4A4A6A] tracking-wide font-normal lowercase cursor-pointer hover:text-[#8B98E3] transition-colors select-none"
              >
                momo's melody studio
              </h1>
            </Link>
          </div>

          {/* Phải: Icons */}
          <div className="w-1/4 flex items-center justify-end gap-5">
            {/* Profile */}
            <div className="group relative">
              <div className="cursor-pointer">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-[#C9C9EA]"
                    alt={user.name}
                  />
                ) : (
                  <img
                    className="w-4 opacity-40 hover:opacity-80 transition-opacity"
                    src={assets.profile_icon}
                    alt="Profile"
                  />
                )}
              </div>

              <div className="group-hover:block hidden absolute right-0 pt-3 z-20">
                <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white text-[#4A4A6A] rounded-2xl shadow-lg border border-[#C9C9EA]/50 text-xs">
                  {user ? (
                    <>
                      <p className="font-medium text-[#8B98E3] truncate">
                        {user.name}
                      </p>
                      <hr className="border-[#C9C9EA]/50" />
                      <Link
                        to="/profile"
                        className="cursor-pointer hover:text-[#FFB7C5] transition-colors"
                      >
                        Hồ sơ của tôi
                      </Link>
                      <Link
                        to="/orders"
                        className="hover:text-[#8B98E3] transition-colors"
                      >
                        Đơn hàng
                      </Link>
                      <p
                        onClick={handleLogout}
                        className="cursor-pointer hover:text-[#8B98E3] transition-colors"
                      >
                        Đăng xuất
                      </p>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="hover:text-[#8B98E3] transition-colors"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/login?mode=register"
                        className="hover:text-[#8B98E3] transition-colors"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-4 opacity-40 hover:opacity-80 transition-opacity"
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute -right-1.5 -bottom-1.5 w-4 h-4 text-center leading-4 bg-[#8B98E3] text-white font-bold rounded-full text-[8px]">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-4 cursor-pointer sm:hidden opacity-40"
              alt="Menu"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] h-[1px] bg-gradient-to-r from-transparent via-[#8B98E3]/30 to-transparent" />

        {/* TẦNG 2: Nav links */}
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

      {/* Spacer */}
      <div className="h-[100px] sm:h-[115px]" />

      {/* SEARCH POPUP */}
      {searchOpen && (
        <>
          <div
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          />
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[70] w-full max-w-xl px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#C9C9EA]/50 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#C9C9EA]/30">
                <img
                  src={assets.search_icon}
                  className="w-4 opacity-30 flex-shrink-0"
                  alt=""
                />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 text-sm text-[#4A4A6A] outline-none placeholder:text-[#4A4A6A]/25"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#4A4A6A]/30 hover:text-[#8B98E3] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="flex flex-col">
                  {suggestions.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handleSelectProduct(p._id)}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F4FF] transition-colors text-left border-b border-[#C9C9EA]/20 last:border-0"
                    >
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-[#F5F4FF] flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-[#4A4A6A]">{p.name}</p>
                        <p className="text-xs text-[#8B98E3] font-medium">
                          {p.price.toLocaleString()} VND
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="px-5 py-3 text-xs text-[#8B98E3] hover:bg-[#F5F4FF] transition-colors text-center font-medium"
                  >
                    Xem tất cả kết quả cho "{searchQuery}" →
                  </button>
                </div>
              )}

              {searchQuery.trim() && suggestions.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <span className="text-3xl">🔍</span>
                  <p className="text-sm text-[#4A4A6A]/40 mt-2">
                    Không tìm thấy "{searchQuery}"
                  </p>
                </div>
              )}

              {!searchQuery && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-[#4A4A6A]/30">
                    Nhập tên sản phẩm để tìm kiếm 🌸
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 shadow-2xl ${visible ? "w-72" : "w-0"}`}
      >
        <div className="flex flex-col min-w-[288px]">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 px-6 py-5 cursor-pointer border-b border-[#C9C9EA]/30"
          >
            <img
              src={assets.dropdown_icon}
              className="h-3.5 rotate-180 opacity-30"
              alt="Back"
            />
            <p
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-xl text-[#4A4A6A]"
            >
              momo's melody studio
            </p>
          </div>
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-8 border-b border-[#C9C9EA]/20 text-sm transition-colors ${
                  isActive
                    ? "text-[#8B98E3] bg-[#F5F4FF] font-medium"
                    : "text-[#4A4A6A]/65 hover:bg-[#F5F4FF] hover:text-[#8B98E3]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
        />
      )}
    </>
  );
};

export default Navbar;
