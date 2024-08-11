import { NotificationType } from "@prisma/client";
import { prisma } from "../prisma";
import transporter from "../email";

async function createNotification(userId: string, message: string, type: NotificationType) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user?.email,
    subject: `${type == "ASSIGNMENT_SUBMISSION" ? "Course Assignment" : "Course Purchased"}`,
    text: message,
  });

  return notification;
}
export { createNotification };
