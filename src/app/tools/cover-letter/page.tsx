import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator – Tailor Applications Instantly",
  description:
    "Generate professional cover letters in seconds using AI. Match your resume to any job and create customized, compelling applications fast.",
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

const CoverLetterLandingPage = () => {
  return (
    <main className="min-h-screen border-b-1 border-b-white/80 dark:border-b-black/80 bg-[#2b2a27] dark:bg-[#f5f4ef] text-[#f5f4ef] dark:text-[#2b2a27] px-6 sm:px-16 py-20 flex flex-col gap-y-20">
      {/* Intro Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            AI Cover Letter Generator
          </h1>
          <p className="text-lg sm:text-xl">
            Writing cover letters just got easier. Use AI to create tailored,
            professional cover letters that match your resume and job
            description – in seconds.
          </p>
          <Link
            href="/cover-letter/generator"
            className="inline-block bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27] px-6 py-3 rounded text-sm sm:text-lg font-semibold hover:scale-105 transition"
          >
            Start Writing Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-start gap-y-5 text-left">
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-5 items-center">
          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-semibold">What You Can Do</h2>
            <ul className="list-disc pl-5 text-lg space-y-2">
              <li>Generate cover letters based on your resume</li>
              <li>Paste any job description and tailor content instantly</li>
              <li>Choose tone: casual, professional, bold, and more</li>
              <li>Copy to clipboard or download as PDF</li>
              <li>Save and manage your generated letters</li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-4 ">
            <h2 className="text-2xl font-semibold">
              Why Use AI for Cover Letters?
            </h2>
            <ul className="list-disc pl-5 text-lg space-y-2">
              <li>No more writer&apos;s block</li>
              <li>Ensure every application sounds sharp and relevant</li>
              <li>Save time on repetitive writing</li>
              <li>Increase your chances of getting interviews</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto flex flex-col items-start text-left">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to Create Better Cover Letters?
        </h3>
        <p className="text-lg">
          Save time and make a better impression with every application. Let Job
          Scriptor&apos;raft cover letters that actually stand out.
        </p>
        <Link
          href="/cover-letter/generator"
          className="inline-block mt-6 px-6 py-3 bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27] rounded text-lg font-semibold hover:scale-105 transition"
        >
          Generate Your Letter
        </Link>
      </section>
    </main>
  );
};

export default CoverLetterLandingPage;
