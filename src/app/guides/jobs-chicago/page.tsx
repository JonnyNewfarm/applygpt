import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in Chicago Using AI (2025 Guide)",
  description:
    "Discover how AI tools can streamline your job search in Chicago, matching you to relevant roles and creating custom cover letters.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in Chicago with AI tools.",
      },
    ],
  },
};

export default function FindJobsChicago() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">
          Find Jobs in Chicago (2025 Guide)
        </h1>

        <p className="mb-4 text-lg">
          Chicago offers a diverse job market, from finance and tech to
          manufacturing and healthcare. Whether you’re entering the workforce or
          seeking new opportunities, AI-powered tools can help you find the
          perfect role.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How AI Helps Your Chicago Job Hunt
        </h2>
        <p className="mb-4">
          Our platform allows you to:
          <ul className="list-disc pl-6 mt-2">
            <li>Find job openings across industries in Chicago</li>
            <li>Match your resume to specific job descriptions</li>
            <li>Generate tailored cover letters quickly</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Work Smarter, Not Harder
        </h2>
        <p className="mb-4">
          Stop spending hours on job boards. Let AI match your skills to
          relevant jobs and prepare your applications faster.
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
            Start Finding Jobs in Chicago
          </Link>
        </div>
      </div>
    </div>
  );
}
