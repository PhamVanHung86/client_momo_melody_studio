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

        {/* Khung chứa Flexbox đổi thứ tự hiển thị */}
        <div className="flex flex-col">
          <div className="order-1 md:order-2">
            <CategoryGrid />
          </div>
          <div className="order-2 md:order-1">
            <LatestCollection />
          </div>
        </div>

        <PromoBanner />
      </AnimatePage>
    </div>
  );
};

export default Home;
