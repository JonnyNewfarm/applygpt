"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-light">
      <div className="w-full max-w-sm bg-white p-6 rounded-[3px] border-gray-300 shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <Link className="" href={"/forgot-password"}>
            Forgot your password?
          </Link>

          <button
            type="submit"
            className="w-full mt-2 bg-dark cursor-pointer text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 border-t"></div>

        <button
          onClick={() => signIn("google")}
          className="w-full bg-gray-600 cursor-pointer text-white py-2 rounded hover:bg-gray-500 transition"
        >
          Sign in with Google
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </main>
  );
}
