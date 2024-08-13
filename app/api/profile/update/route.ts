import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  campus?: string;
  password?: string;
  profileUrl?: string;
}

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const fullName = formData.get("fullName") as string | null;
    const email = formData.get("email") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const campus = formData.get("campus") as string | null;
    const password = formData.get("password") as string | null;

    const updateData: UpdateProfileData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (campus) updateData.campus = campus;
    if (password) updateData.password = await hash(password, 10);

    let generatedUrl: string | undefined = user.profileUrl ?? undefined;
    const file = formData.get("file");
    if (file && file instanceof File) {
      generatedUrl = await uploadFileToCloudinary(file);
      updateData.profileUrl = generatedUrl;
    } else if (file) {
      return NextResponse.json(
        { message: "Invalid File Type" },
        { status: 400 }
      );
    }

    if (generatedUrl) {
      updateData.profileUrl = generatedUrl;
    }

    const updateUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Success", data: updateUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json({ status: 500 });
  }
};
