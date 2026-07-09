// import React, { useState, useEffect, useContext } from "react";
// import { useAuth } from "../context/AuthContext";
// import { ShopContext } from "../context/ShopContext";

// const MONTHS = [
//   "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
//   "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
//   "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
// ];

// const PLANS = [
//   {
//     id: "monthly",
//     label: "Gói Tháng",
//     emoji: "🌸",
//     price: "150,000đ",
//     duration: "1 tháng",
//     benefits: [
//       "1 hộp quà handmade mỗi tháng",
//       "3-5 sản phẩm độc quyền",
//       "Bưu thiếp viết tay từ momo",
//       "Freeship toàn quốc",
//     ],
//     bg: "bg-[#FFD6E0]",
//     border: "border-[#FFB7C5]",
//   },
//   {
//     id: "quarterly",
//     label: "Gói Quý",
//     emoji: "🎀",
//     price: "420,000đ",
//     duration: "3 tháng",
//     benefits: [
//       "3 hộp quà handmade mỗi quý",
//       "Tiết kiệm 30,000đ so với gói tháng",
//       "Quà tặng đặc biệt tháng đầu",
//       "Bưu thiếp viết tay từ momo",
//       "Freeship toàn quốc",
//       "Ưu tiên sản phẩm limited",
//     ],
//     bg: "bg-[#E8E4F5]",
//     border: "border-[#8B98E3]",
//     recommended: true,
//   },
// ];

// const MailClub = () => {
//   const { user } = useAuth();
//   const { currency } = useContext(ShopContext);

//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [mySubscription, setMySubscription] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//   });

//   useEffect(() => {
//     if (user) {
//       setForm({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//       fetchMySubscription();
//     }
//   }, [user]);

//   const fetchMySubscription = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/api/mail-club/my", {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (data.success && data.subscription)
//         setMySubscription(data.subscription);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSubscribe = async () => {
//     if (!form.name || !form.email || !form.phone) {
//       setError("Vui lòng điền đầy đủ thông tin");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("http://localhost:4000/api/mail-club/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           plan: selectedPlan,
//           userId: user?._id || null,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSubmitted(true);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Không thể kết nối server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysLeft = (endDate) => {
//     const diff = new Date(endDate) - new Date();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   const statusInfo = {
//     pending: { label: "⏳ Chờ xác nhận", color: "bg-[#FFF0A0] text-[#4A4A6A]" },
//     active: { label: "✅ Đang active", color: "bg-[#D4F4DD] text-green-700" },
//     expired: { label: "❌ Hết hạn", color: "bg-gray-100 text-gray-500" },
//   };

//   return (
//     <div className="min-h-screen bg-[#FFFAF5]">
//       {/* Banner */}
//       <div className="bg-gradient-to-br from-[#FFD6E0] to-[#E8E4F5] py-16 text-center px-4">
//         <span className="text-5xl">✉️</span>
//         <h1
//           style={{ fontFamily: "'Dancing Script', cursive" }}
//           className="text-4xl md:text-5xl text-[#4A4A6A] mt-3 mb-3"
//         >
//           Mail Club
//         </h1>
//         <p className="text-sm md:text-base text-[#4A4A6A]/70 max-w-md mx-auto">
//           Nhận hộp quà handmade độc quyền mỗi tháng — được chọn lọc tỉ mỉ bởi
//           momo 🩷
//         </p>
//       </div>

//       <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
//         {/* Trạng thái sub hiện tại */}
//         {mySubscription && (
//           <div
//             className={`rounded-3xl p-6 mb-10 border-2 ${
//               mySubscription.status === "active"
//                 ? "border-[#B8DEFF] bg-[#F0F7FF]"
//                 : mySubscription.status === "pending"
//                   ? "border-[#FFF0A0] bg-[#FFFDF0]"
//                   : "border-gray-200 bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center justify-between flex-wrap gap-3">
//               <div>
//                 <p className="text-xs text-[#4A4A6A]/50 mb-1">
//                   Gói đăng ký của bạn
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <p className="text-base font-semibold text-[#4A4A6A]">
//                     Mail Club{" "}
//                     {mySubscription.plan === "monthly" ? "Tháng" : "Quý"}
//                   </p>
//                   <span
//                     className={`text-xs px-3 py-1 rounded-full font-medium ${statusInfo[mySubscription.status]?.color}`}
//                   >
//                     {statusInfo[mySubscription.status]?.label}
//                   </span>
//                 </div>
//               </div>

