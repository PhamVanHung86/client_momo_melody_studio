import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ProductGridSkeleton } from "./ProductSkeleton";

const LatestCollection = () => {
  const { products, loadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const sorted = [...products].sort((a, b) => b.date - a.date);
    setLatestProducts(sorted.slice(0, 8));
  }, [products]);

  return (
    <div className="sm:my-16 my-0 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Tiêu đề */}
      <div className="text-center py-8">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#4A4A6A]/60 mt-3 leading-relaxed">
          Những món handmade mới nhất vừa ra lò — phone charms, keychain,
          stickers và nhiều hơn nữa, tất cả được làm thủ công tỉ mỉ với tất cả
          tình yêu thương 🩷
        </p>
      </div>

      {/* Grid sản phẩm */}
      {loadingProducts ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
          {latestProducts.map((item) => (
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
      )}

      {/* Nút xem thêm */}
      <div className="text-center mt-12">
        <Link
          to="/collection"
          className="inline-block bg-[#b8deff] text-white px-10 py-3 rounded-full text-sm font-semibold hover:bg-[#ff9db5] active:scale-95 transition-all duration-300 shadow-sm"
        >
          Xem tất cả sản phẩm 🛍️
        </Link>
      </div>
    </div>
  );
};

export default LatestCollection;
