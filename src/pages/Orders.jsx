import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

const statusColor = {
  "Đã xác nhận": "bg-[#C9A0FF] text-[#4A4A6A]",
  "Đang xử lý": "bg-[#FFD6E0] text-[#4A4A6A]",
  "Đang giao": "bg-[#FFF0A0] text-[#4A4A6A]",
  "Đã giao": "bg-[#B8DEFF] text-[#4A4A6A]",
  "Đã hủy": "bg-gray-100 text-gray-400",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/api/orders/my-orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">📦</span>
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-2xl text-[#4A4A6A]/60"
        >
          Chưa có đơn hàng nào...
        </p>
        <Link
          to="/"
          className="mt-2 bg-[#FFB7C5] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#ff9db5] transition-colors"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
      <h1
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-4xl text-[#4A4A6A] mb-10"
      >
        Đơn hàng của bạn 📦
      </h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#FFD6E0]/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#4A4A6A]/50 mb-1">Mã đơn hàng</p>
                <p className="text-sm font-semibold text-[#4A4A6A]">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#4A4A6A]/50 mb-1">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <hr className="border-[#FFD6E0] mb-4" />

            <div className="flex flex-col gap-2 mb-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm"
                >
                  <p className="text-[#4A4A6A]">
                    {item.name}
                    <span className="text-[#4A4A6A]/40 ml-2">
                      x{item.quantity}
                    </span>
                  </p>
                  <p className="text-[#FFB7C5] font-medium">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-[#FFD6E0] mb-4" />

            <div className="flex items-center justify-between">
              <p className="text-sm text-[#4A4A6A]/60">Tổng cộng</p>
              <p className="text-base font-semibold text-[#FFB7C5]">
                {order.total.toLocaleString()} VND
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
