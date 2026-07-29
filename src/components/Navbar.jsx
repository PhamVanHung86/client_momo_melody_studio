// //

// import React, { useContext, useState, useRef, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { ShopContext } from "../context/ShopContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [visible, setVisible] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const { getCartCount, products, clearCart } = useContext(ShopContext);
//   const inputRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isHome = location.pathname === "/";

//   const navLinks = [
//     { label: "Home", path: "/" },
//     { label: "Phone Charms", path: "/phone-charms" },
//     { label: "Keychain", path: "/keychain" },
//     { label: "Pins", path: "/pins" },
//     { label: "Postcards", path: "/postcards" },
//     { label: "Stickers", path: "/stickers" },
//     { label: "Mail Club", path: "/mail-club" },
//     { label: "Contact", path: "/contact" },
//   ];

//   useEffect(() => {
//     if (searchOpen) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     } else {
//       setSearchQuery("");
//       setSuggestions([]);
//     }
//   }, [searchOpen]);

//   useEffect(() => {
//     if (searchQuery.trim().length < 1) {
//       setSuggestions([]);
//       return;
//     }
//     const results = products.filter((p) =>
//       p.name.toLowerCase().includes(searchQuery.toLowerCase()),
//     );
//     setSuggestions(results.slice(0, 5));
//   }, [searchQuery, products]);

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "Escape") setSearchOpen(false);
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, []);

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;
//     setSearchOpen(false);
//     navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
//   };

//   const handleSelectProduct = (id) => {
//     setSearchOpen(false);
//     navigate(`/product/${id}`);
//   };

//   const handleLogout = async () => {
//     await logout();
//     clearCart();
//     navigate("/");
//   };

//   return (
//     <>
//       <div
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           isHome
//             ? "bg-gradient-to-r from-[#8B98e3]/90 via-[#D4D0F0]/90 to-[#C9C9EA]/90 backdrop-blur-md border-b border-[#8B98E3]/20"
//             : "to-[#C9C9EA]/80 backdrop-blur-md border-b border-[#C9C9EA]/40"
//         } shadow-sm`}
//       >
//         {/* TẦNG 1 */}
//         <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-6 md:py-5">
//           {/* Trái: Search - ẨN TRÊN MOBILE (hidden md:flex) */}
//           <div className="hidden md:flex md:w-1/4 justify-start">
//             <button
//               onClick={() => setSearchOpen(true)}
//               className="flex items-center gap-2 group p-1"
//             >
//               <img
//                 src={assets.search_icon}
//                 className="w-4 opacity-40 group-hover:opacity-80 transition-opacity"
//                 alt="Search"
//               />
//               <span className="text-xs tracking-wider text-[#4A4A6A]/50 group-hover:text-[#8B98E3] transition-colors">
//                 Tìm kiếm
//               </span>
//             </button>
//           </div>

//           {/* Giữa/Trái: Logo - Căn trái trên Mobile, Căn giữa trên Desktop */}
//           <div className="flex-1 md:w-2/4 flex justify-start md:justify-center">
//             <Link to="/">
//               <h1
//                 style={{ fontFamily: "'Dancing Script', cursive" }}
//                 className="text-2xl md:text-4xl lg:text-5xl text-[#4A4A6A] tracking-wide font-normal lowercase cursor-pointer hover:text-[#8B98E3] transition-colors select-none"
//               >
//                 momo's melody studio
//               </h1>
//             </Link>
//           </div>

//           {/* Phải: Icons - Tăng khoảng cách (gap-6) & thêm padding chạm trên Mobile */}
//           <div className="flex items-center justify-end gap-6 sm:gap-5 md:w-1/4">
//             {/* Profile */}
//             <div className="group relative">
//               <div className="cursor-pointer p-1 flex items-center justify-center">
//                 {user?.avatar ? (
//                   <img
//                     src={user.avatar}
//                     className="w-7 h-7 md:w-6 md:h-6 rounded-full object-cover ring-2 ring-[#C9C9EA]"
//                     alt={user.name}
//                   />
//                 ) : (
//                   <img
//                     className="w-5 md:w-4 opacity-50 hover:opacity-80 transition-opacity"
//                     src={assets.profile_icon}
//                     alt="Profile"
//                     referrerPolicy="no-referrer"
//                   />
//                 )}
//               </div>

