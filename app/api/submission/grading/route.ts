import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
      },
    });

    const updatedUsers = [];

    for (const user of users) {
      const submissions = await prisma.submission.findMany({
        where: { studentId: user.id },
        select: { grade: true },
      });

      const gradedSubmissions = submissions.filter((sub) => sub.grade !== null);
      const totalGrade = gradedSubmissions.reduce(
        (acc, submission) => acc + submission.grade!,
        0
      );
      const averageGrade =
        gradedSubmissions.length > 0
          ? totalGrade / gradedSubmissions.length
          : 0;

      // Update the user's finalScore with the calculated averageGrade
      await prisma.user.update({
        where: { id: user.id },
        data: { finalScore: averageGrade },
      });

      updatedUsers.push({
        userId: user.id,
        fullName: user.fullName,
        averageGrade: averageGrade,
      });
    }

    return NextResponse.json(updatedUsers);
  } catch (error) {
    console.error("Error calculating and updating average grades:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
