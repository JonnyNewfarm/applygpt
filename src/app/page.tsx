import LiveCoverLetterDemo from "@/components/home/CoverletterDemo";
import FindJobSection from "@/components/home/FindJobSection";
import HeroSection from "@/components/home/HeroSection";
import GenerateResumeDemo from "@/components/home/ResumeDemo";
import SmoothScroll from "@/components/SmoothScroll";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title:
    "AI Career Tools – Create Resumes, Cover Letters & Find Jobs Instantly",
  description:
    "Boost your job hunt with our AI-powered tools. Instantly generate tailored resumes and cover letters, and search for jobs worldwide in one place.",
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Jobscriptor",
      },
    ],
  },
};

const Homepage = () => {
  return (
    <SmoothScroll>
      <div className="h-full   flex flex-col justify-center items-center  w-full">
        <HeroSection />
        <GenerateResumeDemo />
        <FindJobSection />
        <LiveCoverLetterDemo />
      </div>
    </SmoothScroll>
  );
};

export default Homepage;
