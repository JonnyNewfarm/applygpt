"use client";

import React from "react";
import Link from "next/link";

const demoJob = {
  title: "Frontend Developer",
  company: "Telenor",
  location: "Oslo",
  salary: "650,000 NOK",
  tags: ["Full-time", "Remote", "React"],
  match: 92,
};

const FindJobsDemo = () => {
  return (
    <div className="min-h-screen w-full px-6 py-12 bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27] flex flex-col items-center justify-center gap-6">
      <div>
        <h2 className="text-3xl font-bold uppercase">Find Jobs</h2>

        {/* Explanation text */}
        <p className="max-w-xl  text-lg">
          Explore real job listings with detailed information including job
          title, company, location, salary, relevant tags, and how well each job
          matches your profile.
        </p>
      </div>

      {/* Demo Job Card */}
      <div className="w-full max-w-xl border border-[#f6f4ed] dark:border-[#2b2a27] rounded p-6 cursor-pointer hover:bg-[#3a3834] dark:hover:bg-[#dcdad6] transition relative">
        {/* MATCH % badge top-right */}
        <div className="absolute top-4 right-2 bg-green-600 dark:bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase select-none">
          Match {demoJob.match}%
        </div>

        <h3 className="text-lg font-semibold">{demoJob.title}</h3>
        <p className="mt-1 text-sm font-medium opacity-80">{demoJob.company}</p>
        <p className="mt-1 text-sm opacity-70">{demoJob.location}</p>
        <p className="mt-1 font-semibold">{demoJob.salary}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {demoJob.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] rounded px-3 py-1 text-xs font-semibold uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href="/jobs"
          className="inline-block mt-4 text-sm font-medium underline hover:text-[#cfcbbc]"
        >
          See more jobs →
        </Link>
      </div>
    </div>
  );
};

export default FindJobsDemo;
