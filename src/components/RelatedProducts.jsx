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

// import React, { useContext, useMemo } from "react";
// import { ShopContext } from "../context/ShopContext";
// import ProductItem from "./ProductItem";

// // Mail Club là gói đăng ký hàng tháng, không phải sản phẩm mua lẻ như
// // postcard/keychain/phone charm/pins/sticker — không phù hợp để gợi ý
// // chung ở đây nên luôn loại trừ.
// const EXCLUDED_CATEGORY = "mail-club";

// // Xáo trộn ngẫu nhiên (Fisher–Yates) — tránh tình trạng luôn hiện đúng 4
// // sản phẩm giống hệt nhau mỗi lần vào lại trang.
// const shuffle = (arr) => {
//   const result = [...arr];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// };

// const RelatedProducts = ({ category, currentId }) => {
//   const { products } = useContext(ShopContext);

//   // Mỗi sản phẩm gợi ý lấy từ 1 CATEGORY KHÁC NHAU (VD: 1 pins, 1 phone
//   // charm, 1 keychain, 1 postcard...) thay vì ưu tiên cùng category —
//   // giúp danh sách gợi ý đa dạng, không bị dồn hết vào 1 loại sản phẩm.
//   const related = useMemo(() => {
//     const pool = products.filter(
//       (p) =>
//         p._id !== currentId &&
//         p.category?.toLowerCase() !== EXCLUDED_CATEGORY,
//     );

//     // Gom sản phẩm theo category
//     const byCategory = {};
//     for (const p of pool) {
//       const key = p.category?.toLowerCase() || "khac";
//       if (!byCategory[key]) byCategory[key] = [];
//       byCategory[key].push(p);
//     }

//     // Xáo trộn thứ tự category, rồi mỗi category lấy ngẫu nhiên 1 sản phẩm
//     const categoryKeys = shuffle(Object.keys(byCategory));
//     const picked = [];
//     const pickedIds = new Set();

//     for (const key of categoryKeys) {
//       if (picked.length >= 4) break;
//       const options = shuffle(byCategory[key]);
//       const chosen = options[0];
//       if (chosen) {
//         picked.push(chosen);
//         pickedIds.add(chosen._id);
//       }
//     }

//     // Nếu chưa đủ 4 (VD: shop chỉ có 2-3 category), lấy thêm ngẫu nhiên từ
//     // phần còn lại để lấp đầy
//     if (picked.length < 4) {
//       const remaining = shuffle(pool.filter((p) => !pickedIds.has(p._id)));
//       for (const p of remaining) {
//         if (picked.length >= 4) break;
//         picked.push(p);
//       }
//     }

//     return picked;
//   }, [products, category, currentId]);

//   if (related.length === 0) return null;

//   return (
//     <section className="mt-20 border-t border-[#FFD6E0]/50 pt-12">
//       {/* 🌟 Tiêu đề dễ thương */}
//       <div className="text-center mb-8 flex flex-col items-center">
//         <span className="text-[11px] font-bold text-[#FF85A1] bg-[#FFF0F5] px-3 py-1 rounded-full border border-[#FFD6E0] mb-2 tracking-wide uppercase">
//           ✨ Gợi ý dành riêng cho bạn
//         </span>
//         <h2
//           style={{ fontFamily: "'Dancing Script', cursive" }}
//           className="text-3xl md:text-4xl font-bold text-[#4A4A6A]"
//         >
//           Có thể bạn sẽ thích 🌸
//         </h2>
//       </div>

//       {/* 📦 Tái sử dụng ProductItem để thừa hưởng 100% hiệu ứng Hover & Animation */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//         {related.map((item) => (
//           <ProductItem
//             key={item._id}
//             id={item._id}
//             image={item.image}
//             name={item.name}
//             price={item.price}
//             stock={item.stock}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default RelatedProducts;
