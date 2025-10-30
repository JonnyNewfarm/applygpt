"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ThreeResume from "./ThreeResume";
import ThreeCoverLetter from "./ThreeCoverLetter";
import FindJobsIntro from "./FindJobsIntro";

const sections = [
  {
    id: 0,
    component: <ThreeResume />,
    label: "RESUME",
    link: "/resume-generator",
  },
  {
    id: 1,
    component: <ThreeCoverLetter />,
    label: "COVER LETTER",
    link: "/cover-letter",
  },
  { id: 2, component: <FindJobsIntro />, label: "FIND JOBS", link: "/jobs" },
];

export default function SectionGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const currentIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  const handleMouseEnter = (idx: number) => setHoverIndex(idx);
  const handleMouseLeave = () => {
    if (hoverIndex !== null) setActiveIndex(hoverIndex);
    setHoverIndex(null);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] transition-colors duration-700">
      <div
        className="flex md:flex-col justify-center items-center md:items-start w-full md:w-1/3 p-8 space-x-8 md:space-x-0 md:space-y-8"
        onMouseLeave={handleMouseLeave}
      >
        {sections.map((section, idx) => {
          const isActive = currentIndex === idx;
          return (
            <motion.a
              key={section.label}
              href={section.link}
              onMouseEnter={() => handleMouseEnter(idx)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 10 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-extrabold tracking-widest uppercase transition-colors duration-500 block ${
                isActive
                  ? "text-white whitespace-nowrap dark:text-black"
                  : "text-gray-400 whitespace-nowrap hover:text-white dark:hover:text-black"
              }`}
            >
              {section.label}
            </motion.a>
          );
        })}
      </div>

      <div className="flex-1 flex justify-center items-center    p-6 md:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full ml-16 lg:ml-8 max-w-4xl"
          >
            {sections[currentIndex].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
