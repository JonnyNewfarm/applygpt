import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in London",
  description:
    "Looking for jobs in London? Use our AI-powered job tools to quickly find and apply to relevant roles in the UK capital.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in London with AI tools",
      },
    ],
  },
};

export default function LondonJobsPage() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">
          Find Jobs in London (2025 Guide)
        </h1>

        <p className="mb-4 text-lg">
          London is one of the busiest job markets in the world — from tech
          startups to global finance hubs. Whether you’re new to the city or a
          long-time Londoner, our platform helps you find roles that match your
          skills and interests.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Smarter Job Searching with AI
        </h2>
        <p className="mb-4">
          Use our tools to:
          <ul className="list-disc pl-6 mt-2">
            <li>Scan real-time job listings in London</li>
            <li>Automatically match your resume to roles</li>
            <li>Generate cover letters for each opportunity</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Ready to Work in the UK Capital?
        </h2>
        <p className="mb-4">
          Let our AI take the guesswork out of your London job search. You focus
          on the interviews — we’ll handle the prep.
        </p>

        <p className="mb-4">
          Visit your
          <Link
            href="/jobs"
            className="dark:text-stone-900 text-stone-100 underline ml-1"
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
            Start Finding Jobs in London
          </Link>
        </div>
      </div>
    </div>
  );
}
