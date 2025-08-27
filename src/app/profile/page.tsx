import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import ResumeForm from "../../components/ResumeForm";
import SubscriptionSection from "@/components/SubscriptionSection";
import SavedJobsClient from "@/components/SavedJobsClient";
import { Metadata } from "next";
import ProfileDetailsTab from "@/components/ProfileDetailsTab";

export const metadata: Metadata = {
  title: "Your Profile – Manage Resumes and Cover Letters",
  description:
    "View, update, and delete your saved resumes and cover letters. Easily manage your career documents in one place.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Job Scriptor",
      },
    ],
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  function capitalizeName(name: string): string {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  if (!session?.user?.email)
    return (
      <div className="flex bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] items-center justify-center min-h-screen font-semibold">
        Unauthorized
      </div>
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      resume: true,
      coverLetters: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user)
    return (
      <div className="flex items-center px-32 justify-center min-h-screen bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] font-semibold">
        User not found
      </div>
    );

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-b-white/80 border-b dark:border-b-black/80">
      <main className="w-[90%] mx-auto px-2 md:p-12 rounded-[3px] mb-10 mt-6">
        <section className="mb-8 flex   justify-between w-full">
          <div className="flex flex-col md:flex-row gap-x-56 justify-between">
            <div>
              <p className="mb-1 flex text-lg flex-col">
                <span className="font-semibold">Name:</span>{" "}
                {user.name ? capitalizeName(user.name) : "N/A"}
              </p>
            </div>
            <div>
              <p className="flex text-lg flex-col">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
          </div>
          <section className="">
            <ProfileDetailsTab
              buttonTitle={
                user.resume?.content ? "Edit Resume" : "Upload Resume"
              }
            >
              <ResumeForm resume={user.resume?.content || ""} />
            </ProfileDetailsTab>
          </section>
        </section>

        <SubscriptionSection user={user} />

        <section>
          <h1 className="text-2xl font-semibold">Saved Jobs</h1>
          <SavedJobsClient />
        </section>
      </main>
    </div>
  );
}
