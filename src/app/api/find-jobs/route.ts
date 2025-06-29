import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";  // Adjust path as needed
import prisma from "../../../../lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const JSEARCH_API_HOST = "jsearch.p.rapidapi.com";

interface JobResult {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  job_description?: string;
  job_apply_link: string;
}

async function fetchJobs(query: string, city: string, country: string, page = 1) {
  const fullQuery = encodeURIComponent(`${query} jobs in ${city}`);
  const url = `https://${JSEARCH_API_HOST}/search?query=${fullQuery}&page=${page}&num_pages=1&country=${country}&date_posted=all`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": JSEARCH_API_KEY!,
      "X-RapidAPI-Host": JSEARCH_API_HOST,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("JSearch API error:", errText);
    return null;
  }

  const data = await response.json();
  return data.data || [];
}

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
    const { resume, query, city, country, page = 1 } = await req.json();

    if (!resume || !query || !city || !country) {
      return NextResponse.json(
        { error: "Missing resume, query, city or country" },
        { status: 400 }
      );
    }

    const results = await fetchJobs(query, city, country, page);

    if (!results || results.length === 0) {
      return NextResponse.json({
        jobs: [],
        message: `No jobs found in ${city}, ${country.toUpperCase()}`,
      });
    }

    const jobs = await Promise.all(
      results.slice(0, 10).map(async (job: JobResult) => {
        let parsed = { score: 1, explanation: "Could not evaluate" };

        try {
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
                content: `Resume:\n${resume}\n\nJob Description:\n${job.job_description}`,
              },
            ],
          });

          parsed = JSON.parse(gptResponse.choices[0]?.message.content || "{}");
        } catch (err) {
          console.error("OpenAI scoring error:", err);
        }

        return {
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city || job.job_country || "Unknown",
          description: job.job_description || "No description",
          url: job.job_apply_link,
          ...parsed,
        };
      })
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationCount: { increment: 1 },
      },
    });

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
