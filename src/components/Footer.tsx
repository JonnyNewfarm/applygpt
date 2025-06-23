import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className="relative h-[420px] bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]"
    >
      <div className="relative h-[calc(100vh+420px)] -top-[100vh] flex-col justify-start">
        <div className="h-[420px]  p-14 sticky top-[calc(100vh-420px)] flex flex-col justify-between">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between">
              <div className="">
                <div className="flex gap-x-10">
                  <div className="">
                    <div className="flex flex-col gap-y-1 justify-start mt-5 text-xl font-light">
                      <h1 className="opacity-70">Navigation</h1>
                      <Link href={"/resume-generator"}>Generate Resume</Link>
                      <Link href={"/jobs"}>Find Jobs</Link>
                      <Link href={"/cover-letter"}>Generate cover letter</Link>
                      <Link href={"/profile"}>Profile</Link>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 md:flex-row  gap-x-10">
              <div className="">
                <h1 className="opacity-65">Created by:</h1>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex underline items-center gap-x-1"
                  href="https://www.jonasnygaard.com/"
                >
                  Newfarm Studio
                </a>
              </div>

              <div className="">
                <h1 className="opacity-65">Contact:</h1>
                <h1>Applygpt@contact.com</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
