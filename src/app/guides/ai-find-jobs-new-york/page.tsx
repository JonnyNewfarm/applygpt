// app/blog/ai-find-jobs-new-york/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in New York (2025 Guide)",
  description:
    "Looking for jobs in New York? Discover how AI tools can help you find relevant jobs faster and easier in 2025.",
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

export default function BlogPost() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12 ">
        <h1 className="text-4xl font-bold mb-6">
          Find Jobs in New York (2025 Guide)
        </h1>

        <p className="mb-4 text-lg">
          New York City is one of the most competitive job markets in the world.
          Whether you&apos;re a recent graduate, a seasoned professional, or
          switching careers, finding the right opportunity in NYC can be
          overwhelming.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Why Use AI for Your Job Search?
        </h2>
        <p className="mb-4">
          AI-powered tools can help you:
          <ul className="list-disc pl-6 mt-2">
            <li>Match your resume to real job descriptions</li>
            <li>Write tailored cover letters automatically</li>
            <li>Discover relevant job postings based on your profile</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          The Smart Way to Find NYC Jobs in 2025
        </h2>
        <p className="mb-4">
          Instead of searching through endless job boards, use our AI tools to
          instantly uncover jobs that fit your background — and prepare
          application materials in minutes.
        </p>

        <p className="mb-4">
          Just sign in and head to our
          <Link
            href="/jobs"
            className="dark:text-stone-900 text-stone-100 underline"
          >
            job search dashboard
          </Link>{" "}
          to get started.
        </p>

        <div className="mt-8">
          <Link
            href="/jobs"
            className="inline-block bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] px-6 py-3 text-lg font-semibold hover:scale-105 transition ease-in rounded"
          >
            Start Finding Jobs in New York
          </Link>
        </div>
      </div>
    </div>
  );
}
