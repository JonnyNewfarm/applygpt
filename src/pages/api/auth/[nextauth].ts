// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth"; // adjust path accordingly

export default NextAuth(authOptions);
