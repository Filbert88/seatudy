import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { notificationId } = body;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ message: "Notification marked as read", data: updatedNotification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
