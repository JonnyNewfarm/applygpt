import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  // Check Authorization header to secure this endpoint
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    console.log("✅ Generation counts reset");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error resetting generation count:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
