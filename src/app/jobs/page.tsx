import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import BuyAccessButton from "@/components/BuyAccessButton";
import FindJobsClientWrapper from "@/components/FindJobsClientWrapper";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Job Search – Discover Jobs Near You or Remote Worldwide",
  description:
    "Find your next opportunity using our smart job search engine. Browse remote and local jobs filtered by city, country, or job title.",
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
};

export default async function FindJobsPage() {
  const session = await getServerSession();
  if (!session) {
    return (
      <main className="p-20 bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Find Jobs Near You or Remotely
        </h1>
        <p className="mb-6">
          Browse jobs filtered by job title, location, and resume match –
          powered by AI.
        </p>
        <p className="text-lg">
          Please sign in to access full job search features.
        </p>
        <div className="mt-4 flex items-center gap-x-4">
          <Link className="..." href={"/signin"}>
            Sign in
          </Link>
          <h1 className="text-sm">OR</h1>
          <Link className="..." href={"/register"}>
            Register
          </Link>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
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
      <div className="bg-[#2b2a27] font-semibold min-h-screen p-10 flex justify-center items-center  text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
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
    <main className="w-full min-h-screen bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b border-b-white/20 dark:border-b-black/20">
      <FindJobsClientWrapper />
    </main>
  );
}
