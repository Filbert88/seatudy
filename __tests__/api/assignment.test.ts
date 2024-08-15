import { GET } from "@/app/api/assignment/route";
import { GET as SHOW } from "@/app/api/assignment/[assignmentId]/route";
import { POST } from "@/app/api/assignment/create/route";
import { POST as UPDATE } from "@/app/api/assignment/[assignmentId]/update/route";
import { POST as DELETE } from "@/app/api/assignment/delete/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    assignment: {
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
}));

describe("GET /api/assignment", () => {
  it("should return 404 if no assignments are found", async () => {
    (prisma.assignment.findMany as jest.Mock).mockResolvedValueOnce([]);

    const req = new Request("http://localhost:3000/api/assignment?courseId=course-id");

    const res = await GET(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "No assignments found" });
  });

  it("should return 200 and the list of assignments if found", async () => {
    const mockAssignments = [
      {
        id: "assignment-1",
        title: "Assignment 1",
        description: "Description 1",
        courseId: "course-id",
        course: { id: "course-id", name: "Course Name" },
        submissions: [{ id: "submission-1", userId: "user-id" }],
      },
      {
        id: "assignment-2",
        title: "Assignment 2",
        description: "Description 2",
        courseId: "course-id",
        course: { id: "course-id", name: "Course Name" },
        submissions: [{ id: "submission-2", userId: "user-id" }],
      },
    ];

    (prisma.assignment.findMany as jest.Mock).mockResolvedValueOnce(mockAssignments);

    const req = new Request("http://localhost:3000/api/assignment?courseId=course-id");

    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      message: "Success",
      data: mockAssignments,
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (prisma.assignment.findMany as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/assignment?courseId=course-id");

    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });

  it("should return 200 with assignments even if courseId is not provided", async () => {
    const mockAssignments = [
      {
        id: "assignment-1",
        title: "Assignment 1",
        description: "Description 1",
        courseId: "course-id",
        course: { id: "course-id", name: "Course Name" },
        submissions: [{ id: "submission-1", userId: "user-id" }],
      },
    ];

    (prisma.assignment.findMany as jest.Mock).mockResolvedValueOnce(mockAssignments);

    const req = new Request("http://localhost:3000/api/assignment");

    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      message: "Success",
      data: mockAssignments,
    });
  });
});

describe("GET /api/assignment/[assignmentId]", () => {
  it("should return 404 if no assignment is found", async () => {
    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/assignment/assignment-id");
    const params = { assignmentId: "assignment-id" };

    const res = await SHOW(req, { params });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "No assignments found" });
  });

  it("should return 200 and the assignment if found", async () => {
    const mockAssignment = {
      id: "assignment-id",
      title: "Assignment Title",
      description: "Assignment Description",
      courseId: "course-id",
      course: { id: "course-id", name: "Course Name" },
      submissions: [{ id: "submission-id", userId: "user-id" }],
    };

    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce(mockAssignment);

    const req = new Request("http://localhost:3000/api/assignment/assignment-id");
    const params = { assignmentId: "assignment-id" };

    const res = await SHOW(req, { params });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      message: "Success",
      data: mockAssignment,
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (prisma.assignment.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/assignment/assignment-id");
    const params = { assignmentId: "assignment-id" };

    const res = await SHOW(req, { params });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});

describe("POST /api/assignment/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and the created assignment data if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.create as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const body = JSON.stringify({
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const req = new Request("http://localhost:3000/api/assignment/create", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    expect(prisma.assignment.create).toHaveBeenCalledWith({
      data: {
        title: "Assignment 1",
        description: "Description 1",
        dueDateOffset: 3600,
        courseId: "course1",
      },
    });

    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      id: "assignment1",
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const body = JSON.stringify({
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const req = new Request("http://localhost:3000/api/assignment/create", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if user is not an instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1", role: Role.USER },
    });

    const body = JSON.stringify({
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const req = new Request("http://localhost:3000/api/assignment/create", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const body = JSON.stringify({
      title: "Assignment 1",
      description: "Description 1",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const req = new Request("http://localhost:3000/api/assignment/create", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new Request("http://localhost:3000/api/assignment/create", {
      method: "GET",
    });

    const res = await POST(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});

describe("POST /api/assignment/[assignmentId]/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and the updated assignment data if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "Old Title",
      description: "Old Description",
      dueDateOffset: 3600,
      course: { instructorId: "instructor1" },
    });

    (prisma.assignment.update as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
      courseId: "course1",
    });

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(prisma.assignment.findUnique).toHaveBeenCalledWith({
      where: { id: "assignment1" },
      include: { course: true },
    });

    expect(prisma.assignment.update).toHaveBeenCalledWith({
      where: { id: "assignment1" },
      data: {
        title: "New Title",
        description: "New Description",
        dueDateOffset: 7200,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      id: "assignment1",
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
      courseId: "course1",
    });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if the user is not an instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1", role: Role.USER },
    });

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 403 if the instructor is not the owner of the course", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "Old Title",
      description: "Old Description",
      dueDateOffset: 3600,
      course: { instructorId: "instructor2" }, // Different instructor
    });

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 404 if the assignment is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Assignment not found");
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "Old Title",
      description: "Old Description",
      dueDateOffset: 3600,
      course: { instructorId: "instructor1" },
    });

    (prisma.assignment.update as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const body = JSON.stringify({
      title: "New Title",
      description: "New Description",
      dueDateOffset: 7200,
    });

    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new Request("http://localhost:3000/api/assignment/assignment1/update", {
      method: "GET",
    });

    const res = await UPDATE(req, { params: { assignmentId: "assignment1" } });

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});

describe("POST /api/assignment/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the deleted assignment data if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.delete as jest.Mock).mockResolvedValueOnce({
      id: "assignment1",
      title: "Assignment Title",
      description: "Assignment Description",
      dueDateOffset: 3600,
      courseId: "course1",
    });

    const body = JSON.stringify({ assignmentId: "assignment1" });

    const req = new NextRequest("http://localhost:3000/api/assignment/delete", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(prisma.assignment.delete).toHaveBeenCalledWith({
      where: { id: "assignment1" },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      id: "assignment1",
      title: "Assignment Title",
      description: "Assignment Description",
      dueDateOffset: 3600,
      courseId: "course1",
    });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const body = JSON.stringify({ assignmentId: "assignment1" });

    const req = new NextRequest("http://localhost:3000/api/assignment/delete", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if the user is not an instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1", role: Role.USER },
    });

    const body = JSON.stringify({ assignmentId: "assignment1" });

    const req = new NextRequest("http://localhost:3000/api/assignment/delete", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.assignment.delete as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const body = JSON.stringify({ assignmentId: "assignment1" });

    const req = new NextRequest("http://localhost:3000/api/assignment/delete", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/assignment/delete", {
      method: "GET",
    });

    const res = await DELETE(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});