//               <div className="group-hover:block hidden absolute right-0 pt-3 z-20">
//                 <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white text-[#4A4A6A] rounded-2xl shadow-lg border border-[#C9C9EA]/50 text-xs">
//                   {user ? (
//                     <>
//                       <p className="font-medium text-[#8B98E3] truncate">
//                         {user.name}
//                       </p>
//                       <hr className="border-[#C9C9EA]/50" />
//                       <Link
//                         to="/profile"
//                         className="cursor-pointer hover:text-[#FFB7C5] transition-colors"
//                       >
//                         Hồ sơ của tôi
//                       </Link>
//                       <Link
//                         to="/orders"
//                         className="hover:text-[#8B98E3] transition-colors"
//                       >
//                         Đơn hàng
//                       </Link>
//                       <p
//                         onClick={handleLogout}
//                         className="cursor-pointer hover:text-[#8B98E3] transition-colors"
//                       >
//                         Đăng xuất
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         to="/login"
//                         className="hover:text-[#8B98E3] transition-colors"
//                       >
//                         Đăng nhập
//                       </Link>
//                       <Link
//                         to="/login?mode=register"
//                         className="hover:text-[#8B98E3] transition-colors"
//                       >
//                         Đăng ký
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Cart */}
//             <Link
//               to="/cart"
//               id="nav-cart-icon"
//               className="relative p-1 flex items-center justify-center"
//             >
//               <img
//                 src={assets.cart_icon}
//                 className="w-5 md:w-4 opacity-50 hover:opacity-80 transition-opacity"
//                 alt="Cart"
//               />
//               {getCartCount() > 0 && (
//                 <span className="absolute 0 -right-0.5 w-4 h-4 text-center leading-4 bg-[#8B98E3] text-white font-bold rounded-full text-[8px]">
//                   {getCartCount()}
//                 </span>
//               )}
//             </Link>

//             {/* Hamburger Menu */}
//             <button
//               type="button"
//               onClick={() => setVisible(true)}
//               className="p-1 sm:hidden flex items-center justify-center outline-none"
//               aria-label="Open Menu"
//             >
//               <img
//                 src={assets.menu_icon}
//                 className="w-5 opacity-50 hover:opacity-80 transition-opacity"
//                 alt="Menu"
//               />
//             </button>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] h-[1px] bg-gradient-to-r from-transparent via-[#8B98E3]/30 to-transparent" />

//         {/* TẦNG 2: Nav links (chỉ hiển thị từ màn hình sm trở lên) */}
//         <div className="hidden sm:flex justify-center items-center gap-10 px-4 py-3">
//           {navLinks.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `relative text-[18px] font-medium tracking-wide transition-all duration-200 pb-1 ${
//                   isActive
//                     ? "text-[#8B98E3]"
//                     : "text-[#4A4A6A]/65 hover:text-[#8B98E3]"
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {item.label}
//                   {isActive && (
//                     <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B98E3] rounded-full" />
//                   )}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </div>
//       </div>

//       {/* Spacer giữ khoảng cách cho phần nội dung phía dưới navbar fixed */}
//       <div className="h-[70px] sm:h-[115px]" />

//       {/* SEARCH POPUP */}
//       {searchOpen && (
//         <>
//           <div
//             onClick={() => setSearchOpen(false)}
//             className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
//           />
//           <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[70] w-full max-w-xl px-4">
//             <div className="bg-white rounded-3xl shadow-2xl border border-[#C9C9EA]/50 overflow-hidden">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSearch();
//                 }}
//                 className="flex items-center gap-3 px-5 py-4 border-b border-[#C9C9EA]/30"
//               >
//                 <img
//                   src={assets.search_icon}
//                   className="w-4 opacity-30 flex-shrink-0"
//                   alt=""
//                 />
//                 <input
//                   ref={inputRef}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Tìm kiếm sản phẩm..."
//                   className="flex-1 text-sm text-[#4A4A6A] outline-none placeholder:text-[#4A4A6A]/25"
//                 />
//                 {searchQuery && (
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("")}
//                     className="text-[#4A4A6A]/30 hover:text-[#8B98E3] transition-colors text-lg leading-none"
//                   >
//                     ×
//                   </button>
//                 )}
//               </form>

