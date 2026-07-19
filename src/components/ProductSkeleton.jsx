import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-[#FFD6E0]/40" />
      <div className="mt-3 px-1 flex flex-col gap-2">
        <div className="h-3 bg-[#FFD6E0]/40 rounded-full w-3/4" />
        <div className="h-3 bg-[#FFD6E0]/40 rounded-full w-1/2 ml-auto" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
