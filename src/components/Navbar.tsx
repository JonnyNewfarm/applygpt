"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <nav className="w-full  bg-light sticky text-xl flex justify-between top-0 left-0 py-5 px-20">
      <h2 style={{ display: "inline", marginRight: "2rem" }}>
        <Link className="cursor-pointer font-bold" href="/">
          ApplyGPT
        </Link>
      </h2>

      <Link
        href="/cover-letter"
        className="cursor-pointer"
        style={{ marginRight: "1rem" }}
      >
        Generate Cover Letter
      </Link>

      <Link
        href="/jobs"
        className="cursor-pointer"
        style={{ marginRight: "1rem" }}
      >
        Find Jobs
      </Link>

      {!session ? (
        <>
          <Link
            className="cursor-pointer"
            href="/signin"
            style={{ marginRight: "1rem" }}
          >
            Sign in{" "}
          </Link>

          <Link
            href="/register"
            className="cursor-pointer"
            style={{ marginRight: "1rem" }}
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <Link href={"/profile"} className="">
            Profile
          </Link>
          <button className="cursor-pointer" onClick={() => signOut()}>
            Sign out
          </button>
        </>
      )}
    </nav>
  );
}
