import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Banner */}
      <div className="bg-[#FFD6E0] py-14 text-center px-4">
        <span className="text-5xl">🌸</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3"
        >
          Về chúng tôi
        </h1>
        <p className="text-sm text-[#4A4A6A]/70 mt-2">
          Câu chuyện đằng sau momo's melody studio
        </p>
      </div>

      {/* Nội dung chính */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-16">
        {/* Story section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="w-full md:w-1/2">
            <img
              src={assets.about_img}
              alt="About"
              className="w-full rounded-3xl object-cover shadow-sm"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <h2
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-3xl text-[#4A4A6A]"
            >
              Câu chuyện của momo 🩷
            </h2>
            <p className="text-sm text-[#4A4A6A]/70 leading-relaxed">
              momo's melody studio bắt đầu từ một góc nhỏ với đôi tay và trái
              tim yêu thích sáng tạo. Mỗi sản phẩm được làm thủ công tỉ mỉ, từng
              chiếc phone charm, keychain hay sticker đều mang theo một câu
              chuyện riêng.
            </p>
            <p className="text-sm text-[#4A4A6A]/70 leading-relaxed">
              Chúng mình tin rằng những món đồ nhỏ xinh có thể mang lại nụ cười
              và niềm vui trong cuộc sống hàng ngày. Đó là lý do tại sao mỗi sản
              phẩm đều được làm với tất cả tình yêu thương.
            </p>
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div className="text-center mb-10">
          <h2
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-3xl text-[#4A4A6A]"
          >
            Điều chúng mình trân trọng
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            {
              emoji: "🩷",
              bg: "bg-[#FFD6E0]",
              title: "Làm bằng tình yêu",
              desc: "Mỗi sản phẩm đều được làm thủ công tỉ mỉ, không có hai sản phẩm nào hoàn toàn giống nhau.",
            },
            {
              emoji: "✨",
              bg: "bg-[#FFF0A0]",
              title: "Chất lượng cao",
              desc: "Chúng mình chỉ dùng nguyên liệu tốt nhất để đảm bảo sản phẩm bền đẹp theo thời gian.",
            },
            {
              emoji: "🌸",
              bg: "bg-[#B8DEFF]",
              title: "Độc đáo & Sáng tạo",
              desc: "Mỗi thiết kế đều là một tác phẩm nghệ thuật độc đáo, thể hiện cá tính riêng.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`${item.bg} rounded-3xl p-8 flex flex-col items-center text-center gap-3`}
            >
              <span className="text-4xl">{item.emoji}</span>
              <h3 className="font-semibold text-[#4A4A6A]">{item.title}</h3>
              <p className="text-sm text-[#4A4A6A]/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
