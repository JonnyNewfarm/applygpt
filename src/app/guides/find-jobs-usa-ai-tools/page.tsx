import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in the USA Using AI Tools (2025 Guide)",
  description:
    "Searching for jobs in the USA? Discover how AI-powered tools can help you apply faster with better resumes, cover letters, and job matches.",
  keywords: [
    "find jobs in USA",
    "AI job search",
    "AI resume tools",
    "cover letter generator",
    "remote jobs USA",
    "job hunting 2025",
  ],
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in New York with AI tools.",
      },
    ],
  },
};

export default function FindJobsUSA() {
  return (
    <div className="px-6 py-12 bg-[#2b2a27] w-full flex justify-center text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">
          Find Jobs in the USA Using AI Tools
        </h1>

        <p className="mb-4 text-lg">
          Looking for jobs across the United States in 2025? Whether you’re
          targeting tech roles, healthcare, logistics, or customer service, AI
          tools can help you streamline the entire job search process.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Use AI to Instantly Tailor Resumes
        </h2>
        <p className="mb-4">
          Instead of manually rewriting your resume for every role, use our AI
          resume builder to customize it for each U.S. job you apply to — in
          seconds.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Write Better Cover Letters in Less Time
        </h2>
        <p className="mb-4">
          Our AI cover letter tool helps you write job-specific letters that
          stand out, without starting from scratch.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Filter Jobs by State, Industry, or Remote
        </h2>
        <p className="mb-4">
          Whether you&apos;re applying in California, Texas, Florida, or remote,
          our search filters help you narrow results by location, company, and
          role type.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          One Dashboard for All Your Job Tools
        </h2>
        <p className="mb-4">
          Create, manage, and send your resume and cover letters — all from your
          Job Scriptor dashboard.
        </p>

        <div className="mt-6 mb-4">
          <p>
            Ready to start your job hunt across the USA?
            <Link
              href="/jobs"
              className="dark:text-stone-900 text-stone-100 underline ml-1"
            >
              Sign in to find jobs
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/jobs"
            className="inline-block bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] px-6 py-3 text-lg font-semibold hover:scale-105 transition ease-in rounded"
          >
            Find U.S. Jobs with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
