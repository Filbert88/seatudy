import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { courseId, title, url } = body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    if (!course) {
      return NextResponse.json(
        {
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    const bucketName = `${course.title} bucket`;

    let bucket = await prisma.bucket.findUnique({
      where: { name: bucketName },
    });

    if (!bucket) {
      bucket = await prisma.bucket.create({
        data: {
          name: bucketName,
          courseMaterials: {
            create: [],
          },
        },
      });
    }

    const courseMaterial = await prisma.courseMaterial.create({
      data: {
        title,
        url,
        course: { connect: { id: courseId } },
        bucket: { connect: { id: bucket.id } },
      },
    });

    return NextResponse.json(courseMaterial);
  } catch (error) {
    console.error("Error creating course material:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
