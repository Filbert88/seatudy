import { GET } from "@/app/api/profile/route";
import { POST } from "@/app/api/profile/update/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { hash } from "bcrypt";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("@/lib/cloudinary", () => ({
  uploadFileToCloudinary: jest.fn(),
}));

describe("GET /api/profile", () => {
  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/profile", {
      method: "GET",
    });

    const res = await GET(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 404 if the user is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/profile", {
      method: "GET",
    });

    const res = await GET(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ user: null, message: "User not found" });
  });

  it("should return 200 and the user data if the user is found", async () => {
    const mockUser = {
      id: "user-id",
      name: "John Doe",
      email: "johndoe@example.com",
      courses: [],
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    const req = new Request("http://localhost:3000/api/profile", {
      method: "GET",
    });

    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: "Success", data: mockUser });
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/profile", {
      method: "GET",
    });

    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe("POST /api/profile/update", () => {
  it("should return 405 if the method is not POST", async () => {
    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "GET",
    });

    const res = await POST(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });

  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "POST",
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 404 if the user is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "POST",
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "User not found" });
  });

  it("should return 400 if the file is invalid", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id", profileUrl: "old-url" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-id",
      profileUrl: "old-url",
    });

    const formData = new FormData();
    formData.append("file", new Blob(["invalid-content"], { type: "text/plain" }));

    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "Invalid File Type" });
  });

  it("should return 201 and the updated user data if profile is updated successfully", async () => {
    const mockUser = {
      id: "user-id",
      fullName: "John Doe",
      email: "johndoe@example.com",
      phoneNumber: "123456789",
      campus: "Campus A",
      profileUrl: "old-url",
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    (prisma.user.update as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      fullName: "Jane Doe",
    });

    (hash as jest.Mock).mockResolvedValueOnce("hashed-password");
    (uploadFileToCloudinary as jest.Mock).mockResolvedValueOnce("new-url");

    const formData = new FormData();
    formData.append("fullName", "Jane Doe");
    formData.append("file", new Blob(["content"], { type: "image/jpeg" }));

    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({
      message: "Success",
      data: {
        ...mockUser,
        fullName: "Jane Doe",
        profileUrl: "new-url",
      },
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-id",
    });

    (prisma.user.update as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/profile/update", {
      method: "POST",
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