//               {suggestions.length > 0 && (
//                 <div className="flex flex-col">
//                   {suggestions.map((p) => (
//                     <button
//                       key={p._id}
//                       type="button"
//                       onClick={() => handleSelectProduct(p._id)}
//                       className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F4FF] transition-colors text-left border-b border-[#C9C9EA]/20 last:border-0"
//                     >
//                       <img
//                         src={p.image[0]}
//                         alt={p.name}
//                         className="w-10 h-10 rounded-xl object-cover bg-[#F5F4FF] flex-shrink-0"
//                       />
//                       <div>
//                         <p className="text-sm text-[#4A4A6A]">{p.name}</p>
//                         <p className="text-xs text-[#8B98E3] font-medium">
//                           {p.price.toLocaleString()} VND
//                         </p>
//                       </div>
//                     </button>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={handleSearch}
//                     className="px-5 py-3 text-xs text-[#8B98E3] hover:bg-[#F5F4FF] transition-colors text-center font-medium"
//                   >
//                     Xem tất cả kết quả cho "{searchQuery}" →
//                   </button>
//                 </div>
//               )}

//               {searchQuery.trim() && suggestions.length === 0 && (
//                 <div className="px-5 py-8 text-center">
//                   <span className="text-3xl">🔍</span>
//                   <p className="text-sm text-[#4A4A6A]/40 mt-2">
//                     Không tìm thấy "{searchQuery}"
//                   </p>
//                 </div>
//               )}

//               {!searchQuery && (
//                 <div className="px-5 py-6 text-center">
//                   <p className="text-xs text-[#4A4A6A]/30">
//                     Nhập tên sản phẩm để tìm kiếm 🌸
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* MOBILE SIDEBAR */}
//       <div
//         className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 shadow-2xl ${
//           visible ? "w-72" : "w-0"
//         }`}
//       >
//         <div className="flex flex-col min-w-[288px]">
//           <div
//             onClick={() => setVisible(false)}
//             className="flex items-center gap-4 px-6 py-5 cursor-pointer border-b border-[#C9C9EA]/30"
//           >
//             <img
//               src={assets.dropdown_icon}
//               className="h-3.5 rotate-180 opacity-30"
//               alt="Back"
//             />
//             <p
//               style={{ fontFamily: "'Dancing Script', cursive" }}
//               className="text-xl text-[#4A4A6A]"
//             >
//               momo's melody studio
//             </p>
//           </div>
//           {navLinks.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               onClick={() => setVisible(false)}
//               className={({ isActive }) =>
//                 `py-4 pl-8 border-b border-[#C9C9EA]/20 text-sm transition-colors ${
//                   isActive
//                     ? "text-[#8B98E3] bg-[#F5F4FF] font-medium"
//                     : "text-[#4A4A6A]/65 hover:bg-[#F5F4FF] hover:text-[#8B98E3]"
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//       </div>

