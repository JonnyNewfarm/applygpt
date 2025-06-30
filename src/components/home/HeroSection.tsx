"use client";

import React, { useEffect, useRef } from "react";
import MagneticComp from "../MagneticComp";
import Link from "next/link";

const HeroSection = () => {
  const path = useRef<SVGPathElement | null>(null);
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
    const newProgress = progress.current + Math.sin(time.current);
    time.current += 0.2;
    setPath(newProgress);
    progress.current = lerp(progress.current, 0, 0.025);

    if (Math.abs(progress.current) > 0.75) {
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
      className={`min-h-screen   bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27] items-center w-full flex justify-center px-6 sm:px-20`}
    >
      <div className="mb-16 w-full text-left  h-full  flex flex-col sm:gap-y-6 gap-y-2 ">
        <h1 className="sm:text-3xl   uppercase text-2xl  font-bold">
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

        <div className="flex flex-col gap-y-2">
          <div className="md:text-xl text-[15px] lg:text-2xl sm:text-lg">
            <p>
              AI tools to generate resumes, cover letters, and find jobs —
              faster.
            </p>
            <p>Sign up and get started in seconds.</p>
          </div>

          <div className="mt-2">
            <MagneticComp>
              <Link
                className=" border-[#f6f4ed] py-2 px-3 mt-3 dark:border-[#2b2a27] border-2 text-lg font-semibold whitespace-nowrap"
                href={"/register"}
              >
                Get Started
              </Link>
            </MagneticComp>
          </div>
        </div>

        <div className="w-full flex uppercase justify-between font-bold text-lg sm:text-2xl md:text-3xl text-nowrap px-6 sm:px-20 absolute bottom-6  left-0">
          <MagneticComp>
            <Link href={"/cover-letter"} className="flex gap-x-2">
              Generate <p className="hidden sm:block">Resume</p>
            </Link>
          </MagneticComp>
          <MagneticComp>
            <Link href={"/jobs"}>Find jobs</Link>
          </MagneticComp>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
