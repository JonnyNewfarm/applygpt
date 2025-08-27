"use client";

import { CheckIcon } from "lucide-react";
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
    <div className="min-h-screen w-full px-6 py-12 bg-[#2b2a27] text-[#f5f4ef]  dark:bg-[#f6f4f2] dark:text-[#2b2a27] flex flex-col items-center justify-center gap-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold uppercase">
          Find Jobs That Truly Match You
        </h2>

        <div className="text-base space-y-3">
          <p className="max-w-xl ">
            Discover real jobs from top platforms like LinkedIn and Indeed.
          </p>

          <p className="max-w-xl ">
            See key details — title, company, location, salary, tags, and
            compare it to your CV.
          </p>
          <p className="max-w-xl">
            {" "}
            Found the perfect job? Instantly generate an AI-powered cover letter
            and apply.
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl border border-[#2b2a27] rounded p-3 md:p-5 cursor-pointer bg-white text-black  transition relative">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-lg font-semibold text-nowrap">{demoJob.title}</h3>
          <h1 className="flex items-center text-sm font-semibold gap-x-1">
            Saved <CheckIcon className="w-5 h-5 sm:w-8 sm:h-8" />
          </h1>
        </div>
        <p className="mt-1 text-sm font-medium opacity-80">{demoJob.company}</p>
        <p className="mt-1 text-sm opacity-70">{demoJob.location}</p>
        <p>Match: 7/10</p>
        <p className="mt-1 font-semibold">{demoJob.salary}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {demoJob.tags.map((tag) => (
            <span
              key={tag}
              className=" rounded px-3 border py-1 text-xs font-semibold uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex py-4 w-full gap-x-2 justify-between">
          <h1 className="mt-2 border-2 whitespace-nowrap font-semibold border-[#2b2a27] bg-[#2b2a27] text-[#f5f4ef]  px-3 py-1.5 rounded-[3px]   text-sm ">
            Generate Cover Letter
          </h1>
          <h1 className="mt-2 border-2 font-semibold border-[#2b2a27]  px-3 py-1.5 rounded-[3px]   text-sm  dark:text-[#2b2a27]">
            Apply
          </h1>
        </div>
      </div>
    </div>
  );
};

export default FindJobsDemo;
