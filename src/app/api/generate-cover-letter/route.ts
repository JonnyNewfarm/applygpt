import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import  prisma  from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resume, jobAd, tone = "professional" } = await req.json();

  if (!resume || !jobAd) {
    return NextResponse.json(
      { error: "Missing resume or job description" },
      { status: 400 }
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

    // Save resume (overwrite or upsert)
    await prisma.resume.upsert({
      where: { userId: session.user.id },
      update: { content: resume },
      create: {
        content: resume,
        user: { connect: { email: session.user.email } },
      },
    });

    // Save generated cover letter
    await prisma.coverLetter.create({
      data: {
        content: coverLetter,
        tone,
        jobAd,
        user: { connect: { email: session.user.email } },
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
