"use client";
import { useEffect, useRef, useState } from "react";

import FindJobSection from "@/components/home/FindJobSection";
import LiveCoverLetterDemo from "@/components/home/CoverletterDemo";
import GenerateResumeDemo from "@/components/home/ResumeDemo";
import { CirclePause, CirclePlay } from "lucide-react";
import { useInView } from "framer-motion";

const sections = [
  { id: 0, component: <GenerateResumeDemo />, label: "Resume" },
  { id: 1, component: <FindJobSection />, label: "Jobs" },
  { id: 2, component: <LiveCoverLetterDemo />, label: "Cover Letter" },
];

export default function SectionLoader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView || paused) return;

    if (paused) return;

    let interval: NodeJS.Timeout;

    if (progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 2);
      }, 100);
    } else {
      if (activeIndex === sections.length - 1) {
        setPaused(true);
      } else {
        const timeout = setTimeout(() => {
          setActiveIndex((prevIndex) => prevIndex + 1);
          setProgress(0);
        }, 500);

        return () => clearTimeout(timeout);
      }
    }

    return () => clearInterval(interval);
  }, [progress, paused, activeIndex, inView]);

  const handleClick = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  return (
    <div className="pb-20 min-h-screen pt-30 bg-[#2b2a27] dark:bg-[#f6f4ed] -mt-8 w-full">
      <div className="max-w-3xl px-3 w-full mx-auto">
        <div className="flex w-full space-x-2" ref={ref}>
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="flex-1 relative h-2 rounded  cursor-pointer"
              onClick={() => handleClick(idx)}
            >
              <div className="absolute inset-0 bg-gray-200 dark:bg-stone-500 opacity-40 rounded" />
              <div
                className="sticky left-0 top-0 h-2 bg-gray-100 dark:bg-stone-600 rounded transition-all"
                style={{
                  width:
                    idx === activeIndex
                      ? `${progress}%`
                      : idx < activeIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end my-2">
          <button
            onClick={() => {
              if (
                paused &&
                activeIndex === sections.length - 1 &&
                progress >= 100
              ) {
                setActiveIndex(0);
                setProgress(0);
                setPaused(false);
              } else {
                setPaused((p) => !p);
              }
            }}
            className="px-3 py-1 cursor-pointer  rounded"
          >
            {paused ? (
              <p>
                <CirclePlay size={30} className="text-white dark:text-black " />
              </p>
            ) : (
              <p>
                <CirclePause
                  size={30}
                  className="text-white dark:text-black "
                />
              </p>
            )}
          </button>
        </div>

        <div className="bg-black w-full md:-mt-16">
          {sections[activeIndex].component}
        </div>
      </div>
    </div>
  );
}
