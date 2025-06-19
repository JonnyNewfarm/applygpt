import Link from "next/link";
import React from "react";

const Homepage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-light w-full">
      <div className="min-h-screen w-full flex  justify-center p-20">
        <div className=" mt-52 flex flex-col gap-y-10 text-center">
          <h1 className="font-bold text-6xl uppercase">
            {" "}
            Simplify Job Searching
          </h1>
          <p className="text-2xl">
            {" "}
            AI tools to generate cover letters, and find jobs — faster.
          </p>
          <div className="w-full flex  uppercase justify-between font-bold text-3xl px-20 absolute bottom-20 left-0">
            <Link href={"/cover-letter"}>Generate Cover Letter</Link>
            <Link href={"/jobs"}>Find jobs</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
