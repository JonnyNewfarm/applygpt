import FindJobSection from "@/components/home/FindJobSection";
import GenerateClSection from "@/components/home/GenerateClSection";
import HeroSection from "@/components/home/HeroSection";
import SmoothScroll from "@/components/SmoothScroll";
import React from "react";

const Homepage = () => {
  return (
    <SmoothScroll>
      <div className="h-full flex flex-col justify-center items-center bg-light w-full">
        <HeroSection />
        <FindJobSection />
        <GenerateClSection />
      </div>
    </SmoothScroll>
  );
};

export default Homepage;
