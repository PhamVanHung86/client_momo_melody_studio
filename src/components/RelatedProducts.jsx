import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const RelatedProducts = ({ category, currentId }) => {
  const { products, currency } = useContext(ShopContext);

  const related = products
    .filter((p) => p.category === category && p._id !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <h2
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl text-[#4A4A6A]"
        >
          Có thể bạn sẽ thích
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {related.map((item) => (
          <a
            key={item._id}
            href={`/product/${item._id}`}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-2xl bg-[#FFF0F5] aspect-[3/4]">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-3 px-1">
              <p className="text-sm text-[#4A4A6A] truncate">{item.name}</p>
              <p className="text-sm font-semibold text-[#FFB7C5] text-right mt-1">
                {item.price.toLocaleString()} {currency}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
