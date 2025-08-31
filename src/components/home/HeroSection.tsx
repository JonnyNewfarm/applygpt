"use client";

import React, { useEffect, useRef, useState } from "react";
import MagneticComp from "../MagneticComp";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

const HeroSection = () => {
  const path = useRef<SVGPathElement | null>(null);
  const [isgenerateModalOpen, setIsgenerateModalOpen] = useState(false);
  const progress = useRef<number>(0);
  const time = useRef<number>(Math.PI / 2);
  const reqId = useRef<number | null>(null);
  useEffect(() => {
    setPath(progress.current);

    return () => {
      if (reqId.current) {
        cancelAnimationFrame(reqId.current);
      }
    };
  }, []);

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

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { movementY } = e;
    progress.current += movementY;
    setPath(progress.current);
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const manageMouseEnter = () => {
    if (reqId.current !== null) {
      cancelAnimationFrame(reqId.current);
      resetAnimation();
    }
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
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time.current = Math.PI / 2;
    progress.current = 0;
  };

  return (
    <div
      className={`min-h-screen  bg-[#2b2a27] text-[#f5f4ef]  dark:bg-[#f6f4f2] dark:text-[#2b2a27] items-center w-full flex justify-center px-6 sm:px-20`}
    >
      <div className=" w-full text-left -mt-10  h-full  flex flex-col sm:gap-y-6 gap-y-2 ">
        <h1 className="sm:text-3xl   uppercase text-xl  font-bold">
          Simplify Job Searching
        </h1>
        <div className="w-full h-[1px] mb-[5px] hidden sm:block relative">
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={manageMouseMove}
            onMouseLeave={manageMouseLeave}
            className="h-[40px] hover:h-[150px] hover:top-[-75px] z-50 absolute top-[-20px] w-full"
          ></div>

          <svg className="h-[100px] w-full relative top-[-60px]">
            <path
              className="dark:stroke-[#2b2a27] stroke-[#f6f4ed]  fill-none stroke-[1px]"
              ref={path}
            ></path>
          </svg>
        </div>

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
          {isgenerateModalOpen && (
            <div className="bg-white/90 backdrop-blur-md z-50 absolute bottom-20  left-10  min-w-[300px] p-12 rounded shadow-lg flex flex-col gap-y-4">
              <button
                onClick={() => setIsgenerateModalOpen(false)}
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

          <div className="mt-5">
            <MagneticComp>
              <Link
                className=" w-full uppercase  cursor-pointer py-3 rounded-[3px]  tracking-wide  px-3 text-base text-[#f6f4ed] dark:text-black border-[#f6f4ed] shadow-md shadow-white/20  dark:shadow-black/5 border-2 dark:border-black font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 whitespace-nowrap"
                href={"/resume-generator"}
              >
                Get Started
              </Link>
            </MagneticComp>
          </div>
        </div>

        <div className="w-full  flex uppercase justify-between font-bold text-lg sm:text-2xl md:text-3xl text-nowrap px-6 sm:px-20 absolute bottom-6  left-0">
          <MagneticComp>
            <button
              onClick={() => setIsgenerateModalOpen((prev) => !prev)}
              className="flex gap-x-2 uppercase cursor-pointer"
            >
              <h1>{isgenerateModalOpen ? "Close" : "Generate"}</h1>
            </button>
          </MagneticComp>
          <MagneticComp>
            <Link href={"/jobs"}>
              <h1>Find jobs</h1>
            </Link>
          </MagneticComp>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
