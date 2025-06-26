"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center border-b-white/20 dark:border-b-black/20  bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <main className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Forgot your Password?</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="-mb-[1px]">Add your email:</p>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border bg-white text-black"
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-black text-white py-2"
          >
            Send reset link
          </button>
        </form>
        {message && <p className="mt-2 text-green-700">{message}</p>}
      </main>
    </div>
  );
}
