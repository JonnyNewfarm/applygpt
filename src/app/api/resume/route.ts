// pages/api/resume.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { resume: true },
  });

  return NextResponse.json(user?.resume || {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();

  const updated = await prisma.resume.upsert({
    where: { userId: session.user.id },
    update: { content },
    create: { content, user: { connect: { id: session.user.id } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.resume.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
