import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";

const statusColor = {
  "Đang xử lý": "bg-[#FFD6E0] text-[#4A4A6A]",
  "Đang giao": "bg-[#FFF0A0] text-[#4A4A6A]",
  "Đã giao": "bg-[#B8DEFF] text-[#4A4A6A]",
  "Đã hủy": "bg-gray-100 text-gray-400",
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { products } = useContext(ShopContext);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      console.log("Check user: ", user);
    }
  }, [user]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSetPassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/set-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordError("");
        setTimeout(() => {
          setPasswordSuccess(false);
          setShowPasswordForm(false);
        }, 2000);
      } else {
        setPasswordError(data.message);
      }
    } catch {
      setPasswordError("Không thể kết nối server");
    }
  };

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Load đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders/my-orders", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (avatarFile) formData.append("avatar", avatarFile);

      const data = await updateProfile(formData);
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
      console.log("Check formData: ", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
      {/* Header */}
      {/* <div className="flex items-center gap-5 mb-10">
        <div className="relative group">
          <label className="cursor-pointer">
            {avatarPreview || user?.avatar ? (
              <img
                src={avatarPreview || user.avatar}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#FFD6E0]"
                alt={user?.name}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#FFD6E0] flex items-center justify-center text-2xl font-medium text-[#4A4A6A] ring-4 ring-[#FFD6E0]">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">Đổi ảnh</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <h1
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-3xl text-[#4A4A6A]"
          >
            {user?.name}
          </h1>
          <p className="text-sm text-[#4A4A6A]/50">{user?.email}</p>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#FFD6E0]">
        {[
          { key: "profile", label: "Thông tin" },
          { key: "orders", label: `Đơn hàng (${orders.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-[#FFB7C5]"
                : "text-[#4A4A6A]/50 hover:text-[#4A4A6A]"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFB7C5] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab: Profile */}
      {activeTab === "profile" && (
        <div className="max-w-lg flex flex-col gap-5">
          {success && (
            <div className="bg-[#D4F4DD] text-green-600 text-sm px-4 py-3 rounded-xl text-center">
              ✓ Cập nhật thành công!
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              {editing ? (
                <label className="cursor-pointer">
                  {avatarPreview || user?.avatar ? (
                    <img
                      src={avatarPreview || user.avatar}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#FFD6E0]"
                      alt={user?.name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#FFD6E0] flex items-center justify-center text-xl font-medium text-[#4A4A6A]">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px]">Đổi ảnh</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              ) : (
                <>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#FFD6E0]"
                      alt={user?.name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#FFD6E0] flex items-center justify-center text-xl font-medium text-[#4A4A6A]">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A4A6A]">{user?.name}</p>
              <p className="text-xs text-[#4A4A6A]/50">{user?.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Họ tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Họ và tên</label>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white"
                />
              ) : (
                <p className="px-4 py-3 text-sm text-[#4A4A6A] bg-[#FFFAF5] rounded-xl border border-[#FFD6E0]/50">
                  {form.name || "Chưa cập nhật"}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Email</label>
              <p className="px-4 py-3 text-sm text-[#4A4A6A]/40 bg-[#FFFAF5] rounded-xl border border-[#FFD6E0]/50">
                {user?.email}
              </p>
            </div>

            {/* SĐT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Số điện thoại</label>
              {editing ? (
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0901 234 567"
                  className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white"
                />
              ) : (
                <p className="px-4 py-3 text-sm text-[#4A4A6A] bg-[#FFFAF5] rounded-xl border border-[#FFD6E0]/50">
                  {form.phone || "Chưa cập nhật"}
                </p>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Địa chỉ giao hàng mặc định
              </label>
              {editing ? (
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Số nhà, đường, phường, quận, tỉnh/thành phố"
                  rows={3}
                  className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white resize-none"
                />
              ) : (
                <p className="px-4 py-3 text-sm text-[#4A4A6A] bg-[#FFFAF5] rounded-xl border border-[#FFD6E0]/50 min-h-[80px]">
                  {form.address || "Chưa cập nhật"}
                </p>
              )}
            </div>
          </div>

          {/* Nút */}
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(false);
                  setAvatarFile(null);
                  setAvatarPreview(null);
                  setForm({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    address: user?.address || "",
                  });
                }}
                className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  await handleSubmit();
                  setEditing(false);
                }}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5] transition-colors disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi 🌸"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full py-3 rounded-2xl border-2 border-[#FFB7C5] text-[#FFB7C5] text-sm font-semibold hover:bg-[#FFF0F5] transition-colors"
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-5 border border-[#FFD6E0]/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#4A4A6A]/40">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-xs text-[#4A4A6A]/60">
                      {item.name} x{item.quantity}
                    </p>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#FFB7C5] text-right">
                  {order.total.toLocaleString()} VND
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl">📦</span>
              <p className="text-sm text-[#4A4A6A]/40 mt-3">
                Chưa có đơn hàng nào
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
