import LiveCoverLetterDemo from "@/components/home/CoverletterDemo";
import FindJobSection from "@/components/home/FindJobSection";
import HeroSection from "@/components/home/HeroSection";
import GenerateResumeDemo from "@/components/home/ResumeDemo";
import SmoothScroll from "@/components/SmoothScroll";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Resumes & Cover Letters, Find Jobs Instantly",
  description:
    "All-in-one AI tools to build resumes, write tailored cover letters, and discover job opportunities from top platforms like LinkedIn, Indeed, and more — fast.",
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Job Scriptor",
      },
    ],
  },
};

const Homepage = () => {
  return (
    <SmoothScroll>
      <div className="h-full border-b-white/50 border-b dark:border-b-black/80  flex flex-col justify-center items-center  w-full">
        <HeroSection />
        <GenerateResumeDemo />
        <FindJobSection />
        <LiveCoverLetterDemo />
      </div>
    </SmoothScroll>
  );
};

export default Homepage;
