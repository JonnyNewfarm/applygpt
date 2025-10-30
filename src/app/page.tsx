import HeroSection from "@/components/home/HeroSection";
import SmoothScroll from "@/components/SmoothScroll";

import { Metadata } from "next";
import React from "react";
import SectionGallery from "@/components/home/SectionLoader";
import ThreeResumeMobile from "@/components/home/ThreeResumeMobile";
import ThreeCoverLetterMobile from "@/components/home/ThreeCoverLetterMobile";
import FindJobsIntroMobile from "@/components/home/FindJobsIntroMobile";
import Link from "next/link";

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
      <main className="h-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b-white/10 border-b dark:border-b-black/80  flex flex-col justify-center items-center  w-full">
        <div className="sr-only">
          <h1>AI Career Tools – Create Resumes, Cover Letters & Find Jobs</h1>
          <p>
            Use AI to build your resume, write personalized cover letters, and
            find job opportunities faster. Job Scriptor gives you the tools to
            stand out and apply with confidence.
          </p>
        </div>
        <HeroSection />
        <div className="w-full min-h-screen hidden md:block">
          <SectionGallery />
        </div>
        <div className="w-full flex flex-col items-center justify-center min-h-screen md:hidden ">
          <div className="w-full relative min-h-[80vh] ">
            <h1 className="font-semibold text-xl absolute left-6 up">Resume</h1>
            <p className="absolute left-6 mt-6">Generate a resume with AI. </p>

            <ThreeResumeMobile />
            <Link
              className="absolute text-xl left-6 underline underline-offset-4 font-semibold uppercase bottom-12"
              href={"/resume-generator"}
            >
              Generate Resume
            </Link>
          </div>
          <div className="w-full relative min-h-[80vh] mt-6">
            <h1 className="font-semibold text-xl absolute left-6 up">
              Cover Letter
            </h1>
            <p className="absolute left-6 mt-6">
              Generate a Cover Letter with AI.{" "}
            </p>
            <ThreeCoverLetterMobile />
            <Link
              className="absolute text-xl underline underline-offset-4 left-6 font-semibold uppercase bottom-10"
              href={"/cover-letter"}
            >
              Generate cover letter
            </Link>
          </div>
          <div className="min-h-[80vh] w-full mt-6">
            <FindJobsIntroMobile />
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Homepage;
