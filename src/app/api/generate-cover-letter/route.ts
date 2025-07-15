import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { resume, jobAd, tone = "professional" } = await req.json();

  if (!resume || !jobAd) {
    return NextResponse.json(
      { error: "Missing resume or job description" },
      { status: 400 }
    );
  }

  if (
    user.generationLimit !== null &&
    user.generationCount >= user.generationLimit
  ) {
    return NextResponse.json(
      { error: "Generation limit reached" },
      { status: 403 }
    );
  }

  const prompt = `
Write a ${tone} cover letter based on the resume and job description below.

Resume:
${resume}

Job Description:
${jobAd}

Cover Letter:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes cover letters.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
    });

    const coverLetter = completion.choices[0].message?.content ?? "";

    await prisma.resume.upsert({
      where: { userId: user.id },
      update: { content: resume },
      create: {
        content: resume,
        user: { connect: { id: user.id } },
      },
    });

    const coverLetterCount = await prisma.coverLetter.count({
      where: { userId: user.id },
    });

    if (coverLetterCount >= 5) {
      const oldest = await prisma.coverLetter.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });

      if (oldest) {
        await prisma.coverLetter.delete({
          where: { id: oldest.id },
        });
      }
    }

    await prisma.coverLetter.create({
      data: {
        content: coverLetter,
        tone,
        jobAd,
        user: { connect: { id: user.id } },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationCount: { increment: 1 },
      },
    });

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