//               {mySubscription.status === "active" && mySubscription.endDate && (
//                 <div className="text-right">
//                   <p className="text-xs text-[#4A4A6A]/50">Hết hạn</p>
//                   <p className="text-sm font-semibold text-[#4A4A6A]">
//                     {new Date(mySubscription.endDate).toLocaleDateString(
//                       "vi-VN",
//                     )}
//                   </p>
//                   {getDaysLeft(mySubscription.endDate) <= 7 && (
//                     <p className="text-xs text-orange-500 mt-0.5">
//                       ⚠️ Còn {getDaysLeft(mySubscription.endDate)} ngày
//                     </p>
//                   )}
//                 </div>
//               )}

//               {mySubscription.status === "pending" && (
//                 <div className="text-right">
//                   <p className="text-xs text-[#4A4A6A]/50">
//                     Đang chờ xác nhận thanh toán
//                   </p>
//                   <p className="text-xs text-[#FFB7C5] mt-0.5">
//                     Trong vòng 24h 🩷
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Chọn gói */}
//         {!mySubscription && (
//           <>
//             <div className="text-center mb-10">
//               <h2
//                 style={{ fontFamily: "'Dancing Script', cursive" }}
//                 className="text-3xl text-[#4A4A6A]"
//               >
//                 Chọn gói phù hợp với bạn
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
//               {PLANS.map((plan) => (
//                 <div
//                   key={plan.id}
//                   onClick={() => setSelectedPlan(plan.id)}
//                   className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 border-2 ${
//                     selectedPlan === plan.id
//                       ? `${plan.border} ${plan.bg} scale-[1.02] shadow-lg`
//                       : "border-transparent bg-white hover:border-[#FFD6E0] shadow-sm"
//                   }`}
//                 >
//                   {plan.recommended && (
//                     <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B98E3] text-white text-xs font-bold px-4 py-1 rounded-full">
//                       Tiết kiệm hơn ⭐
//                     </span>
//                   )}

//                   <div className="text-center mb-5">
//                     <span className="text-4xl">{plan.emoji}</span>
//                     <h3 className="text-lg font-semibold text-[#4A4A6A] mt-2">
//                       {plan.label}
//                     </h3>
//                     <p className="text-2xl font-bold text-[#FFB7C5] mt-1">
//                       {plan.price}
//                     </p>
//                     <p className="text-xs text-[#4A4A6A]/50">
//                       /{plan.duration}
//                     </p>
//                   </div>

//                   <ul className="flex flex-col gap-2">
//                     {plan.benefits.map((b, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2 text-sm text-[#4A4A6A]/70"
//                       >
//                         <span className="text-[#FFB7C5] mt-0.5">✓</span>
//                         {b}
//                       </li>
//                     ))}
//                   </ul>

//                   {selectedPlan === plan.id && (
//                     <div className="mt-4 text-center text-xs font-medium text-[#FFB7C5]">
//                       ✓ Đã chọn gói này
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Nút đăng ký */}
//             <div className="text-center">
//               <button
//                 onClick={() => selectedPlan && setShowForm(true)}
//                 disabled={!selectedPlan}
//                 className="bg-[#FFB7C5] text-white px-12 py-4 rounded-full text-sm font-semibold hover:bg-[#ff9db5] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
//               >
//                 Đăng ký ngay 🌸
//               </button>
//               {!selectedPlan && (
//                 <p className="text-xs text-[#4A4A6A]/40 mt-2">
//                   Vui lòng chọn gói trước
//                 </p>
//               )}
//             </div>
//           </>
//         )}

