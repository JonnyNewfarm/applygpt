import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> } // ✅ FIXED TYPE
) {
  const { id } = await context.params; // ✅ now we await params

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.savedJob.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete job." },
      { status: 500 }
    );
  }
}
