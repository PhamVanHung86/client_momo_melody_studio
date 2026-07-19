import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import PromoBanner from "../components/PromoBanner";
import CategoryGrid from "../components/CategoryGrid";
import FlashSaleBanner from "../components/FlashSaleBanner";
import ComingSoonBanner from "../components/ComingSoonBanner";
import AnimatePage from "../components/AnimatePage";

const Home = () => {
  return (
    <div>
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
