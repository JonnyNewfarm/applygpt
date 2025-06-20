// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import ResumeForm from "../../components/ResumeForm";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        Unauthorized
      </div>
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      resume: true,
    },
  });

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        User not found
      </div>
    );

  return (
    <main className="max-w-4xl bg-white/90 border-stone-400 border  mx-auto p-6 md:p-12  rounded-[3px] mb-10  mt-12">
      <h1 className="text-3xl font-semibold mb-6 border-b-[1px] border-b-black/30 pb-2">
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

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Resume</h2>
        <ResumeForm resume={user.resume?.content || ""} />
      </section>
    </main>
  );
}
