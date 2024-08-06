import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { Role } from "@prisma/client"; // Ensure you import the Role enum from Prisma

const userSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be valid" }),
    campus: z
      .string()
      .min(1, { message: "Campus name must be at least 1 character long" }),
    role: z.string().min(1, { message: "Roles must be inputted" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function stringToRole(role: string): Role {
  const lowerCaseRole = role.toLowerCase();
  if (lowerCaseRole === "user") return Role.USER;
  if (lowerCaseRole === "instructor") return Role.INSTRUCTOR;
  if (lowerCaseRole === "admin") return Role.ADMIN;
  throw new Error("Invalid role");
}

export async function POST(req: Request) {
  try {
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

    const { email, phoneNumber, password, fullName, campus, role } =
      parsedBody.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "User already exists with this email",
        },
        { status: 409 }
      );
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        {
          user: null,
          message: "User already exists with this phone number",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        phoneNumber,
        password: hashedPassword,
        campus,
        role: stringToRole(role),
      },
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.fullName,
          role: newUser.role,
        },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/auth/signup:", error);
    return NextResponse.json(
      {
        user: null,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
