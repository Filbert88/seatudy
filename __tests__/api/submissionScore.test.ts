import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { GET as getSubmissionGrade } from "@/app/api/submission-score/route";
import { POST as createOrUpdateSubmission } from "@/app/api/submission-score/update/route";
import { POST as deleteSubmission } from "@/app/api/submission-score/delete/route";
import { createNotification } from "@/lib/queries/notification";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    submission: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    assignment: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/queries/notification", () => ({
  createNotification: jest.fn(),
}));

describe("GET /api/submission-score", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/submission/grade");
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await getSubmissionGrade(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 400 if userId or assignmentId is missing", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/submission/grade");
  
      const res = await getSubmissionGrade(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("User ID and Assignment ID are required");
    });
  
    it("should return 404 if no submission is found", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      (prisma.submission.findFirst as jest.Mock).mockResolvedValueOnce(null);
  
      const req = new NextRequest("http://localhost:3000/api/submission/grade?userId=user1&assignmentId=assign1");
  
      const res = await getSubmissionGrade(req);
      expect(res.status).toBe(404);
  
      const json = await res.json();
      expect(json.message).toBe("No submission found for the given parameters");
    });
  
    it("should return 200 and the grade if submission is found", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const submission = { grade: 85 };
      (prisma.submission.findFirst as jest.Mock).mockResolvedValueOnce(submission);
  
      const req = new NextRequest("http://localhost:3000/api/submission/grade?userId=user1&assignmentId=assign1");
  
      const res = await getSubmissionGrade(req);
      expect(res.status).toBe(200);
  
      const json = await res.json();
      expect(json).toEqual(submission);
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.submission.findFirst as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/submission/grade?userId=user1&assignmentId=assign1");
  
      const res = await getSubmissionGrade(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });
  
  describe("POST /api/submission-score/update", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
      });
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await createOrUpdateSubmission(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 403 if the user is not an instructor", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
      });
  
      const res = await createOrUpdateSubmission(req);
      expect(res.status).toBe(403);
  
      const json = await res.json();
      expect(json.message).toBe("Forbidden");
    });
  
    it("should return 400 if id or required fields are missing", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
        body: JSON.stringify({}),
      });
  
      const res = await createOrUpdateSubmission(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Missing required fields or no update provided");
    });
  
    it("should return 404 if no user is found", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
  
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
        body: JSON.stringify({ id: "submission1", content: "Updated content", grade: 95 }),
      });
  
      const res = await createOrUpdateSubmission(req);
      expect(res.status).toBe(404);
  
      const json = await res.json();
      expect(json.message).toBe("No users found");
    });
  
    it("should update the submission and return the updated submission", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const updatedSubmission = {
        id: "submission1",
        content: "Updated content",
        grade: 95,
      };
  
      const assignment = {
        id: "assignment1",
        title: "Assignment Title",
      };
  
      (prisma.submission.update as jest.Mock).mockResolvedValueOnce(updatedSubmission);
      (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce(assignment);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "student1" });
  
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
        body: JSON.stringify({ id: "submission1", content: "Updated content", grade: 95 }),
      });
  
      const res = await createOrUpdateSubmission(req);
  
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(updatedSubmission);
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.submission.update as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/submission/update", {
        method: "POST",
        body: JSON.stringify({ id: "submission1", content: "Updated content", grade: 95 }),
      });
  
      const res = await createOrUpdateSubmission(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });

  describe("POST /api/submission-score/delete", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/submission/delete", {
        method: "POST",
      });
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await deleteSubmission(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 403 if the user is not an instructor", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/submission/delete", {
        method: "POST",
      });
  
      const res = await deleteSubmission(req);
      expect(res.status).toBe(403);
  
      const json = await res.json();
      expect(json.message).toBe("Forbidden");
    });
  
    it("should return 400 if submission ID is missing", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/submission/delete", {
        method: "POST",
        body: JSON.stringify({}),
      });
  
      const res = await deleteSubmission(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Submission ID is required");
    });
  
    it("should delete the submission and return a success message", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      (prisma.submission.delete as jest.Mock).mockResolvedValueOnce({ id: "submission1" });
  
      const req = new NextRequest("http://localhost:3000/api/submission/delete", {
        method: "POST",
        body: JSON.stringify({ id: "submission1" }),
      });
  
      const res = await deleteSubmission(req);
  
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe("Submission POSTd successfully");
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { role: "INSTRUCTOR" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.submission.delete as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/submission/delete", {
        method: "POST",
        body: JSON.stringify({ id: "submission1" }),
      });
  
      const res = await deleteSubmission(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });
  