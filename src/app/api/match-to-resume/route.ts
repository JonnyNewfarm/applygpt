// /pages/api/match-to-resume.ts (eller /app/api/match-to-resume/route.ts i app-router)

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
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

  if (
    user.generationLimit !== null &&
    user.generationCount >= user.generationLimit
  ) {
    return NextResponse.json(
      { error: "Generation limit reached" },
      { status: 403 }
    );
  }

  try {
    const { jobDescription, resume } = await req.json();

    if (!jobDescription || !resume) {
      return NextResponse.json(
        { error: "Missing jobDescription or resume" },
        { status: 400 }
      );
    }

    // Call OpenAI to get matching score
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that scores how well a job description matches a user's resume on a scale of 1 to 10. Respond only with a JSON object: { \"score\": number, \"explanation\": string }",
        },
        {
          role: "user",
          content: `Resume:\n${resume}\n\nJob Description:\n${jobDescription}`,
        },
      ],
    });

    const parsed =
      JSON.parse(gptResponse.choices[0]?.message.content || "{}") || {
        score: 1,
        explanation: "Could not evaluate",
      };

    // Increment generation count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationCount: { increment: 1 },
      },
    });

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("OpenAI matching error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate match" },
      { status: 500 }
    );
  }
}
