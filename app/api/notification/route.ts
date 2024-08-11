import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth-options";

// Get All Categories
export const GET = async (req: Request) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (notifications.length == 0) {
      return NextResponse.json({ message: "No notifications found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: notifications }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/notification", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
