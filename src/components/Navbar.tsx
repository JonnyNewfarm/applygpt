"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import DarkmodeBtn from "./DarkmodeBtn";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  if (status === "loading")
    return (
      <div className="ml-5 mt-5 bg-[#2b2a27] w-full text-[#f6f4ed] absolute top-0 left-0  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
        <p className="">Loading...</p>
      </div>
    );

  return (
    <>
      <nav className="w-full bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] sticky top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-14">
          <h2>
            <Link
              href="/"
              className="font-bold text-2xl items-center gap-x-1.5 flex cursor-pointer"
            >
              <img
                src="/logo-dark.png"
                className="w-6 h-6 hidden dark:block"
                alt=""
              />
              <img src="/logo.png" className="w-6 h-6 dark:hidden" alt="" />
              <p>Job Scriptor</p>
            </Link>
          </h2>

          <div className="hidden lg:flex text-lg items-center space-x-6">
            <Link href="/jobs">Find Jobs</Link>
            <Link href="/resume-generator">Generate Resume</Link>
            <Link href="/cover-letter">Generate Cover Letter</Link>
            {!session ? (
              <>
                <Link href="/signin">Sign In</Link>
                <Link href="/register">Register</Link>
              </>
            ) : (
              <>
                <Link href="/profile">Profile</Link>
                <button onClick={() => signOut()}>Sign Out</button>
              </>
            )}
            <DarkmodeBtn />
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex flex-col justify-center items-center space-y-1 cursor-pointer"
            aria-label="Open menu"
          >
            <h1 className="text-xl flex items-center gap-x-2">
              <span className="h-1 w-1 bg-stone-300 dark:bg-stone-700 block rounded-full" />
              Menu
            </h1>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-[#1c1a1782] via-[#26262387] to-[#1c1a175f]
             backdrop-blur-md text-stone-300 shadow-lg dark:from-[#f6f4f2be] dark:via-[#edecebbb] dark:to-[#e7e5e3b2] dark:text-stone-700 z-60"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200/20 dark:border-stone-700/20">
                <DarkmodeBtn />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-lg cursor-pointer"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-col p-4 space-y-6">
                <Link
                  href="/jobs"
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer hover:text-gray-700"
                >
                  Find Jobs
                </Link>
                <Link
                  href="/resume-generator"
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer hover:text-gray-700"
                >
                  Generate Resume
                </Link>
                <Link
                  href="/cover-letter"
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer hover:text-gray-700"
                >
                  Generate Cover Letter
                </Link>

                {!session ? (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="cursor-pointer hover:text-gray-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="cursor-pointer hover:text-gray-700"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="cursor-pointer hover:text-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="cursor-pointer hover:text-gray-700 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
