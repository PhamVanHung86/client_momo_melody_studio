import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { ProductGridSkeleton } from "./ProductSkeleton";

const CategoryPage = ({ title, category, emoji, description }) => {
  const { products, loadingProducts } = useContext(ShopContext);

  const filtered = products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase(),
  );

  return (
    <div className="bg-[#FFFAF5]">
      {/* Banner đầu trang */}
      <div className="bg-pastel-blue-light py-14 text-center px-4">
        <span className="text-5xl">{emoji}</span>
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-4xl md:text-5xl text-[#4A4A6A] mt-3"
        >
          {title}
        </h1>
        <p className="text-sm text-[#4A4A6A]/70 mt-2 max-w-md mx-auto">
          {description}
        </p>
      </div>

      {/* Grid sản phẩm */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
        {loadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {filtered.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                stock={item.stock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-5xl spin-slow">🌸</span>
            <p
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-2xl text-[#4A4A6A]/60 mt-4"
            >
              Sản phẩm đang được chuẩn bị...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
