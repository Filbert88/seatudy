import { prisma } from "../prisma";
import { CourseInterface } from "@/components/types/types";
async function getEnrolledUser(courseId: string) {
  try {
    const students = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        progress: {
          select: {
            progressPct: true,
          },
        },
      },
    });

    return students.map((enrollment) => {
      const totalProgress = enrollment.progress.reduce(
        (acc, curr) => acc + parseFloat(curr.progressPct),
        0
      );
      const overallProgress =
        enrollment.progress.length > 0
          ? totalProgress / enrollment.progress.length
          : 0;

      const progressFormatted =
        overallProgress % 1 === 0
          ? `${Math.round(overallProgress)} %`
          : `${overallProgress.toFixed(2)} %`;

      return {
        fullName: enrollment.user.fullName,
        progress: progressFormatted,
      };
    });
  } catch (error) {
    console.error("Error retrieving student names and progress:", error);
    throw error;
  }
}

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function getCoursesInfo(): Promise<CourseInterface[]> {
  try {
    const courses = await prisma.course.findMany({
      take: 8,
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    return JSON.parse(JSON.stringify(courses)); 
  } catch (error) {
    console.error("Error retrieving courses:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { getCoursesInfo, getEnrolledUser };
