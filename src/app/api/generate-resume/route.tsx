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

  const {
    name,
    jobTitle,
    country,
    city,
    address,
    experience,
    skills,
    phoneNumber,
    email,
    links,
  } = await req.json();

  if (!name || !jobTitle || !experience) {
    return NextResponse.json(
      { error: "Missing required fields" },
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
Name: ${name}
Job Title: ${jobTitle}
Location: ${address}, ${city}, ${country}
Phone: ${phoneNumber}
Email: ${email}
Links: ${links}

Work Experience: ${experience}
Skills: ${skills}

Format the resume in plain text only.
- Keep the name and job title in normal capitalization (do NOT convert to uppercase).
- Write section titles in UPPERCASE (SUMMARY, EXPERIENCE, SKILLS, EDUCATION).
- Do NOT use asterisks, stars, or Markdown.
- Use bullet points with "-" for lists.
- Keep it clean and professional.

`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
    });

    const resume = completion.choices[0].message?.content ?? "";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationCount: { increment: 1 },
      },
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
