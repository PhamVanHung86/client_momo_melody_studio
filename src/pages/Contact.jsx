import React, { useState } from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Banner */}
      <div className="bg-[#B8DEFF] py-14 text-center px-4">
        <span className="text-5xl">✉️</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3"
        >
          Liên hệ
        </h1>
        <p className="text-sm text-[#4A4A6A]/70 mt-2">
          Chúng mình luôn sẵn sàng lắng nghe bạn 🩷
        </p>
      </div>

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Thông tin liên hệ */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <img
              src={assets.contact_img}
              alt="Contact"
              className="w-full rounded-3xl object-cover shadow-sm"
            />

            <div className="flex flex-col gap-4">
              {[
                {
                  emoji: "📍",
                  bg: "bg-[#FFD6E0]",
                  title: "Địa chỉ",
                  desc: "Hồ Chí Minh, Việt Nam",
                },
                {
                  emoji: "📱",
                  bg: "bg-[#FFF0A0]",
                  title: "Zalo / Phone",
                  desc: "0901 234 567",
                },
                {
                  emoji: "📸",
                  bg: "bg-[#B8DEFF]",
                  title: "Instagram",
                  desc: "@momos.melody.studio",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div
                    className={`${item.bg} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <p className="text-xs text-[#4A4A6A]/50">{item.title}</p>
                    <p className="text-sm font-medium text-[#4A4A6A]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFD6E0]/50">
              <h2
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-3xl text-[#4A4A6A] mb-6"
              >
                Gửi tin nhắn cho momo 🌸
              </h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <span className="text-5xl">🎀</span>
                  <p
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                    className="text-2xl text-[#4A4A6A]"
                  >
                    Cảm ơn bạn đã nhắn tin!
                  </p>
                  <p className="text-xs text-[#4A4A6A]/50">
                    Chúng mình sẽ phản hồi sớm nhất có thể 🩷
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Họ và tên
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="momo@example.com"
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Tin nhắn
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Bạn muốn hỏi gì, đặt hàng custom, hay chỉ muốn nói hi? 🌸"
                      rows={5}
                      className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] transition-colors bg-[#FFFAF5] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message}
                    className="mt-2 w-full bg-[#B8DEFF] text-[#4A4A6A] py-3 rounded-2xl text-sm font-semibold hover:bg-[#9ed0ff] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Gửi tin nhắn ✉️
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
