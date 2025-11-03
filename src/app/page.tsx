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
      <main className="bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b-white/10 border-b dark:border-b-black/80 flex flex-col w-full">
        {/* Hidden SEO header */}
        <div className="sr-only">
          <h1>AI Career Tools – Create Resumes, Cover Letters & Find Jobs</h1>
          <p>
            Use AI to build your resume, write personalized cover letters, and
            find job opportunities faster. Job Scriptor gives you the tools to
            stand out and apply with confidence.
          </p>
        </div>

        {/* Hero Section — make sure this has a natural layout height */}
        <section className="relative flex flex-col justify-center items-center min-h-[100dvh] w-full">
          <HeroSection />
        </section>

        {/* Desktop */}
        <section className="hidden md:block min-h-[100dvh] w-full">
          <SectionGallery />
        </section>

        {/* Mobile sections */}
        <section className="flex flex-col items-center justify-center md:hidden w-full">
          {/* Resume */}
          <div className="relative w-full flex flex-col justify-center items-center min-h-[100dvh] px-6">
            <div className="absolute top-8 left-6">
              <h1 className="font-semibold text-xl">Resume</h1>
              <p className="mt-2">Generate a resume with AI.</p>
            </div>

            <ThreeResumeMobile />

            <Link
              className="absolute text-xl whitespace-nowrap underline underline-offset-4 font-semibold uppercase bottom-10 left-1/2 -translate-x-1/2"
              href={"/resume-generator"}
            >
              Generate Resume
            </Link>
          </div>

          {/* Cover Letter */}
          <div className="relative w-full flex flex-col justify-center items-center min-h-[100dvh] px-6">
            <div className="absolute top-8 left-6">
              <h1 className="font-semibold text-xl">Cover Letter</h1>
              <p className="mt-2">Generate a Cover Letter with AI.</p>
            </div>

            <ThreeCoverLetterMobile />

            <Link
              className="absolute text-xl whitespace-nowrap underline underline-offset-4 font-semibold uppercase bottom-10 left-1/2 -translate-x-1/2"
              href={"/cover-letter"}
            >
              Generate Cover Letter
            </Link>
          </div>

          {/* Find Jobs */}
          <div className="relative w-full flex flex-col justify-center items-center min-h-[100dvh]">
            <FindJobsIntroMobile />
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
};

export default Homepage;
