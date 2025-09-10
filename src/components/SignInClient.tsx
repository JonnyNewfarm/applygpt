"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MagneticCompWide from "./MagneticCompWide";
import { motion } from "framer-motion";

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

          <MagneticCompWide>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full  cursor-pointer mt-2 py-3 mb-3 rounded-[5px] uppercase tracking-wide px-3 text-lg
             font-bold bg-gradient-to-tr from-[#f6f4ed] to-[#e2dfc7]
             dark:from-[#2c2c2c] dark:to-[#3a3a3a]
             text-black dark:text-white shadow-inner hover:shadow-lg
             transition-all duration-300 ease-in-out"
            >
              Sign In
            </motion.button>
          </MagneticCompWide>
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
