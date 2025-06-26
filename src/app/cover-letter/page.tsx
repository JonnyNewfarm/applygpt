import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import BuyAccessButton from "@/components/BuyAccessButton";
import CoverLetterClient from "@/components/CoverLetterClient";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Cover Letter Generator – Personalized Letters Instantly",
  description:
    "Generate personalized, job-specific cover letters in seconds using AI. Save, edit, and download your letters with ease.",
};

export default async function CoverLetterPage() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div className="bg-[#2b2a27] p-20 min-h-screen text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
        <p>Please sign in to access the cover letter generator.</p>
        <div className="mt-4 flex items-center gap-x-4">
          <Link
            className="mt-2 border dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
            href={"/signin"}
          >
            Sign in
          </Link>
          <h1 className="text-sm">OR</h1>
          <Link
            className="mt-2 border dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
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
      <div className="p-20 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
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
      <div className="bg-[#2b2a27]  font-semibold min-h-screen p-10 flex justify-center items-center  text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
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
    <div className="w-full min-h-screen bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27] border-b border-b-white/20 dark:border-b-black/20">
      <CoverLetterClient />
    </div>
  );
}