//         {/* Form đăng ký */}
//         {showForm && !submitted && (
//           <>
//             <div
//               onClick={() => setShowForm(false)}
//               className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
//             />
//             <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
//               <div className="bg-white rounded-3xl p-6 shadow-2xl">
//                 <h3
//                   style={{ fontFamily: "'Dancing Script', cursive" }}
//                   className="text-2xl text-[#4A4A6A] mb-1"
//                 >
//                   Đăng ký{" "}
//                   {selectedPlan === "monthly" ? "Gói Tháng 🌸" : "Gói Quý 🎀"}
//                 </h3>
//                 <p className="text-xs text-[#4A4A6A]/50 mb-5">
//                   Điền thông tin để chúng mình gửi hộp quà đến bạn nhé!
//                 </p>

//                 {error && (
//                   <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
//                     {error}
//                   </div>
//                 )}

//                 <div className="flex flex-col gap-4">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-xs text-[#4A4A6A]/60">
//                       Họ và tên
//                     </label>
//                     <input
//                       value={form.name}
//                       onChange={(e) =>
//                         setForm({ ...form, name: e.target.value })
//                       }
//                       placeholder="Nguyễn Văn A"
//                       className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-xs text-[#4A4A6A]/60">Email</label>
//                     <input
//                       type="email"
//                       value={form.email}
//                       onChange={(e) =>
//                         setForm({ ...form, email: e.target.value })
//                       }
//                       placeholder="momo@example.com"
//                       className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-xs text-[#4A4A6A]/60">
//                       Số điện thoại
//                     </label>
//                     <input
//                       value={form.phone}
//                       onChange={(e) =>
//                         setForm({ ...form, phone: e.target.value })
//                       }
//                       placeholder="0901 234 567"
//                       className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A]"
//                   >
//                     Hủy
//                   </button>
//                   <button
//                     onClick={handleSubscribe}
//                     disabled={loading}
//                     className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5] disabled:opacity-50"
//                   >
//                     {loading ? "Đang xử lý..." : "Xác nhận đăng ký 🌸"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Sau khi đăng ký thành công */}
//         {submitted && (
//           <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center border border-[#FFD6E0]/50 shadow-sm mt-8">
//             <span className="text-5xl">🎀</span>
//             <h2
//               style={{ fontFamily: "'Dancing Script', cursive" }}
//               className="text-3xl text-[#4A4A6A] mt-4 mb-2"
//             >
//               Đăng ký thành công!
//             </h2>
//             <p className="text-sm text-[#4A4A6A]/60 mb-6">
//               Chúng mình đã gửi thông tin chuyển khoản vào email của bạn. Sau
//               khi thanh toán, chúng mình sẽ xác nhận trong vòng 24h nhé! 🩷
//             </p>
//             <div className="bg-[#FFF0F5] rounded-2xl p-4 text-left text-sm text-[#4A4A6A]">
//               <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
//               <p>
//                 Ngân hàng: <strong>TP Bank</strong>
//               </p>
//               <p>
//                 Số TK: <strong>24182951170</strong>
//               </p>
//               <p>
//                 Chủ TK: <strong>TRAN THI NGOC ANH</strong>
//               </p>
//               <p className="text-[#FFB7C5] font-semibold mt-2">
//                 Nội dung CK: Ten - SĐT
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MailClub;

import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const PLANS = [
  {
    id: "monthly",
    label: "Gói Tháng",
    emoji: "🌸",
    price: "150,000đ",
    duration: "1 tháng",
    benefits: [
      "1 hộp quà handmade mỗi tháng",
      "3-5 sản phẩm độc quyền",
      "Bưu thiếp viết tay từ momo",
      "Freeship toàn quốc",
    ],
    bg: "bg-[#FFD6E0]",
    border: "border-[#FFB7C5]",
  },
  {
    id: "quarterly",
    label: "Gói Quý",
    emoji: "🎀",
    price: "420,000đ",
    duration: "3 tháng",
    benefits: [
      "3 hộp quà handmade mỗi quý",
      "Tiết kiệm 30,000đ so với gói tháng",
      "Quà tặng đặc biệt tháng đầu",
      "Bưu thiếp viết tay từ momo",
      "Freeship toàn quốc",
      "Ưu tiên sản phẩm limited",
    ],
    bg: "bg-[#E8E4F5]",
    border: "border-[#8B98E3]",
    recommended: true,
  },
];

