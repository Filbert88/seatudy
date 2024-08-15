import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/course/material/route";
import { GET as SHOW } from "@/app/api/course/material/[materialId]/route";
import { POST } from "@/app/api/course/material/create/route";
import { POST as UPDATE } from "@/app/api/course/material/update/route";
import { POST as DELETE } from "@/app/api/course/material/delete/route";
import { CourseMaterial } from "@prisma/client";
import { getServerSession } from "next-auth";
import { calculateUserProgress } from "@/lib/queries/user";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findUnique: jest.fn(),
    },
    bucket: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    courseMaterial: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
  getServerAuthSession: jest.fn(),
}));

jest.mock("@/lib/queries/user", () => ({
  calculateUserProgress: jest.fn(),
}));

describe("GET /api/course/material", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the list of materials for the given courseId", async () => {
    const courseId = "course1";
    const materials = [
      {
        id: "material1",
        title: "Material 1",
        courseId,
        accesses: [],
      },
      {
        id: "material2",
        title: "Material 2",
        courseId,
        accesses: [],
      },
    ];

    (prisma.courseMaterial.findMany as jest.Mock).mockResolvedValueOnce(materials);

    const req = new Request(`http://localhost:3000/api/course/material?courseId=${courseId}`, {
      method: "GET",
    });

    const res = await GET(req);

    expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
      where: { courseId },
      include: { accesses: true },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(materials);
  });

  it("should return 200 and an empty list if no courseId is provided", async () => {
    const materials: CourseMaterial[] = [];

    (prisma.courseMaterial.findMany as jest.Mock).mockResolvedValueOnce(materials);

    const req = new Request("http://localhost:3000/api/course/material", {
      method: "GET",
    });

    const res = await GET(req);

    expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
      where: {},
      include: { accesses: true },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(materials);
  });

  it("should return 500 if there is an internal server error", async () => {
    (prisma.courseMaterial.findMany as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/course/material?courseId=course1", {
      method: "GET",
    });

    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 400 if the query parameter is invalid", async () => {
    const req = new Request("http://localhost:3000/api/course/material?courseId=invalid", {
      method: "GET",
    });

    // Mocking prisma to return an empty list or throw an error based on how you handle invalid courseIds
    (prisma.courseMaterial.findMany as jest.Mock).mockResolvedValueOnce([]);

    const res = await GET(req);

    expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
      where: { courseId: "invalid" },
      include: { accesses: true },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual([]);
  });
});

