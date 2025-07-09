"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fixedResume =
  "Experienced Frontend Developer skilled in React, Next.js, and UI/UX design.";
const fixedJobDescription =
  "Frontend Developer role focusing on building scalable web applications at Telenor.";

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
    <div className="min-h-screen w-full flex items-center justify-center border-b-white z-50 dark:border-b-black/20 bg-[#2b2a27] text-[#f6f4ed] px-4 py-12 dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <div className="w-full max-w-2xl text-left space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase">
          Cover Letter Generator
        </h2>

        <p className="text-lg max-w-xl">
          You provide your resume and a job description, then select the tone
          you want for your letter.
        </p>
        <p className="text-lg max-w-xl">
          The AI uses this information to generate a customized cover letter
          tailored to the job. You can edit, save, copy, or download the final
          letter as a PDF.
        </p>

        {!showLetter && (
          <div className="space-y-4">
            <label className="block font-semibold mb-1">Resume </label>
            <textarea
              value={fixedResume}
              readOnly
              rows={3}
              className="w-full px-4 py-2 border rounded bg-transparent border-[#f6f4ed] dark:border-[#2b2a27] text-[#f6f4ed] dark:text-[#2b2a27] cursor-not-allowed"
            />

            <label className="block font-semibold mb-1 mt-4">
              Job Description
            </label>
            <textarea
              value={fixedJobDescription}
              readOnly
              rows={3}
              className="w-full px-4 py-2 border rounded bg-transparent border-[#f6f4ed] dark:border-[#2b2a27] text-[#f6f4ed] dark:text-[#2b2a27] cursor-not-allowed"
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
            className="whitespace-pre-wrap border p-4 rounded text-sm border-[#f6f4ed] dark:border-[#2b2a27] bg-opacity-10"
          >
            {typedText}
          </motion.div>
        )}

        {showLetter && typedText === generatedLetter && (
          <Link
            href="/cover-letter"
            className="inline-block mt-6 cursor-pointer border-2 px-4 py-2 rounded border-[#f6f4ed] dark:border-[#2b2a27] hover:opacity-80 transition"
          >
            Try It Yourself →
          </Link>
        )}

        {showLetter && (
          <button
            onClick={() => {
              setShowLetter(false);
              setTypedText("");
            }}
            className="mt-4 ml-3 border-2  border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveCoverLetterDemo;
