"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <main style={{ padding: 20 }}>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Sign In
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <button
        onClick={() => signIn("google")}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Sign in with Google
      </button>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </main>
  );
}
