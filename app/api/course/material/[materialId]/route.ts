import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { calculateUserProgress } from "@/lib/queries/user";
import { NextResponse } from "next/server";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async (req: Request, { params }: { params: { materialId: string } }) => {
  const materialId = params.materialId;

  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const material = await prisma.courseMaterial.findUnique({
      where: {
        id: materialId,
      },
      include: {
        accesses: true,
      },
    });

    if (material) {
      const existingAccess = await prisma.courseMaterialAccess.findUnique({
        where: {
          userId_courseMaterialId: {
            userId: session.user.id,
            courseMaterialId: materialId,
          },
        },
      });

      if (!existingAccess) {
        await prisma.courseMaterialAccess.create({
          data: {
            userId: session.user.id,
            courseMaterialId: materialId,
          },
        });

        await calculateUserProgress(session.user.id, material.courseId);
      }
    }

    return NextResponse.json({ message: "Success", data: material }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/material", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
