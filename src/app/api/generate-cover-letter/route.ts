import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resume, jobAd } = await req.json();

    if (!resume || !jobAd) {
      return NextResponse.json({ error: "Missing resume or job description" }, { status: 400 });
    }

    const prompt = `
Generate a professional cover letter based on the following resume and job description.

Resume:
${resume}

Job Description:
${jobAd}

Cover Letter:
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that writes cover letters." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });

    const coverLetter = completion.choices[0].message?.content ?? "";

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
