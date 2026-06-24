import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, stock }) => {
  const { currency, getProductPrice } = useContext(ShopContext);
  const isOutOfStock = stock === 0;

  const salePrice = getProductPrice(id);
  const isOnSale = salePrice < price;

  return (
    <Link to={`/product/${id}`} className="group cursor-pointer relative">
      <div className="overflow-hidden rounded-2xl bg-[#FFF0F5] relative aspect-[3/4]">
        <img
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out ${
            isOutOfStock ? "opacity-50 grayscale" : ""
          }`}
          src={image[0]}
          alt={name}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-[#4A4A6A] text-white text-xs font-medium px-4 py-1.5 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
        {isOnSale && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#FF6B81] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Sale 🔥
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        <p className="text-sm text-[#4A4A6A] truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-semibold text-[#FFB7C5] text-right">
            {salePrice.toLocaleString()} {currency}
          </p>
          {isOnSale && (
            <p className="text-xs text-[#4A4A6A]/40 line-through">
              {price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
