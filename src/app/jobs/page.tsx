import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import BuyAccessButton from "@/components/BuyAccessButton";
import FindJobsClient from "@/components/FindJobsClient";

export default async function FindJobsPage() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <p>Please sign in to access the job finder ai.</p>
      </div>
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
      <div style={{ padding: 20 }}>
        <p>
          You&apos;ve reached your monthly generation limit on the free plan.
          Upgrade to continue.
        </p>
        <BuyAccessButton />
      </div>
    );
  }

  return <FindJobsClient />;
}
