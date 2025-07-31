"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/jobs");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="w-full max-w-sm  p-6 rounded-[3px] border-[#f6f4ed] dark:border-[#2b2a27] border shadow">
        <h1 className="text-2xl font-bold  mb-6 text-center">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded bg-white text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded bg-white text-black"
          />
          <Link className="" href={"/forgot-password"}>
            Forgot your password? <p className="underline">Reset password</p>
          </Link>

          <button
            type="submit"
            className="w-full mt-2 cursor-pointer py-2 rounded transition bg-[#f6f4ed] text-black dark:text-white dark:bg-[#2b2a27] border-2 font-bold"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 border-t"></div>

        <button
          onClick={() => signIn("google")}
          className="w-full cursor-pointer py-2 rounded transition border-[#f6f4ed] dark:border-[#2b2a27] border-2 font-bold"
        >
          Sign in with Google
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </main>
  );
}
