"use client";
import Link from "next/link";
import React, { useState } from "react";
import { X, Maximize2 } from "lucide-react";

export default function CoverLetterExampleSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] py-20">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-12 items-center px-6">
        <div className="flex justify-center relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative cursor-pointer"
          >
            <img
              src="/example-coverletter.jpg"
              alt="Cover letter example"
              className="w-full max-w-lg border border-gray-200 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
              <Maximize2 className="w-10 h-10 text-white" />
            </div>
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Create Cover Letters That Get You Interviews{" "}
          </h2>
          <p className="text-lg ">
            Jobscriptor uses <strong>AI</strong> to help you generate
            personalized, professional cover letters in minutes. Just enter the
            job details, and we’ll craft a tailored letter that highlights your
            strengths.
          </p>
          <ul className="space-y-2 ">
            <li>✔ AI-generated, job-specific cover letters</li>
            <li>✔ Easy editing and customization</li>
            <li>✔ Download in PDF</li>

            <li className="mt-5">
              <Link
                className="border-2 px-3 py-2 mt-8"
                href={"/resume-generator"}
              >
                Try it out
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed   inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8 cursor-pointer" />
          </button>

          <div className="" onClick={(e) => e.stopPropagation()}>
            <img
              src="/example-coverletter.jpg"
              alt="Cover letter example Fullscreen"
              className="max-w-[90%] md:max-w-[80%] mx-auto  max-h-[90%] border border-gray-400"
            />
          </div>
        </div>
      )}
    </section>
  );
}
