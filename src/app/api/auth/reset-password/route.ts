import  prisma  from "../../../../../lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json({ message: "Token invalid or expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: await hash(password, 10) },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password updated" });
}
