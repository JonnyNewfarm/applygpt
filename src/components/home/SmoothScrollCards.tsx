"use client";
import { motion } from "framer-motion";

import FindJobSection from "@/components/home/FindJobSection";
import LiveCoverLetterDemo from "@/components/home/CoverletterDemo";
import GenerateResumeDemo from "@/components/home/ResumeDemo";

const sections = [
  { id: 0, component: <GenerateResumeDemo /> },
  { id: 1, component: <FindJobSection /> },
  { id: 2, component: <LiveCoverLetterDemo /> },
];

export default function SmoothScrollCards() {
  return (
    <div className=" flex flex-col gap-y-40 mb-20 mt-10 text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      {sections.map((section) => (
        <motion.div
          key={section.id}
          className="min-h-[70vh] flex items-center justify-center px-4"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {section.component}
        </motion.div>
      ))}
    </div>
  );
}
