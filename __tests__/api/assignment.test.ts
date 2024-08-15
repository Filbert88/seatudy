import { GET } from "@/app/api/assignment/route";
import { GET as SHOW } from "@/app/api/assignment/[assignmentId]/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    assignment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
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
