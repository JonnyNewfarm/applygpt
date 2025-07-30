// app/guides/find-remote-jobs-using-ai/page.tsx
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "5 Smart Ways to Find Remote Jobs Using AI Tools (2025)",
  description:
    "Learn how to find remote jobs more efficiently with AI-powered job search tools. Skip the manual search and land your dream remote job faster.",
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Find remote job with AI tools.",
      },
    ],
  },
};

export default function RemoteJobsGuide() {
  return (
    <div className="bg-[#2b2a27] w-full flex justify-center text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">
          5 Smart Ways to Find Remote Jobs Using AI Tools (2025)
        </h1>

        <p className="mb-4 text-lg">
          The remote job market is growing faster than ever. With competition
          rising, you need smarter tools to stand out — and AI is the secret
          weapon you didn’t know you needed.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          1. Let AI Match You with Relevant Remote Jobs
        </h2>
        <p className="mb-4">
          Instead of browsing endless job boards, use AI tools that understand
          your skills and preferences and surface roles that actually fit.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          2. Generate Tailored Resumes Instantly
        </h2>
        <p className="mb-4">
          Tweak your resume for every remote position without the manual effort.
          Our resume generator creates optimized versions in seconds.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Use AI to Write Cover Letters that Stand Out
        </h2>
        <p className="mb-4">
          Skip generic templates. Use our AI to create personalized,
          human-sounding cover letters tailored to each job.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Filter by Fully Remote Roles Only
        </h2>
        <p className="mb-4">
          Our job search engine lets you instantly filter jobs to only show
          remote opportunities — no more sorting manually.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          5. Centralize Everything in One Dashboard
        </h2>
        <p className="mb-4">
          Manage your resume, cover letters, and job applications all in one
          place. No spreadsheets or copy-pasting required.
        </p>

        <p className="mt-6 mb-4">
          Ready to streamline your remote job search?
          <Link
            href="/jobs"
            className="text-stone-200 dark:text-stone-900 underline ml-1"
          >
            Sign in and start now
          </Link>
        </p>

        <div className="mt-8">
          <Link
            href="/jobs"
            className="inline-block bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] px-6 py-3 text-lg font-semibold hover:scale-105 transition ease-in rounded"
          >
            Find Remote Jobs with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
