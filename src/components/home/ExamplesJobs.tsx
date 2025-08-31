"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function JobsExampleSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] py-20">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-12 items-center px-6">
        <div className="flex justify-center relative group">
          <div className="max-w-lg text-sm">
            <h1 className="text-lg">Example:</h1>
            <h1 className="mb-3 mt-1 font-semibold">Match Score: 8 / 10</h1>
            <p>
              The applicant&apos;s skills and experience closely match the job
              description. The applicant has significant frontend development
              experience with JavaScript, React, and other
            </p>
            <p className="mt-2">
              relevant technologies mentioned in the job description.
              {expanded && (
                <>
                  {" "}
                  However, he does not have experience in TypeScript and cloud
                  services such as AWS, GCP, Azure which were preferred
                  qualifications in the job description. His years of experience
                  are also just short of the preferred qualifications.
                </>
              )}
            </p>
            <div className="w-full flex justify-end pr-5">
              <button
                onClick={() => setExpanded(!expanded)}
                className=" hover:underline text-sm cursor-pointer mt-1"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Find Jobs That Match Your Resume
          </h2>
          <p className="text-lg ">
            Jobscriptor helps you find jobs that align with your resume. Simply
            upload your details, explore opportunities, and see how well your
            skills match each position.
          </p>
          <ul className="space-y-2.5">
            <li>✔ Match jobs directly to your resume</li>
            <li>✔ Discover opportunities from LinkedIn, Indeed, and more</li>
            <li>✔ Generate tailored cover letters instantly</li>
            <li className="mt-6">
              <Link
                className="border-2 rounded-[4px] font-semibold px-3 py-2"
                href={"/jobs"}
              >
                Find Jobs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
