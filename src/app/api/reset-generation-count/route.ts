import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const runtime = "edge";
export const cron = "*/5 * * * *";
export async function GET() {
  try {
    await prisma.user.updateMany({
      where: {
        hasPaid: true,
        generationLimit: { not: null },
      },
      data: {
        generationCount: 0,
      },
    });

    console.log("✅ Monthly generation counts reset");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error resetting generation count:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
