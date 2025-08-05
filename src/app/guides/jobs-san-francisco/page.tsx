import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in San Francisco Using AI (2025 Guide)",
  description:
    "Explore how to land your next job in San Francisco using AI tools that match your resume, write cover letters, and surface relevant roles fast.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in San Francisco with AI tools.",
      },
    ],
  },
};

export default function FindJobsSanFrancisco() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">
          Find Jobs in San Francisco (2025 Guide)
        </h1>

        <p className="mb-4 text-lg">
          San Francisco is a global tech hub — but also home to roles in design,
          finance, logistics, and health. Whether you&apos;re in startups or
          enterprise, our platform can help you land a role that matches your
          skills.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Use AI to Find Your Next Role in SF
        </h2>
        <p className="mb-4">
          Our tools help you:
          <ul className="list-disc pl-6 mt-2">
            <li>Discover new jobs across the Bay Area</li>
            <li>Match your resume to specific job listings</li>
            <li>Generate tailored cover letters in seconds</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Skip the Job Board Overload
        </h2>
        <p className="mb-4">
          You don’t need to search through endless listings. Let our AI match
          you to the jobs that actually fit — in San Francisco or beyond.
        </p>

        <p className="mb-4">
          Head to your
          <Link
            href="/jobs"
            className="dark:text-stone-900 text-stone-100 underline ml-1"
          >
            job search dashboard
          </Link>{" "}
          to begin.
        </p>

        <div className="mt-8">
          <Link
            href="/jobs"
            className="inline-block bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] px-6 py-3 text-lg font-semibold hover:scale-105 transition ease-in rounded"
          >
            Start Finding Jobs in San Francisco
          </Link>
        </div>
      </div>
    </div>
  );
}
