import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const savedJobs = await prisma.savedJob.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json(savedJobs);
}



export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { job } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { savedJobs: true },
  });

  if (user!.savedJobs.length >= 10) {
    return NextResponse.json({ error: "You can only save up to 10 jobs." }, { status: 400 });
  }

  try {
    const savedJob = await prisma.savedJob.create({
      data: {
        userId: user!.id,
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        description: job.description,
      },
    });
    return NextResponse.json(savedJob);
  } catch  {
    return NextResponse.json({ error: "Failed to save job." }, { status: 500 });
  }
}