//       {visible && (
//         <div
//           onClick={() => setVisible(false)}
//           className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { timeAgo } from "../utils/timeAgo";
import { apiUrl } from "../api/client";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // 🔔 State mở/đóng bảng thông báo
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { getCartCount, products, clearCart } = useContext(ShopContext);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 🔔 Dữ liệu mẫu thông báo đơn hàng (Có thể thay thế bằng dữ liệu từ API/Context)

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // API_URL giữ lại để tương thích ngược, nay dùng chung apiUrl() từ ../api/client
  const API_URL = apiUrl("");

  const fetchNotifications = async () => {
    if (!user) return;
    setNotifLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        credentials: "include",
      });
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

  // Đóng dropdown thông báo khi click bên ngoài
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

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: "PUT",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Xử lý khi bấm vào 1 thông báo
  const handleNotifClick = async (notif) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notif._id ? { ...item, read: true } : item,
      ),
    );
    setNotifOpen(false);
    if (notif.link) navigate(notif.link);
    try {
      await fetch(`${API_URL}/api/notifications/${notif._id}/read`, {
        method: "PUT",
        credentials: "include",
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
        {/* TẦNG 1 */}
        <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-6 md:py-5">
          {/* Trái: Search - ẨN TRÊN MOBILE (hidden md:flex) */}
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

          {/* Giữa/Trái: Logo */}
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

          {/* Phải: Icons */}
          <div className="flex items-center justify-end gap-5 sm:gap-6 md:w-1/4">
            {/* 🔔 1. CHUÔNG THÔNG BÁO (NOTIFICATION BELL) */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-1 flex items-center justify-center outline-none group cursor-pointer"
                  aria-label="Thông báo"
                >
                  {/* Icon Chuông SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#4A4A6A]/60 group-hover:text-[#8B98E3] transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 0 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 0-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>

                  {/* Chấm đỏ báo số lượng chưa đọc */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-center leading-4 bg-[#FFB7C5] text-white font-bold rounded-full text-[9px] shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* BẢNG DROPDOWN THÔNG BÁO */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#C9C9EA]/50 py-4 px-4 z-50 text-[#4A4A6A] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#C9C9EA]/30">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔔</span>
                        <h3 className="font-semibold text-sm text-[#4A4A6A]">
                          Thông báo
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-[#FFB7C5]/20 text-[#FFB7C5] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-[#8B98E3] hover:underline transition-all"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>

                    {/* Danh sách thông báo */}
                    <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
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
                            <p className="text-[11px] text-[#4A4A6A]/70 mt-1 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-[#4A4A6A]/40 text-xs">
                          <span className="text-2xl block mb-1">🌸</span>
                          Bạn chưa có thông báo nào
                        </div>
                      )}
                    </div>

                    {/* Footer bảng thông báo */}
                    <div className="mt-3 pt-2 border-t border-[#C9C9EA]/30 text-center">
                      <Link
                        to="/orders"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-[#8B98E3] font-medium hover:underline block"
                      >
                        Xem lịch sử đơn hàng →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            <div className="group relative">
              <div className="cursor-pointer p-1 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-7 h-7 md:w-6 md:h-6 rounded-full object-cover ring-2 ring-[#C9C9EA]"
                    alt={user.name}
                  />
                ) : (
                  <img
                    className="w-5 md:w-4 opacity-50 hover:opacity-80 transition-opacity"
                    src={assets.profile_icon}
                    alt="Profile"
                    referrerPolicy="no-referrer"
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
            <Link
              to="/cart"
              id="nav-cart-icon"
              className="relative p-1 flex items-center justify-center"
            >
              <img
                src={assets.cart_icon}
                className="w-5 md:w-4 opacity-50 hover:opacity-80 transition-opacity"
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute 0 -right-0.5 w-4 h-4 text-center leading-4 bg-[#8B98E3] text-white font-bold rounded-full text-[8px]">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="p-1 sm:hidden flex items-center justify-center outline-none"
              aria-label="Open Menu"
            >
              <img
                src={assets.menu_icon}
                className="w-5 opacity-50 hover:opacity-80 transition-opacity"
                alt="Menu"
              />
            </button>
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

      {/* Spacer giữ khoảng cách cho phần nội dung phía dưới navbar fixed */}
      <div className="h-[70px] sm:h-[115px]" />

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
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[#4A4A6A]/30 hover:text-[#8B98E3] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </form>

              {suggestions.length > 0 && (
                <div className="flex flex-col">
                  {suggestions.map((p) => (
                    <button
                      key={p._id}
                      type="button"
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
                    type="button"
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
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 shadow-2xl ${
          visible ? "w-72" : "w-0"
        }`}
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
