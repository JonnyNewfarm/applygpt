import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Generator – Build Your Resume Instantly.",
  description:
    "Use our free AI-powered resume builder to craft professional resumes tailored to your skills and job goals. Export to PDF in seconds.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in New York with AI tools.",
      },
    ],
  },
};

const ResumeGeneratorLandingPage = () => {
  return (
    <main className="min-h-screen border-b-white/80 dark:border-b-black/80 border-b-1 bg-[#2b2a27] dark:bg-[#f5f4ef] text-[#f5f4ef] dark:text-[#2b2a27] px-6 sm:px-16 py-20 flex flex-col gap-y-14">
      <section className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          AI Resume Generator
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl">
          Create job-ready resumes in seconds. Our AI helps you write bullet
          points, format your layout, and export to PDF — no design skills
          required.
        </p>
        <Link
          href="/resume-generator"
          className="bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27] px-6 py-3 mt-4 rounded text-sm sm:text-lg font-semibold hover:scale-105 transition"
        >
          Start Generating Your Resume
        </Link>
      </section>

      <section className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-lg space-y-2">
            <li>AI-powered bullet points & summaries</li>
            <li>Job-specific tailoring</li>
            <li>Professional templates</li>
            <li>Export to PDF</li>
            <li>Edit anytime from your profile</li>
          </ul>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
        <h3 className="text-2xl font-semibold mb-4">Why use Job Scriptor?</h3>
        <p className="text-lg">
          Job Scriptor lets you create, customize, and save resumes with AI.
          Spend less time formatting and more time landing interviews.
        </p>
        <Link
          href="/resume-generator"
          className="inline-block mt-6 px-6 py-3 bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27]  rounded text-lg font-semibold hover:scale-105 transition"
        >
          Try It Now
        </Link>
      </section>
    </main>
  );
};

export default ResumeGeneratorLandingPage;
