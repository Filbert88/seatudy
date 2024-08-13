import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

// Get User Profile
export const GET = async (req: Request) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        courses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
};
