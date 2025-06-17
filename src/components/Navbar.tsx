"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <h2 style={{ display: "inline", marginRight: "2rem" }}>
        <Link href="/">MyApp</Link>
      </h2>

      <Link href="/cover-letter" style={{ marginRight: "1rem" }}>
        <button>Generate Cover Letter</button>
      </Link>

      {!session ? (
        <>
          <Link href="/signin" style={{ marginRight: "1rem" }}>
            <button>Sign In</button>
          </Link>

          <Link href="/register" style={{ marginRight: "1rem" }}>
            <button>Register</button>
          </Link>
        </>
      ) : (
        <>
          <span style={{ marginRight: "1rem" }}>
            Welcome, {session.user?.name ?? session.user?.email}
          </span>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </nav>
  );
}
