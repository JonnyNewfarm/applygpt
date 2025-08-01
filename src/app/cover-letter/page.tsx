import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import BuyAccessButton from "@/components/BuyAccessButton";
import CoverLetterClientWrapper from "@/components/CoverLetterClientWrapper";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Cover Letter Generator – Personalized Letters Instantly",
  description:
    "Generate personalized, job-specific cover letters in seconds using AI. Save, edit, and download your letters with ease.",
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Jobscriptor",
      },
    ],
  },
  other: {
    keywords:
      "AI cover letter generator, create cover letter with AI, personalized job application, cover letter tool, jobscriptor AI",
  },
};

export default async function CoverLetterPage() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div className="bg-[#2b2a27] p-10 md:p-20 min-h-screen text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
        <h1 className="text-2xl font-bold leading-tight">
          Generate Tailored Cover Letters with AI
        </h1>
        <p className="text-lg  mt-1 text-muted-foreground max-w-2xl">
          Create personalized, job-specific cover letters that align with your
          resume and the job you&apos;re applying for.
        </p>
        <p className="text-md mt-4 sm:text-lg font-medium">
          Please sign in to access the cover letter generator:
        </p>
        <div className="mt-1 flex items-center gap-x-4">
          <Link
            className="mt-2 border-2 font-bold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
            href={"/signin"}
          >
            Sign in
          </Link>
          <h1 className="text-sm">OR</h1>
          <Link
            className="mt-2 border-2 font-bold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
            href={"/register"}
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    return (
      <div className="p-20 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
        <p>User not found.</p>
      </div>
    );
  }

  const canGenerate =
    user.hasPaid ||
    (user.generationLimit !== null &&
      user.generationCount < user.generationLimit);

  if (!canGenerate) {
    return (
      <div className="bg-[#2b2a27]  font-semibold min-h-screen p-10 flex justify-center items-center  text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
        <div>
          <p className="text-xl mb-4">
            You&apos;ve reached your monthly generation limit on the free plan.
            Upgrade to continue.
          </p>
          <BuyAccessButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b border-b-white/20 dark:border-b-black/20">
      <CoverLetterClientWrapper />
    </div>
  );
}
