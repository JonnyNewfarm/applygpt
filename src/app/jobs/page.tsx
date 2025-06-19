import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth"; // adjust path to your next-auth config if needed
import FindJobsClient from "@/components/FindJobsClient"; // your existing client component

export default async function FindJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <p>Please sign in to access the job finder.</p>
      </div>
    );
  }

  // User is logged in, show the FindJobsClient component (client-side UI with form)
  return <FindJobsClient />;
}
