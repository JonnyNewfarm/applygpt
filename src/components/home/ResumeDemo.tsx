"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const resumeExamples = {
  "Frontend Developer": (name: string, age: number) =>
    `${name}, Age ${age}\nExperienced Frontend Developer skilled in React, Next.js, TypeScript, Tailwind CSS, and building responsive, accessible web apps...`,
  "Graphic Designer": (name: string, age: number) =>
    `${name}, Age ${age}\nCreative Graphic Designer proficient in Adobe XD, Figma, branding, UI/UX design, and digital illustration...`,
};

const jobTitles = Object.keys(resumeExamples);

const LiveGenerateResumeDemo = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [name, setName] = useState("Samantha Lee");
  const [age, setAge] = useState(28);
  const [showResume, setShowResume] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const randomJob =
      jobTitles[Math.floor(Math.random() * jobTitles.length)] || "";
    setJobTitle(randomJob);
  }, []);

  useEffect(() => {
    if (!showResume) return;

    let i = 0;
    const fullText =
      resumeExamples[jobTitle as keyof typeof resumeExamples]?.(name, age) ||
      "";

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [showResume, jobTitle, name, age]);

  return (
    <div className="min-h-screen  w-full flex items-center justify-center bg-[#2b2a27] text-[#f6f4ed] px-4  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-2xl text-left space-y-6">
        <h2 className="text-xl sm:text-3xl font-bold uppercase">
          AI Resume Generator
        </h2>

        <p className="text-base max-w-xl">
          Provide your personal details, work experience, skills, and education
          to generate a professional resume tailored to your career goals.
        </p>
        <p className="text-base max-w-xl">
          Provide your personal details, work experience, skills, and education
          to generate a professional, well-structured resume tailored to your
          career goals.
        </p>

        {!showResume && (
          <div className="space-y-4 max-w-md">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 bg-white text-black py-2 border rounded  border-[#f6f4ed] dark:border-[#2b2a27]"
            />
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Your Age"
              className="w-full px-4 py-2 text-black border rounded bg-white border-[#f6f4ed] dark:border-[#2b2a27]"
            />
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Job title"
              list="jobTitles"
              className="w-full px-4 py-2 text-black border rounded bg-white border-[#f6f4ed] dark:border-[#2b2a27]"
            />
            <datalist id="jobTitles">
              {jobTitles.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
            <button
              onClick={() => setShowResume(true)}
              className="border-2 cursor-pointer font-bold border-[#f6f4ed] dark:border-[#2b2a27] px-6 py-2 rounded hover:opacity-80 transition"
            >
              Generate
            </button>
          </div>
        )}

        {showResume && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="whitespace-pre-wrap border p-4 rounded text-sm bg-white text-black border-[#f6f4ed] dark:border-[#2b2a27] bg-opacity-10"
          >
            {typedText}
          </motion.pre>
        )}

        {showResume &&
          typedText ===
            (resumeExamples[jobTitle as keyof typeof resumeExamples]?.(
              name,
              age
            ) || "") && (
            <Link
              href="/resume-generator"
              className="inline-block mt-6 cursor-pointer border px-4 py-2 rounded border-[#f6f4ed] dark:border-[#2b2a27] hover:opacity-80 transition"
            >
              Try It Yourself
            </Link>
          )}
      </div>
    </div>
  );
};

export default LiveGenerateResumeDemo;
