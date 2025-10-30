"use client";

import { motion, Variants } from "framer-motion";

export default function FindJobsIntro() {
  const container: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="text-white dark:text-black max-w-xl mx-auto text-left space-y-4 px-4 md:px-0"
    >
      <motion.h1
        variants={item}
        className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide"
      >
        Find Jobs That Truly Match You
      </motion.h1>
      <motion.p variants={item} className="text-lg md:text-xl opacity-80">
        Discover real jobs from top platforms like LinkedIn and Indeed.
      </motion.p>
      <motion.p variants={item} className="text-lg md:text-xl opacity-80">
        See key details — title, company, location, salary, tags.
      </motion.p>
      <motion.p variants={item} className="text-lg md:text-xl opacity-80">
        Compare each opportunity instantly to your CV and find the best match.
      </motion.p>
    </motion.div>
  );
}
