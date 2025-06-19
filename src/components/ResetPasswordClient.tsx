"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.message);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          placeholder="New Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="w-full bg-black text-white py-2">
          Reset Password
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </main>
  );
}
