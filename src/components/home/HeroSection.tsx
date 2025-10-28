"use client";

import React, { useRef, useEffect, useState } from "react";
import MagneticComp from "../MagneticComp";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ThreeButton from "./ButtonMesh";

export default function HeroSection() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);

  const progress = useRef(0);
  const time = useRef(Math.PI / 2);
  const reqId = useRef<number | null>(null);

  const setPath = (p: number) => {
    if (!path.current || typeof window === "undefined") return;
    const innerWidth = window.innerWidth;
    const width = innerWidth + 0.7;
    path.current.setAttributeNS(
      null,
      "d",
      `M0 50 Q${innerWidth / 2} ${50 + p}, ${width} 50`
    );
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const animateOut = () => {
    const newProgress = progress.current + Math.sin(time.current) * 4;
    time.current += 0.38;
    setPath(newProgress);
    progress.current = lerp(progress.current, 0, 0.11);
    if (Math.abs(progress.current) > 0.25) {
      reqId.current = requestAnimationFrame(animateOut);
    } else {
      time.current = Math.PI / 2;
      progress.current = 0;
    }
  };

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    progress.current += e.movementY;
    setPath(progress.current);
  };
  const manageMouseLeave = () => animateOut();
  const manageMouseEnter = () => {
    if (reqId.current !== null) {
      cancelAnimationFrame(reqId.current);
      time.current = Math.PI / 2;
      progress.current = 0;
    }
  };

  useEffect(() => {
    setPath(0);
    const handleResize = () => setPath(0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" as const },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#2b2a27] text-[#f6f4ed] px-4 sm:px-20 flex justify-center items-center overflow-hidden dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <motion.div
        className="w-full text-left -mt-10 h-full flex flex-col sm:gap-y-6 gap-y-2 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={fadeUp}
          className="sm:text-3xl md:text-4xl uppercase text-xl font-bold"
        >
          Simplify Job Searching
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.5 }}
          className="w-full h-[1px] mb-[5px] hidden sm:block relative"
        >
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={manageMouseMove}
            onMouseLeave={manageMouseLeave}
            className="h-[40px] hover:h-[150px] hover:top-[-75px] z-50 absolute top-[-20px] w-full"
          />
          <motion.svg
            className="h-[100px] w-full relative top-[-60px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.path
              ref={path}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.6,
                ease: "easeInOut" as const,
                delay: 1.6,
              }}
              className="stroke-[#f6f4ed] dark:stroke-black/70 fill-none stroke-[2px]"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex sm:-mt-6 flex-col gap-y-3 md:gap-y-1"
        >
          <div className="md:text-xl text-base lg:text-2xl sm:text-lg">
            <p className="mb-2">
              All-in-one <strong>AI tools</strong> to build resumes, write
              tailored cover letters, and discover
            </p>
            <p>
              job opportunities from top platforms like{" "}
              <strong>LinkedIn</strong>, <strong>Indeed</strong>, and more —
              fast.
            </p>
          </div>

          <motion.div variants={fadeUp} className=" -ml-7">
            <ThreeButton />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" as const }}
        className="absolute bottom-26 left-0 w-full flex justify-between px-6 sm:px-20 z-10 font-bold text-lg sm:text-2xl md:text-4xl"
      >
        <AnimatePresence>
          {isGenerateModalOpen && (
            <motion.div
              ref={modalRef}
              key="generate-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" as const }}
              className="bg-stone-200 backdrop-blur-md z-50 min-h-[150px] text-sm absolute items-center flex justify-center bottom-10 left-6 md:left-20 min-w-[200px] rounded-[5px] shadow-lg"
            >
              <div className="flex w-full h-full flex-col gap-y-4 p-4">
                <Link
                  href="/cover-letter"
                  className="bg-stone-700 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
                >
                  Cover Letter
                </Link>
                <Link
                  href="/resume-generator"
                  className="bg-stone-800 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
                >
                  Resume
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MagneticComp>
          <button
            onClick={() => setIsGenerateModalOpen((prev) => !prev)}
            className="flex uppercase gap-x-2 cursor-pointer"
          >
            {isGenerateModalOpen ? "Close" : "Generate"}
          </button>
        </MagneticComp>

        <MagneticComp>
          <Link className="uppercase" href="/jobs">
            Find Jobs
          </Link>
        </MagneticComp>
      </motion.div>
    </div>
  );
}
