"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStrongPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      return setError("Name must be at least 2 characters long");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address");
    }

    if (!isStrongPassword(password)) {
      return setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <div className="w-full max-w-sm p-6 rounded-[3px] border shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border bg-white text-black px-4 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-black border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-black border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white text-black border px-4 py-2 rounded"
          />

          <p>
            Already have an account?{" "}
            <Link className="underline" href={"signin"}>
              Sign in
            </Link>
          </p>
          <button
            type="submit"
            className="w-full cursor-pointer py-2 rounded transition border-[#f6f4ed] dark:border-[#2b2a27] border-2 font-bold"
          >
            Register
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </main>
  );
}
