import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs Effortlessly",
  description:
    "Use our AI-powered tools to find the perfect job for you — faster, smarter, and more tailored to your goals.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs with AI Tools",
      },
    ],
  },
};

export default function FindJobsPage() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Find Jobs Smarter in 2025</h1>

        <p className="mb-4 text-lg">
          Job hunting is evolving. Whether you&apos;re entering the workforce or
          making a career change, you deserve a better way to find opportunities
          that actually fit you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          AI Can Help You Find the Right Job
        </h2>
        <p className="mb-4">
          Here’s how our tools make job searching easier:
          <ul className="list-disc pl-6 mt-2">
            <li>Instantly match your resume to job openings</li>
            <li>Auto-generate custom cover letters for each role</li>
            <li>Discover jobs based on your skills and goals</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Get Started Today</h2>
        <p className="mb-4">
          Skip the stress of endless searching. Use our tools to focus on what
          matters: landing your next role.
        </p>

        <p className="mb-4">
          Sign in and go to your
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
            Start Finding Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
