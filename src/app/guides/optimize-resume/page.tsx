import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Optimize Your Resume with AI",
  description:
    "Level up your resume using our intelligent tools. Improve formatting, keyword targeting, and job-specific customization in minutes.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Optimize Your Resume with AI Tools",
      },
    ],
  },
};

export default function OptimizeResumePage() {
  return (
    <div className="bg-[#2b2a27] w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">
          Optimize Your Resume with AI
        </h1>

        <p className="mb-4 text-lg">
          Your resume is your first impression. Our AI-powered tools help you
          refine, target, and polish it for real-world job descriptions — all in
          seconds.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Why Optimize Your Resume?
        </h2>
        <p className="mb-4">
          Recruiters scan resumes in seconds. With AI, you can:
          <ul className="list-disc pl-6 mt-2">
            <li>Improve formatting and readability</li>
            <li>Insert relevant keywords to beat ATS filters</li>
            <li>Tailor your resume to each job post</li>
          </ul>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Built for Every Profession
        </h2>
        <p className="mb-4">
          Whether you&apos;re in tech, healthcare, logistics, or sales — we help
          your experience stand out.
        </p>

        <p className="mb-4">
          Go to your
          <Link
            href="/resume-generator"
            className="dark:text-stone-900 text-stone-100 underline ml-1"
          >
            resume dashboard
          </Link>{" "}
          to try it now.
        </p>

        <div className="mt-8">
          <Link
            href="/resume-generator"
            className="inline-block bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] px-6 py-3 text-lg font-semibold hover:scale-105 transition ease-in rounded"
          >
            Optimize My Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
