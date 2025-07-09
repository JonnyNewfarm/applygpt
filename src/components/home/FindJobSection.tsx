"use client";

import React from "react";

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
      <div className="space-y-3">
        <h2 className="text-3xl font-bold uppercase">
          Find Jobs That Truly Match You
        </h2>

        {/* Explanation text */}
        <p className="max-w-xl  text-lg">
          Discover real jobs from top platforms like LinkedIn and Indeed.
        </p>

        <p className="max-w-xl  text-lg">
          See key details — title, company, location, salary, tags, and compare
          it to your CV.
        </p>
        <p className="max-w-xl  text-lg">
          {" "}
          Found the perfect job? Instantly generate an AI-powered cover letter
          and apply.
        </p>
      </div>

      {/* Demo Job Card */}
      <div className="w-full max-w-xl border border-[#f6f4ed] dark:border-[#2b2a27] rounded p-6 cursor-pointer hover:bg-[#3a3834] dark:hover:bg-[#dcdad6] transition relative">
        {/* MATCH % badge top-right */}
        <div className="absolute top-4 right-2 text-green-600 text-sm  sm:text-lg font-bold px-2 py-1 rounded-md uppercase select-none">
          Match 7/10
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

        <div className="flex py-4 w-full justify-between">
          <h1 className="mt-2 border-2 font-semibold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]">
            Generate Cover Letter
          </h1>
          <h1 className="mt-2 border-2 font-semibold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]">
            Apply
          </h1>
        </div>
      </div>
    </div>
  );
};

export default FindJobsDemo;
