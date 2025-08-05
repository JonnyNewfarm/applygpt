import { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "Find Jobs with AI-Powered Tools | Job Scriptor",
  description:
    "Explore expert-written career guides on job searching, resume writing, and AI-powered tools to boost your job hunt. Updated regularly with actionable advice.",
  keywords: [
    "AI job search",
    "career tips",
    "resume guide",
    "find jobs with AI",
    "remote jobs 2025",
    "job search New York",
    "cover letter generator",
    "Job Scriptor guides",
  ],
  icons: {
    icon: "og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Find Jobs in New York with AI tools.",
      },
    ],
  },
};

const blogPosts = [
  {
    slug: "ai-find-jobs-new-york",
    title: "How to Use AI to Find Jobs in New York (2025 Guide)",
    href: "/guides/ai-find-jobs-new-york",
  },
  {
    slug: "find-remote-jobs-using-ai",
    title: "5 Smart Ways to Find Remote Jobs Using AI Tools (2025)",
    href: "/guides/find-remote-jobs-using-ai",
  },
  {
    slug: "find-jobs-usa-ai-tools",
    title: "How to Find Jobs in the USA Using AI Tools (2025 Guide)",
    href: "/guides/find-jobs-usa-ai-tools",
  },
  {
    slug: "find-jobs-london",
    title: "Find Jobs in London Using AI Tools (2025 Guide)",
    href: "/guides/jobs-london",
  },
  {
    slug: "find-jobs",
    title: "How to Find Jobs with AI Tools (2025 Guide)",
    href: "/guides/find-jobs",
  },
  {
    slug: "optimize-resume",
    title: "How to Optimize Your Resume with AI (2025 Guide)",
    href: "/guides/optimize-resume",
  },
  {
    slug: "find-jobs-san-francisco",
    title: "Find Jobs in San Francisco Using AI Tools (2025 Guide)",
    href: "/guides/find-jobs-san-francisco",
  },
  {
    slug: "find-jobs-chicago",
    title: "Find Jobs in Chicago Using AI Tools (2025 Guide)",
    href: "/guides/jobs-chicago",
  },
];

const GuidesPage = () => {
  return (
    <div className=" mx-auto px-6 py-12 bg-[#2b2a27] min-h-screen w-full text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <h1 className="text-4xl font-bold mb-8">Guides & Insights</h1>

      <ul className="space-y-6">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link href={post.href} className="text-xl  underline transition">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuidesPage;
