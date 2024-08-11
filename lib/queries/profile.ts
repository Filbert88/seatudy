import { prisma } from "../prisma";
import { Role } from "@prisma/client";

async function getInstructorNamebyId(instructorId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: instructorId,
        role: Role.INSTRUCTOR
      },
      select: {
        fullName: true,
      },
    });
  
    return user?.fullName;
  }
export { getInstructorNamebyId };
