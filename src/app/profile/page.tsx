import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import ResumeForm from "../../components/ResumeForm";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import CoverLetterList from "../../components/CoverLetterList";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return (
      <div className="flex bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27] items-center justify-center min-h-screen font-semibold">
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
      <div className="flex items-center px-32 justify-center min-h-screen bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27] font-semibold">
        User not found
      </div>
    );

  const serializedCoverLetters = user.coverLetters.map((cl) => ({
    ...cl,
    createdAt: cl.createdAt.toISOString(),
  }));

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <main className="w-[90%]  mx-auto p-6 md:p-12 rounded-[3px] mb-10 mt-12">
        <h1 className="text-3xl font-semibold mb-6 border-b-[1px] border-[#f6f4ed] dark:border-[#2b2a27] pb-2">
          Profile
        </h1>

        <section className="mb-8">
          <p className="text-lg mb-1">
            <span className="font-semibold">Name:</span> {user.name || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <ManageSubscriptionButton />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Resume</h2>
          <ResumeForm resume={user.resume?.content || ""} />
        </section>

        {user.coverLetters.length > 0 && (
          <CoverLetterList initialCoverLetters={serializedCoverLetters} />
        )}
      </main>
    </div>
  );
}
