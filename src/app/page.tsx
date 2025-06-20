import FindJobSection from "@/components/home/FindJobSection";
import GenerateClSection from "@/components/home/GenerateClSection";
import MagneticComp from "@/components/MagneticComp";
import SmoothScroll from "@/components/SmoothScroll";
import Link from "next/link";
import React from "react";

const Homepage = () => {
  return (
    <SmoothScroll>
      <div className="h-full flex flex-col justify-center items-center bg-light w-full">
        <div className="min-h-screen w-full flex  justify-center p-20">
          <div className=" mt-36 flex flex-col gap-y-6 text-start">
            <h1 className="font-bold text-2xl whitespace-nowrap sm:text-4xl md:text-5xl lg:text-6xl uppercase">
              {" "}
              Simplify Job Searching
            </h1>
            <div className="flex flex-col gap-y-2">
              <div className="md:text-xl text-lg lg:text-2xl sm:text-lg">
                <p className="">
                  {" "}
                  AI tools to generate cover letters, and find jobs — faster.
                </p>
                <p className="">Sign up and get started in seconds.</p>
              </div>
              <div>
                <MagneticComp>
                  <Link
                    className="font-bold text-xl whitespace-nowrap"
                    href={"/register"}
                  >
                    Get Started
                  </Link>
                </MagneticComp>
              </div>
            </div>
            <div className="w-full flex  uppercase justify-between font-bold text-lg sm:text-2xl md:text-3xl text-nowrap px-6 sm:px-20 absolute bottom-20 left-0">
              <MagneticComp>
                <Link href={"/cover-letter"} className="flex gap-x-2">
                  Generate <p className="hidden sm:block">Cover Letter</p>{" "}
                </Link>
              </MagneticComp>
              <MagneticComp>
                <Link href={"/jobs"}>Find jobs</Link>
              </MagneticComp>
            </div>
          </div>
        </div>

        <FindJobSection />
        <GenerateClSection />
      </div>
    </SmoothScroll>
  );
};

export default Homepage;
