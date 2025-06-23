import LiveCoverLetterDemo from "@/components/home/CoverletterDemo";
import FindJobSection from "@/components/home/FindJobSection";
import HeroSection from "@/components/home/HeroSection";
import GenerateResumeDemo from "@/components/home/ResumeDemo";
import SmoothScroll from "@/components/SmoothScroll";
import React from "react";

const Homepage = () => {
  return (
    <SmoothScroll>
      <div className="h-full  flex flex-col justify-center items-center  w-full">
        <HeroSection />
        <GenerateResumeDemo />
        <FindJobSection />
        <LiveCoverLetterDemo />
      </div>
    </SmoothScroll>
  );
};

export default Homepage;
