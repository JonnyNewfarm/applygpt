import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import BuyAccessButton from "@/components/BuyAccessButton";
import CoverLetterClient from "@/components/CoverLetterClient"; // your existing client component with form

export default async function CoverLetterPage() {
  const session = await getServerSession();
  if (!session) {
    // Not logged in
    return (
      <div style={{ padding: 20 }}>
        <p>Please sign in to access the cover letter generator.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user?.hasPaid) {
    return (
      <div style={{ padding: 20 }}>
        <p>You need to purchase access to use this tool.</p>
        <BuyAccessButton />
      </div>
    );
  }

  // User is logged in and has paid: render the client component with form
  return <CoverLetterClient />;
}
