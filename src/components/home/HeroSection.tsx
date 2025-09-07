"use client";

import React, { useEffect, useRef, useState } from "react";
import MagneticComp from "../MagneticComp";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

const HeroSection = () => {
  const path = useRef<SVGPathElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const progress = useRef<number>(0);
  const time = useRef(Math.PI / 2);
  const reqId = useRef<number | null>(null);

  const setPath = (p: number) => {
    if (!path.current) return;
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
    if (Math.abs(progress.current) > 0.25)
      reqId.current = requestAnimationFrame(animateOut);
    else resetAnimation();
  };

  const resetAnimation = () => {
    time.current = Math.PI / 2;
    progress.current = 0;
  };

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    progress.current += e.movementY;
    setPath(progress.current);
  };
  const manageMouseLeave = () => animateOut();
  const manageMouseEnter = () => {
    if (reqId.current !== null) {
      cancelAnimationFrame(reqId.current);
      resetAnimation();
    }
  };
  useEffect(() => {
    setPath(0);
  }, []);
  return (
    <div
      ref={wrapperRef}
      className="relative min-h-screen w-full  bg-[#2b2a27] text-[#f6f4ed] px-4  dark:bg-[#f6f4f2] dark:text-[#2b2a27] flex justify-center items-center overflow-hidden  sm:px-20 "
    >
      <div className="w-full text-left -mt-10 h-full flex flex-col sm:gap-y-6 gap-y-2 relative z-10">
        <h1 className="sm:text-3xl uppercase text-xl font-bold">
          Simplify Job Searching
        </h1>

        <div className="w-full h-[1px] mb-[5px] hidden sm:block relative">
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={manageMouseMove}
            onMouseLeave={manageMouseLeave}
            className="h-[40px] hover:h-[150px] hover:top-[-75px] z-50 absolute top-[-20px] w-full"
          />
          <svg className="h-[100px] w-full relative top-[-60px]">
            <path
              className="stroke-white dark:stroke-black/70 fill-none stroke-[1px]"
              ref={path}
            />
          </svg>
        </div>

        {/* Text + Buttons */}
        <div className="flex sm:-mt-6 flex-col gap-y-3 md:gap-y-1">
          <div className="md:text-xl text-base lg:text-2xl sm:text-lg">
            <p className="mb-2.5">
              All-in-one <strong>AI tools</strong> to build resumes, write
              tailored cover letters, and discover
            </p>
            <p>
              job opportunities from top platforms like{" "}
              <strong>LinkedIn</strong>, <strong>Indeed</strong>, and more —
              fast.
            </p>
          </div>

          <div className="mt-5">
            <MagneticComp>
              <Link
                className="w-full uppercase cursor-pointer py-3 rounded-[3px] tracking-wide px-3 text-base text-white dark:text-black border-white/50 dark:border-black/50 border-2 font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 whitespace-nowrap"
                href={"/resume-generator"}
              >
                Get Started
              </Link>
            </MagneticComp>
          </div>
        </div>
      </div>
      <div className="absolute bottom-26 left-0 w-full flex justify-between px-6 sm:px-20 z-10  font-bold text-lg sm:text-2xl md:text-3xl">
        {isGenerateModalOpen && (
          <div className="bg-white/90 backdrop-blur-md z-50 text-sm absolute bottom-10 left-10 min-w-[300px] p-12 rounded flex flex-col gap-y-4">
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="absolute cursor-pointer top-2 text-3xl right-2 text-black"
            >
              <IoMdClose />
            </button>
            <Link
              className="bg-stone-700 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
              href="/cover-letter"
            >
              <h1>Cover Letter</h1>
            </Link>
            <Link
              className="bg-stone-900 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
              href="/resume-generator"
            >
              <h1>Resume</h1>
            </Link>
          </div>
        )}
        <MagneticComp>
          <button
            onClick={() => setIsGenerateModalOpen((prev) => !prev)}
            className="flex gap-x-2 cursor-pointer"
          >
            <h1>{isGenerateModalOpen ? "Close" : "Generate"}</h1>
          </button>
        </MagneticComp>
        <MagneticComp>
          <Link className="" href={"/jobs"}>
            Find Jobs
          </Link>
        </MagneticComp>
      </div>
    </div>
  );
};

export default HeroSection;
