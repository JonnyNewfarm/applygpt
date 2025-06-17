"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthStatus() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign in with credentials</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          });
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign in</button>
      </form>

      <h2>Or sign in with Google</h2>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
