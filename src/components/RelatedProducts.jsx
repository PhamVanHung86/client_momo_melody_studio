import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, currentId }) => {
  const { products } = useContext(ShopContext);

  // Lọc sản phẩm cùng category và bỏ qua sản phẩm đang xem
  const related = products
    .filter(
      (p) =>
        p.category?.toLowerCase() === category?.toLowerCase() &&
        p._id !== currentId,
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 border-t border-[#FFD6E0]/50 pt-12">
      {/* 🌟 Tiêu đề dễ thương */}
      <div className="text-center mb-8 flex flex-col items-center">
        <span className="text-[11px] font-bold text-[#FF85A1] bg-[#FFF0F5] px-3 py-1 rounded-full border border-[#FFD6E0] mb-2 tracking-wide uppercase">
          ✨ Gợi ý dành riêng cho bạn
        </span>
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl md:text-4xl font-bold text-[#4A4A6A]"
        >
          Có thể bạn sẽ thích 🌸
        </h2>
      </div>

      {/* 📦 Tái sử dụng ProductItem để thừa hưởng 100% hiệu ứng Hover & Animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            stock={item.stock}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
