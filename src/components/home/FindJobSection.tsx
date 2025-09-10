"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const demoJob = {
  title: "Frontend Developer",
  company: "Telenor",
  location: "Oslo",
  salary: "650,000 NOK",
  tags: ["Full-time", "Remote", "React"],
  match: 92,
  description:
    "We are seeking a passionate Frontend Developer to join our team at Telenor. You will work on cutting-edge web..",
};

const FindJobsDemo = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="h-full w-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] flex justify-center py-10">
      <div className="w-full max-w-2xl px-2">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold uppercase">
            Find Jobs That Truly Match You
          </h2>

          <div className="md:text-base text-sm space-y-1">
            <p className="max-w-xl">
              Discover real jobs from top platforms like LinkedIn and Indeed.
            </p>
            <p className="max-w-xl">
              See key details — title, company, location, salary, tags — and
              compare it to your CV instantly.
            </p>
          </div>
        </div>

        <div className="max-w-lg rounded p-2 ">
          <h1 className="text-lg font-semibold">{demoJob.title}</h1>
          <p className="text-sm">
            {demoJob.company} • {demoJob.location}
          </p>
          <p className="text-sm mb-2 text-[#d6d4d1] dark:text-[#444]">
            Salary: {demoJob.salary}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {demoJob.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 border border-current rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm mb-2">{demoJob.description}</p>

          <h1 className="mb-0.5 mt-1 font-semibold">
            Match Score: {Math.round(demoJob.match / 10)} / 10
          </h1>

          <p className="text-sm">
            The applicant&apos;s skills and experience closely match the job
            description. The applicant has significant frontend development
            experience with JavaScript, React, and other
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                key="extra"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden text-sm"
              >
                relevant technologies mentioned in the job description. However,
                they do not have experience in TypeScript and cloud services
                such as AWS, GCP, or Azure.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full flex justify-end mt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:underline text-sm cursor-pointer opacity-80"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJobsDemo;
