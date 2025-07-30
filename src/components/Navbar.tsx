"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import DarkmodeBtn from "./DarkmodeBtn";

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
      <nav className="w-full bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]  g-[#f6f4ed]  sticky top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-14">
          <h2>
            <Link
              href="/"
              className="font-bold text-2xl items-center gap-x-1.5 flex  cursor-pointer"
            >
              <img
                src="/logo-dark.png"
                className="w-6 h-6 hidden dark:block"
                alt=""
              />{" "}
              <img src="/logo.png" className="w-6 h-6  dark:hidden" alt="" />{" "}
              <p>Job Scriptor</p>
            </Link>
          </h2>

          <div className="hidden lg:flex text-lg items-center space-x-6">
            <Link
              href="/jobs"
              className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Find Jobs
            </Link>
            <Link
              href="/resume-generator"
              className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Generate Resume
            </Link>

            <Link
              href="/cover-letter"
              className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Generate Cover Letter
            </Link>

            {!session ? (
              <>
                <Link
                  href="/signin"
                  className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-in-out "
                >
                  Sign Out
                </button>
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
              {" "}
              <span className="h-1 w-1 bg-white block rounded-full" />
              Menu
            </h1>
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27] shadow-lg z-60 transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
          <h2 className="font-bold text-2xl">Menu</h2>
          <DarkmodeBtn />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-6">
          <Link
            href="/jobs"
            className="cursor-pointer hover:text-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            Find Jobs
          </Link>
          <Link
            href="/resume-generator"
            className="cursor-pointer hover:text-gray-700"
          >
            Generate Resume
          </Link>
          <Link
            href="/cover-letter"
            className="cursor-pointer hover:text-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            Generate Cover Letter
          </Link>

          {!session ? (
            <>
              <Link
                href="/signin"
                className="cursor-pointer hover:text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="cursor-pointer hover:text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="cursor-pointer hover:text-gray-700"
                onClick={() => setMenuOpen(false)}
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
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-white/40   bg-opacity-40 z-50"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
