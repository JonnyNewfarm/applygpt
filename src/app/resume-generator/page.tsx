import BuyAccessButton from "@/components/BuyAccessButton";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Metadata } from "next";
import ResumeClientWrapper from "@/components/ClientWrapper";
export const metadata: Metadata = {
  title: "AI Resume Generator – Build Your Resume in Seconds",
  description:
    "Create a professional resume with AI. Just enter your experience, and get a downloadable, customizable CV optimized for your next job.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Jobscriptor",
      },
    ],
  },
};

export default async function CoverLetterPage() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="  p-10 md:p-20 mx-auto min-h-screen bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
        <h1 className="text-2xl  font-bold leading-tight">
          Create a Professional Resume in Seconds
        </h1>
        <p className="text-lg mt-1 sm:text-lg text-muted-foreground max-w-2xl">
          Build a standout resume with AI. Customize it to your skills,
          experience, and the job you&apos;re targeting.
        </p>
        <p className="text-md mt-3 sm:text-lg font-medium">
          Please sign in to access the resume generator:
        </p>
        <div className="mt-4 flex items-center gap-x-4">
          <Link
            className="mt-2 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
            href={"/signin"}
          >
            Sign in
          </Link>
          <h1 className="text-sm">OR</h1>
          <Link
            className="mt-2 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
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

  const hasResume = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      resume: true,
      coverLetters: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    return (
      <div className="bg-[#2b2a27] min-h-screen text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
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
      <div className="bg-[#2b2a27] font-semibold min-h-screen p-10 flex justify-center items-center text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
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
    <div className="w-full min-h-screen flex-col flex justify-center items-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b border-b-white/20 dark:border-b-black/20">
      <ResumeClientWrapper resume={hasResume?.resume?.content || ""} />
    </div>
  );
}
