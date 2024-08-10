import { prisma } from "../prisma";

export async function getEnrolledUser(courseId: string) {
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
    console.error('Error retrieving student names and progress:', error);
    throw error;
  }
}

// expected result should look like this
// [
//   {
//     fullName: 'Kenneth',
//     progress: '75 %', 
//   },
//   {
//     fullName: 'William',
//     progress: '100 %',
//   }
// ]
