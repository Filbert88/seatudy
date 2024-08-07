import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/auth-options";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const userSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters long" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phoneNumber: z.string().min(10, { message: "Phone number must be valid" }).optional(),
  campus: z.string().min(1, { message: "Campus name must be at least 1 character long" }).optional(),
  password: z.string().min(8, { message: "Password must be at least 6 characters long" }).optional(),
});

// Get User Profile
export const GET = async (req: Request) => {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// PATCH User Profile
export const PATCH = async (req: Request) => {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = userSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          user: null,
          message: "Invalid input",
          errors: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, phoneNumber, password, fullName, campus } = parsedBody.data;

    const updateData: any = {
      fullName,
      email,
      phoneNumber,
      campus,
    };

    if (password) {
      updateData.password = await hash(password, 10);
    }

    const updateUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Success", data: updateUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
