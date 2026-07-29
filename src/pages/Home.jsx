import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import PromoBanner from "../components/PromoBanner";
import CategoryGrid from "../components/CategoryGrid";
import FlashSaleBanner from "../components/FlashSaleBanner";
import ComingSoonBanner from "../components/ComingSoonBanner";
import AnimatePage from "../components/AnimatePage";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <div>
      <SEO
        title="Trang chủ"
        description="momo's melody studio — Những món đồ handmade nhỏ xinh làm thủ công tỉ mỉ với tất cả tình yêu thương."
        url="/"
      />
      <AnimatePage>
        <Hero />
        <ComingSoonBanner />
        <FlashSaleBanner />
        <LatestCollection />
        <CategoryGrid />
        <PromoBanner />
      </AnimatePage>
    </div>
  );
};

export default Home;
