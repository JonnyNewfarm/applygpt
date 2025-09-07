"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fixedResume =
  "Experienced Frontend Developer skilled in React, Next.js, and UI/UX design...";
const fixedJobDescription =
  "Frontend Developer role focusing on building scalable web applications at Telenor...";

const sampleCoverLetterTemplate = (resume: string, jobDescription: string) => `
Dear Hiring Manager,

I am excited to apply for the position described below:

${jobDescription}

Here is a brief overview of my qualifications:
${resume}

I believe my skills and experience make me a strong candidate for this role.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.

Best regards,
Jonas Nygaard
`;

const LiveCoverLetterDemo = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [typedText, setTypedText] = useState("");

  const generatedLetter = sampleCoverLetterTemplate(
    fixedResume,
    fixedJobDescription
  );

  useEffect(() => {
    if (!showLetter) return;

    let i = 0;
    const interval = setInterval(() => {
      setTypedText(generatedLetter.slice(0, i));
      i++;
      if (i > generatedLetter.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [showLetter, generatedLetter]);

  return (
    <div className="h-full w-full flex  justify-center border-b-white z-50 dark:border-b-black/20 bg-[#2b2a27] text-[#f6f4ed] px-4  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="w-full px-4 text-left max-w-2xl space-y-1">
        <h2 className="text-xl md:text-3xl font-bold uppercase">
          AI Cover Letter Generator
        </h2>
        <p>
          Upload your resume and a job description, choose a tone, and the AI
          generates a tailored cover letter you can edit, save, copy, or
          download.
        </p>

        {!showLetter && (
          <div className="space-y-1 max-w-xl mt-2">
            <label className="block font-semibold mb-1">Resume </label>
            <textarea
              value={fixedResume}
              readOnly
              rows={2}
              className="w-full outline-none focus:outline-none px-4 text-sm  dark:text-[#2b2a27] py-3.5  border-t border-b   text-[#f6f4ed]  border-stone-200/40 dark:border-stone-800/40"
            />

            <label className="block font-semibold mb-1 mt-4">
              Job Description
            </label>
            <textarea
              value={fixedJobDescription}
              readOnly
              rows={2}
              className="w-full px-4 text-sm  dark:text-[#2b2a27] py-3.5  border-t border-b  text-[#f6f4ed]  border-stone-200/40 dark:border-stone-800/40"
            />

            <button
              onClick={() => setShowLetter(true)}
              className="mt-4 border-2 font-bold cursor-pointer border-[#f6f4ed] dark:border-[#2b2a27] px-6 py-2 rounded hover:opacity-80 transition"
            >
              Generate
            </button>
          </div>
        )}

        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="whitespace-pre-wrap border p-4 rounded text-sm border-[#f6f4ed] bg-white text-black dark:border-[#2b2a27] bg-opacity-10"
          >
            {typedText}
          </motion.div>
        )}

        {showLetter && typedText === generatedLetter && (
          <Link
            href="/cover-letter"
            className="inline-block mt-6 cursor-pointer border-2 px-4 py-2 rounded border-[#f6f4ed] dark:border-[#2b2a27] hover:opacity-80 transition"
          >
            Try It Yourself
          </Link>
        )}

        {showLetter && (
          <button
            onClick={() => {
              setShowLetter(false);
              setTypedText("");
            }}
            className="mt-4 ml-3 border-2 cursor-pointer  border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveCoverLetterDemo;
