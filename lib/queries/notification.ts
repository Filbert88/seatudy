import { NotificationType } from "@prisma/client";
import { prisma } from "../prisma";

async function createNotification(userId: string, message: string, type: NotificationType) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    },
  });

  return notification;
}
export { createNotification };
