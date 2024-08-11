import { prisma } from "../prisma";

export async function calculateUserProgress(userId: string, courseId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        materials: true,
        assignments: true,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const totalMaterials = course.materials.length;
    const totalAssignments = course.assignments.length;

    console.log(`Total Materials: ${totalMaterials}`);
    console.log(`Total Assignments: ${totalAssignments}`);

    const completedMaterials = await prisma.courseMaterialAccess.count({
      where: {
        userId,
        courseMaterial: {
          courseId,
        },
      },
    });

    const completedAssignments = await prisma.submission.count({
      where: {
        studentId: userId,
        assignment: {
          courseId,
        },
      },
    });

    const totalItems = totalMaterials + totalAssignments;
    const completedItems = completedMaterials + completedAssignments;

    const progressPct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    console.log(`Progress Percentage: ${progressPct.toFixed(2)}%`);

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    await prisma.courseProgress.upsert({
      where: {
        id: enrollment.id,
      },
      update: {
        progressPct: progressPct.toFixed(2) + "%",
        lastAccessedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        progressPct: progressPct.toFixed(2) + "%",
      },
    });

    return {
      progressPct: progressPct.toFixed(2) + "%",
    };
  } catch (error) {
    console.error("Error calculating user progress:", error);
    throw error;
  }
}
