import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  campus?: string;
  password?: string;
}

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, phoneNumber, password, fullName, campus } = body;

    const data: UpdateProfileData = {};
    if (fullName) data.fullName = fullName;
    if (email) data.email = email;
    if (phoneNumber) data.phoneNumber = phoneNumber;
    if (campus) data.campus = campus;
    if (password) data.password = await hash(password, 10);

    const updateUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Success", data: updateUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
