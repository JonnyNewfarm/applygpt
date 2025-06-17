// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // or number if your Prisma id is numeric
  }

  interface Session {
    user: {
      id: string; // add id here too for session.user.id
      name?: string | null;
      email?: string | null;
      image?: string | null;
      hasPaid?: boolean | null
    };
  }
}