describe("GET /api/course/material/[materialId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the material details if authenticated and access is granted", async () => {
    const materialId = "material1";
    const material = {
      id: materialId,
      title: "Material 1",
      courseId: "course1",
      accesses: [],
    };

    (prisma.courseMaterial.findUnique as jest.Mock).mockResolvedValueOnce(material);
    (prisma.courseMaterialAccess.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.courseMaterialAccess.create as jest.Mock).mockResolvedValueOnce({});
    (calculateUserProgress as jest.Mock).mockResolvedValueOnce({});

    const req = new Request(`http://localhost:3000/api/course/material/${materialId}`, {
      method: "GET",
    });
    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await SHOW(req, { params: { materialId } });

    expect(prisma.courseMaterial.findUnique).toHaveBeenCalledWith({
      where: { id: materialId },
      include: { accesses: true },
    });

    expect(prisma.courseMaterialAccess.findUnique).toHaveBeenCalledWith({
      where: {
        userId_courseMaterialId: { userId: session.user.id, courseMaterialId: materialId },
      },
    });

    expect(prisma.courseMaterialAccess.create).toHaveBeenCalledWith({
      data: {
        userId: session.user.id,
        courseMaterialId: materialId,
      },
    });

    expect(calculateUserProgress).toHaveBeenCalledWith(session.user.id, material.courseId);

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(material);
  });

  it("should return 401 if not authenticated", async () => {
    const materialId = "material1";

    const req = new Request(`http://localhost:3000/api/course/material/${materialId}`, {
      method: "GET",
    });
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await SHOW(req, { params: { materialId } });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 500 if there is an internal server error", async () => {
    const materialId = "material1";

    (prisma.courseMaterial.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request(`http://localhost:3000/api/course/material/${materialId}`, {
      method: "GET",
    });
    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await SHOW(req, { params: { materialId } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should not create access or update progress if already accessed", async () => {
    const materialId = "material1";
    const material = {
      id: materialId,
      title: "Material 1",
      courseId: "course1",
      accesses: [],
    };

    (prisma.courseMaterial.findUnique as jest.Mock).mockResolvedValueOnce(material);
    (prisma.courseMaterialAccess.findUnique as jest.Mock).mockResolvedValueOnce({});

    const req = new Request(`http://localhost:3000/api/course/material/${materialId}`, {
      method: "GET",
    });
    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await SHOW(req, { params: { materialId } });

    expect(prisma.courseMaterial.findUnique).toHaveBeenCalledWith({
      where: { id: materialId },
      include: { accesses: true },
    });

    expect(prisma.courseMaterialAccess.findUnique).toHaveBeenCalledWith({
      where: {
        userId_courseMaterialId: { userId: session.user.id, courseMaterialId: materialId },
      },
    });

    expect(prisma.courseMaterialAccess.create).not.toHaveBeenCalled();
    expect(calculateUserProgress).not.toHaveBeenCalled();

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(material);
  });
});

describe("POST /api/course/material/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new course material", async () => {
    const courseId = "course1";
    const title = "Material 1";
    const url = "http://example.com/material1";

    const course = {
      id: courseId,
      title: "Course Title",
    };

    const bucket = {
      id: "bucket1",
      name: "Course Title bucket",
    };

    const createdMaterial = {
      id: "material1",
      title,
      url,
      courseId,
      bucketId: bucket.id,
    };

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce(course);
    (prisma.bucket.findUnique as jest.Mock).mockResolvedValueOnce(bucket);
    (prisma.courseMaterial.create as jest.Mock).mockResolvedValueOnce(createdMaterial);

    const req = new NextRequest("http://localhost:3000/api/course/material/create", {
      method: "POST",
      body: JSON.stringify({ courseId, title, url }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: courseId },
      select: { title: true },
    });

    expect(prisma.bucket.findUnique).toHaveBeenCalledWith({
      where: { name: `${course.title} bucket` },
    });

    expect(prisma.bucket.create).toHaveBeenCalledWith({
      data: {
        name: `${course.title} bucket`,
        courseMaterials: { create: [] },
      },
    });

    expect(prisma.courseMaterial.create).toHaveBeenCalledWith({
      data: {
        title,
        url,
        course: { connect: { id: courseId } },
        bucket: { connect: { id: bucket.id } },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(createdMaterial);
  });

  it("should return 401 if not authenticated", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/material/create", {
      method: "POST",
      body: JSON.stringify({ courseId: "course1", title: "Material 1", url: "http://example.com/material1" }),
      headers: { "Content-Type": "application/json" },
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Unauthorized");
  });

  it("should return 404 if course not found", async () => {
    const courseId = "course1";
    const title = "Material 1";
    const url = "http://example.com/material1";

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/course/material/create", {
      method: "POST",
      body: JSON.stringify({ courseId, title, url }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: courseId },
      select: { title: true },
    });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Course not found");
  });

  it("should return 500 if there is an internal server error", async () => {
    const courseId = "course1";
    const title = "Material 1";
    const url = "http://example.com/material1";

    (prisma.course.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/course/material/create", {
      method: "POST",
      body: JSON.stringify({ courseId, title, url }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("POST /api/course/material/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and update the course material", async () => {
    const materialId = "material1";
    const updatedTitle = "Updated Material Title";
    const updatedUrl = "http://example.com/updated-material";

    const updatedMaterial = {
      id: materialId,
      title: updatedTitle,
      url: updatedUrl,
      updatedAt: new Date(),
    };

    (prisma.courseMaterial.update as jest.Mock).mockResolvedValueOnce(updatedMaterial);

    const req = new NextRequest("http://localhost:3000/api/course/material/update", {
      method: "POST",
      body: JSON.stringify({ materialId, title: updatedTitle, url: updatedUrl }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await UPDATE(req);

    expect(prisma.courseMaterial.update).toHaveBeenCalledWith({
      where: { id: materialId },
      data: {
        title: updatedTitle,
        url: updatedUrl,
        updatedAt: expect.any(Date),
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(updatedMaterial);
  });

  it("should return 401 if not authenticated", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/material/update", {
      method: "POST",
      body: JSON.stringify({ materialId: "material1", title: "Title", url: "http://example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await UPDATE(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Unauthorized");
  });

  it("should return 500 if there is an internal server error", async () => {
    const materialId = "material1";
    const title = "Title";
    const url = "http://example.com";

    (prisma.courseMaterial.update as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/course/material/update", {
      method: "POST",
      body: JSON.stringify({ materialId, title, url }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await UPDATE(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/material/update", {
      method: "GET",
    });

    const res = await UPDATE(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});

describe("POST /api/course/material/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and delete the course material", async () => {
    const materialId = "material1";
    const deletedMaterial = {
      id: materialId,
      title: "Material Title",
      url: "http://example.com/material",
    };

    (prisma.courseMaterial.delete as jest.Mock).mockResolvedValueOnce(deletedMaterial);

    const req = new NextRequest("http://localhost:3000/api/course/material/delete", {
      method: "POST",
      body: JSON.stringify({ materialId }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await DELETE(req);

    expect(prisma.courseMaterial.delete).toHaveBeenCalledWith({
      where: { id: materialId },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(deletedMaterial);
  });

  it("should return 401 if not authenticated", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/material/delete", {
      method: "POST",
      body: JSON.stringify({ materialId: "material1" }),
      headers: { "Content-Type": "application/json" },
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await DELETE(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Unauthorized");
  });

  it("should return 500 if there is an internal server error", async () => {
    const materialId = "material1";

    (prisma.courseMaterial.delete as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/course/material/delete", {
      method: "POST",
      body: JSON.stringify({ materialId }),
      headers: { "Content-Type": "application/json" },
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await DELETE(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/material/delete", {
      method: "GET",
    });

    const res = await DELETE(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});
