"use client";

import { motion } from "framer-motion";

export default function FindJobsIntroMobile() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="text-white dark:text-black max-w-xl mx-auto text-left space-y-4 px-4 py-24"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide"
      >
        Find Jobs That Truly Match You
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-lg md:text-xl opacity-80"
      >
        Discover real jobs from top platforms like LinkedIn and Indeed.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-lg md:text-xl opacity-80"
      >
        See key details — title, company, location, salary, tags.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-lg md:text-xl opacity-80"
      >
        Compare each opportunity instantly to your CV and find the best match.
      </motion.p>

      <motion.a
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.7 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-lg md:text-xl uppercase font-semibold mt-1 opacity-80"
        href={"/jobs"}
      >
        Find jobs
      </motion.a>
    </motion.div>
  );
}
