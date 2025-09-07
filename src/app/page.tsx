import ResumeExampleSection from "@/components/home/Examples";
import CoverLetterExampleSection from "@/components/home/ExamplesCoverLetter";
import JobsExampleSection from "@/components/home/ExamplesJobs";
import HeroSection from "@/components/home/HeroSection";
import SmoothScrollCards from "@/components/home/SmoothScrollCards";
import SmoothScroll from "@/components/SmoothScroll";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Resumes & Cover Letters, Find Jobs Instantly",
  description:
    "All-in-one AI tools to build resumes, write tailored cover letters, and discover job opportunities from top platforms like LinkedIn, Indeed, and more — fast.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Job Scriptor",
      },
    ],
  },
  alternates: {
    canonical: "https://www.jobscriptor.com/",
  },
};

const Homepage = () => {
  return (
    <SmoothScroll>
      <main className="h-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b-white/50 border-b dark:border-b-black/80  flex flex-col justify-center items-center  w-full">
        <div className="sr-only">
          <h1>AI Career Tools – Create Resumes, Cover Letters & Find Jobs</h1>
          <p>
            Use AI to build your resume, write personalized cover letters, and
            find job opportunities faster. Job Scriptor gives you the tools to
            stand out and apply with confidence.
          </p>
        </div>
        <HeroSection />

        <SmoothScrollCards />

        <div className="space-y-5 w-full bg-[#2b2a27] text-[#f5f4ef]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
          <ResumeExampleSection />
          <JobsExampleSection />
          <CoverLetterExampleSection />
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Homepage;