const MailClub = () => {
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mySubscription, setMySubscription] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      fetchMySubscription();
    }
    fetchCollections();
  }, [user]);

  const fetchCollections = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/mail-club-collections",
      );
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
        // Tự mở tháng mới nhất
        if (data.collections.length > 0)
          setExpandedMonth(data.collections[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySubscription = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/mail-club/my", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.subscription)
        setMySubscription(data.subscription);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/mail-club/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan,
          userId: user?._id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setShowForm(false);
      } else setError(data.message);
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate) =>
    Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

  const statusInfo = {
    pending: { label: "⏳ Chờ xác nhận", color: "bg-[#FFF0A0] text-[#4A4A6A]" },
    active: { label: "✅ Đang active", color: "bg-[#D4F4DD] text-green-700" },
    expired: { label: "❌ Hết hạn", color: "bg-gray-100 text-gray-500" },
  };

  return (
    <div className="bg-[#FFFAF5]">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#FFD6E0] to-[#E8E4F5] py-16 text-center px-4">
        <span className="text-5xl">✉️</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3 mb-3"
        >
          Mail Club
        </h1>
        <p className="text-sm md:text-base text-[#4A4A6A]/70 max-w-md mx-auto">
          Nhận hộp quà handmade độc quyền mỗi tháng — được chọn lọc tỉ mỉ bởi
          momo 🩷
        </p>
      </div>

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12 flex flex-col gap-16">
        {/* ===== GALLERY THEO THÁNG ===== */}
        {collections.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <h2
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-3xl md:text-4xl text-[#4A4A6A]"
              >
                Sản phẩm các tháng trước
              </h2>
              <p className="text-sm text-[#4A4A6A]/50 mt-2">
                Xem những gì đã có trong hộp quà mỗi tháng 🎁
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {collections.map((col) => (
                <div
                  key={col._id}
                  className="bg-[#E8E4F5] rounded-3xl border border-[#FFD6E0]/50 overflow-hidden"
                >
                  {/* Header — click để mở/đóng */}
                  <button
                    onClick={() =>
                      setExpandedMonth(
                        expandedMonth === col._id ? null : col._id,
                      )
                    }
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FFFAF5] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌸</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#4A4A6A]">
                          {col.title}
                        </p>
                        <p className="text-xs text-[#4A4A6A]/50">
                          {MONTHS[col.month - 1]} {col.year} ·{" "}
                          {col.images.length} sản phẩm
                        </p>
                      </div>
                    </div>
                    <span className="text-[#4A4A6A]/30 text-sm">
                      {expandedMonth === col._id ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Gallery */}
                  {expandedMonth === col._id && (
                    <div className="px-6 pb-6">
                      {col.description && (
                        <p className="text-sm text-[#4A4A6A]/60 mb-4 italic">
                          {col.description}
                        </p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {col.images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedImage(img)}
                            className="aspect-square overflow-hidden rounded-2xl cursor-pointer group"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TRẠNG THÁI SUB HIỆN TẠI ===== */}
        {mySubscription && (
          <div
            className={`rounded-3xl p-6 border-2 ${
              mySubscription.status === "active"
                ? "border-[#B8DEFF] bg-[#F0F7FF]"
                : mySubscription.status === "pending"
                  ? "border-[#FFF0A0] bg-[#FFFDF0]"
                  : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-[#4A4A6A]/50 mb-1">
                  Gói đăng ký của bạn
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-[#4A4A6A]">
                    Mail Club{" "}
                    {mySubscription.plan === "monthly" ? "Tháng" : "Quý"}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusInfo[mySubscription.status]?.color}`}
                  >
                    {statusInfo[mySubscription.status]?.label}
                  </span>
                </div>
              </div>
              {mySubscription.status === "active" && mySubscription.endDate && (
                <div className="text-right">
                  <p className="text-xs text-[#4A4A6A]/50">Hết hạn</p>
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    {new Date(mySubscription.endDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                  {getDaysLeft(mySubscription.endDate) <= 7 && (
                    <p className="text-xs text-orange-500 mt-0.5">
                      ⚠️ Còn {getDaysLeft(mySubscription.endDate)} ngày
                    </p>
                  )}
                </div>
              )}
              {mySubscription.status === "pending" && (
                <p className="text-xs text-[#FFB7C5]">
                  Đang chờ xác nhận thanh toán — trong 24h 🩷
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===== CHỌN GÓI ===== */}
        {!mySubscription && (
          <div>
            <div className="text-center mb-10">
              <h2
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-3xl md:text-4xl text-[#4A4A6A]"
              >
                Đăng ký Mail Club
              </h2>
              <p className="text-sm text-[#4A4A6A]/50 mt-2">
                Chọn gói phù hợp và nhận hộp quà mỗi tháng 🎁
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                    selectedPlan === plan.id
                      ? `${plan.border} ${plan.bg} scale-[1.02] shadow-lg`
                      : "border-transparent bg-white hover:border-[#FFD6E0] shadow-sm"
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B98E3] text-white text-xs font-bold px-4 py-1 rounded-full">
                      Tiết kiệm hơn ⭐
                    </span>
                  )}
                  <div className="text-center mb-5">
                    <span className="text-4xl">{plan.emoji}</span>
                    <h3 className="text-lg font-semibold text-[#4A4A6A] mt-2">
                      {plan.label}
                    </h3>
                    <p className="text-2xl font-bold text-[#FFB7C5] mt-1">
                      {plan.price}
                    </p>
                    <p className="text-xs text-[#4A4A6A]/50">
                      /{plan.duration}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {plan.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#4A4A6A]/70"
                      >
                        <span className="text-[#FFB7C5] mt-0.5">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <p className="mt-4 text-center text-xs font-medium text-[#FFB7C5]">
                      ✓ Đã chọn
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => selectedPlan && setShowForm(true)}
                disabled={!selectedPlan}
                className="bg-[#FFB7C5] text-white px-12 py-4 rounded-full text-sm font-semibold hover:bg-[#ff9db5] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                Đăng ký ngay 🌸
              </button>
              {!selectedPlan && (
                <p className="text-xs text-[#4A4A6A]/40 mt-2">
                  Vui lòng chọn gói trước
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form đăng ký */}
      {showForm && !submitted && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-2xl text-[#4A4A6A] mb-1"
              >
                {selectedPlan === "monthly" ? "Gói Tháng 🌸" : "Gói Quý 🎀"}
              </h3>
              <p className="text-xs text-[#4A4A6A]/50 mb-5">
                Điền thông tin để nhận hộp quà nhé!
              </p>

              {error && (
                <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Họ và tên</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="momo@example.com"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Số điện thoại
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="0901 234 567"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="14, aaa, aa, â"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5] disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận 🌸"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sau khi đăng ký */}
      {submitted && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <span className="text-5xl">🎀</span>
            <h2
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-3xl text-[#4A4A6A] mt-4 mb-2"
            >
              Đăng ký thành công!
            </h2>
            <p className="text-sm text-[#4A4A6A]/60 mb-6">
              Thông tin chuyển khoản đã được gửi vào email của bạn. Xác nhận
              trong 24h 🩷
            </p>
            <div className="bg-[#FFF0F5] rounded-2xl p-4 text-left text-sm text-[#4A4A6A] mb-5">
              <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
              <p>
                Ngân hàng: <strong>TP Bank</strong>
              </p>
              <p>
                Số TK: <strong>24182951170</strong>
              </p>
              <p>
                Chủ TK: <strong>TRAN THI NGOC ANH</strong>
              </p>
              <p className="text-[#FFB7C5] font-semibold mt-2">
                Nội dung CK: TÊN - SĐT
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setShowForm(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Lightbox xem ảnh */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
        >
          <img
            src={selectedImage}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            alt=""
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-3xl opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default MailClub;
