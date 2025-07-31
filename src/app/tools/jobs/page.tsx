import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Job Search – Find Jobs Fast with Smart Filter.",
  description:
    "You can search jobs in your location from top providers like LinkedIn and Indeed. Match them to your resume with AI, and generate AI-powered cover letters easily.",
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

const FindJobsLandingPage = () => {
  return (
    <main className="min-h-screen bg-[#2b2a27] border-white/80 dark:border-black/80 border-b-1 dark:bg-[#f5f4ef] text-[#f5f4ef] dark:text-[#2b2a27] px-6 sm:px-16 py-20 flex flex-col gap-y-20">
      {/* Intro Section */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            AI Job Search
          </h1>
          <p className="text-lg sm:text-xl">
            Search jobs in your location from top providers like LinkedIn and
            Indeed. Match jobs to your resume using AI, and instantly generate
            personalized AI-powered cover letters to streamline your
            applications.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27] px-6 py-3 rounded text-sm sm:text-lg font-semibold hover:scale-105 transition"
          >
            Start Finding Jobs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-lg space-y-2">
            <li>Search jobs by location, keyword, and provider</li>
            <li>See real-time listings from LinkedIn, Indeed, and more</li>
            <li>AI matches jobs to your resume profile</li>
            <li>Generate tailored cover letters for each job</li>
            <li>Save and manage your favorite roles</li>
          </ul>
        </div>
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-semibold">How It Helps You</h2>
          <ul className="list-disc pl-5 text-lg space-y-2">
            <li>Apply faster with everything in one place</li>
            <li>Stand out with AI-personalized applications</li>
            <li>Save time by skipping repetitive writing</li>
            <li>Keep your job search organized and focused</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto text-left">
        <h3 className="text-2xl font-semibold mb-4">
          Start Finding Better Jobs Today
        </h3>
        <p className="text-lg">
          Use Job Scriptor&apos;s AI-powered job search to discover great roles,
          tailor your applications, and apply with confidence.
        </p>
        <Link
          href="/jobs"
          className="inline-block mt-6 px-6 py-3 bg-[#f5f4ef] dark:bg-[#2b2a27] dark:text-[#f5f4ef] text-[#2b2a27] rounded text-lg font-semibold hover:scale-105 transition"
        >
          Find Jobs Now
        </Link>
      </section>
    </main>
  );
};

export default FindJobsLandingPage;
