import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

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

  const { query, city, country, page = 1 } = await req.json();

  if (!query || !city || !country) {
    return NextResponse.json(
      { error: "Missing query, city or country" },
      { status: 400 }
    );
  }

  try {
    const results = await fetchJobs(query, city, country, page);

    if (!results || results.length === 0) {
      return NextResponse.json({
        jobs: [],
        message: `No jobs found in ${city}, ${country.toUpperCase()}`,
      });
    }

    // Map to your job object without scoring
    const jobs = results.slice(0, 10).map((job: JobResult) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country || "Unknown",
      description: job.job_description || "No description",
      url: job.job_apply_link,
    }));

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
