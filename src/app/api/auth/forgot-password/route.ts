import { NextResponse } from "next/server";
import  prisma  from "../../../../../lib/prisma";
import { sendResetEmail } from "../../../../../lib/email";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: "Email not found" }, { status: 404 });

  const token = randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires: addHours(new Date(), 1),
    },
  });

  await sendResetEmail(email, token);
  return NextResponse.json({ message: "Reset email sent" });
}
