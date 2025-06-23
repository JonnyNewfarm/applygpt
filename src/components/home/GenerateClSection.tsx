"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const GenerateClSection = () => {
  return (
    <div
      className={`w-full  bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27] uppercase flex flex-col justify-center items-center min-h-screen text-5xl `}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0.8 }}
        viewport={{ once: true }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
        className=" flex flex-col justify-center items-center font-semibold"
      >
        <h1 className="font-normal text-xl md:text-3xl lg:text-4xl">
          Generate coverletter
        </h1>
        <h1 className="flex gap-x-3 text-2xl md:text-4xl items-center whitespace-nowrap lg:text-5xl">
          based on your resume{" "}
        </h1>

        <h1 className="flex items-center gap-x-3 text-2xl md:text-4xl lg:text-5xl">
          and job description
        </h1>
        <Link
          className="text-lg font-normal mt-5 border bg-dark text-white px-4 py-2"
          href={"/jobs"}
        >
          Start Generating
        </Link>
      </motion.div>
    </div>
  );
};

export default GenerateClSection;
