import React from "react";
import SEO from "../components/SEO";
import CategoryPage from "../components/CatagoryPage";

const Stickers = () => (
  <>
    <SEO
      title="Stickers"
      description="Sticker cute đủ mọi chủ đề — dán lên laptop, sổ tay hay bất cứ đâu bạn thích."
      url="/stickers"
    />
    <CategoryPage
      title="Stickers"
      category="stickers"
      emoji="🌼"
      description="Sticker cute đủ mọi chủ đề — dán lên laptop, sổ tay, hay bất cứ đâu bạn thích."
    />
  </>
);

export default Stickers;
