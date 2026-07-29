import React from "react";
import SEO from "../components/SEO";
import CategoryPage from "../components/CatagoryPage";
const Pins = () => (
  <>
    <SEO
      title="Postcards"
      description="Bưu thiếp vẽ tay từ momo — gửi gắm yêu thương qua từng nét vẽ."
      url="/postcards"
    />
    <CategoryPage
      title="Pins"
      category="pins"
      emoji="🍀"
      description="Ghim cài áo độc đáo, thể hiện cá tính riêng của bạn."
    />
  </>
);

export default Pins;
