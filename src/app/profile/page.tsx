// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import ResumeForm from "../../components/ResumeForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <div>Unauthorized</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      resume: true,
      coverLetters: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <h2 style={{ marginTop: 30 }}>Your Resume</h2>
      <ResumeForm resume={user.resume?.content || ""} />

      <h2 style={{ marginTop: 30 }}>Saved Cover Letters</h2>
      {user.coverLetters.length === 0 ? (
        <p>No cover letters yet.</p>
      ) : (
        user.coverLetters.map((cl) => (
          <div key={cl.id} style={{ marginBottom: 20 }}>
            <p>
              <strong>Tone:</strong> {cl.tone}
            </p>
            <pre style={{ background: "#f5f5f5", padding: 10 }}>
              {cl.content}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}
