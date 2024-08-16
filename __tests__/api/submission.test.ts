import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { GET as getSubmissionsByCourseId } from "@/app/api/submission/route";
import { GET as getSubmissionsByUserId } from "@/app/api/submission/[id]/route";
import { POST as createSubmission } from "@/app/api/submission/create/route";
import { GET as calculateAverageGrade } from "@/app/api/submission/grading/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    submission: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    assignment: {
      findUnique: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/queries/notification", () => ({
  createNotification: jest.fn(),
}));

jest.mock("@/lib/queries/user", () => ({
  calculateUserProgress: jest.fn(),
}));

describe("GET /api/submission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if courseId is not provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/submission");

    const res = await getSubmissionsByCourseId(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.message).toBe("Course ID is required");
  });

  it("should return 401 if the user is not authenticated", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/submission?courseId=course1"
    );

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await getSubmissionsByCourseId(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if the user is not an instructor or admin", async () => {
    const session = { user: { role: "STUDENT" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const req = new NextRequest(
      "http://localhost:3000/api/submission?courseId=course1"
    );

    const res = await getSubmissionsByCourseId(req);
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 200 and the submissions for the course", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    const submissions = [
      {
        id: "68120e75-1e64-489d-a8d2-ad0aefd72da9",
        content:
          "https://res.cloudinary.com/dl2cqncwz/raw/upload/v1723651127/vgbtxdazuzknmqp9igvx.pdf",
        assignment: {
          id: "cfb8af4b-0d22-4c47-917c-8c2d54f84bc8",
          title: "Recurrent Neural Network",
        },
        student: {
          id: "ae001645-8441-4d76-ad4c-4f366b5181bb",
          fullName: "Kenneth Sunjaya",
          email: "kennethsunjaya@gmail.com",
        },
      },
    ];
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.submission.findMany as jest.Mock).mockResolvedValueOnce(
      submissions
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission?courseId=course1"
    );

    const res = await getSubmissionsByCourseId(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(submissions);
  });

  it("should return 500 if there is an internal server error", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.submission.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission?courseId=course1"
    );

    const res = await getSubmissionsByCourseId(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("GET /api/submission/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if the user is not authenticated", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/submission/student1"
    );

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await getSubmissionsByUserId(req, {
      params: { id: "ae001645-8441-4d76-ad4c-4f366b5181bb" },
    });
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 401 if userId is not provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/submission/");

    const res = await getSubmissionsByUserId(req, { params: { id: "" } });
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("User ID is required");
  });

  it("should return 200 and the submissions for the user", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    const submissions = [
      {
        id: "68120e75-1e64-489d-a8d2-ad0aefd72da9",
        content:
          "https://res.cloudinary.com/dl2cqncwz/raw/upload/v1723651127/vgbtxdazuzknmqp9igvx.pdf",
        assignment: {
          id: "cfb8af4b-0d22-4c47-917c-8c2d54f84bc8",
          title: "Recurrent Neural Network",
        },
      },
    ];
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.submission.findMany as jest.Mock).mockResolvedValueOnce(
      submissions
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission/student1"
    );

    const res = await getSubmissionsByUserId(req, {
      params: { id: "student1" },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(submissions);
  });

  it("should return 500 if there is an internal server error", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.submission.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission/student1"
    );

    const res = await getSubmissionsByUserId(req, {
      params: { id: "student1" },
    });
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("POST /api/submission/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if the user is not authenticated", async () => {
    const req = new NextRequest("http://localhost:3000/api/submission/create", {
      method: "POST",
      body: JSON.stringify({
        content: "Submission content",
        assignmentId: "assign1",
      }),
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await createSubmission(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 400 if content or assignmentId is missing", async () => {
    const session = { user: { id: "student1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const req = new NextRequest("http://localhost:3000/api/submission/create", {
      method: "POST",
      body: JSON.stringify({
        content: "",
        assignmentId: "",
      }),
    });

    const res = await createSubmission(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.message).toBe(
      "Missing required fields: content and assignmentId are required"
    );
  });

  it("should create a submission and return it", async () => {
    const session = { user: { id: "student1", name: "John Doe" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const newSubmission = {
      id: "sub1",
      content: "Submission content",
      assignmentId: "assign1",
      studentId: "student1",
    };
    (prisma.submission.create as jest.Mock).mockResolvedValueOnce(
      newSubmission
    );
    (prisma.assignment.findUnique as jest.Mock).mockResolvedValueOnce({
      title: "Assignment 1",
      courseId: "course1",
      course: {
        instructor: { id: "instructor1", fullName: "Instructor Name" },
      },
    });

    const req = new NextRequest("http://localhost:3000/api/submission/create", {
      method: "POST",
      body: JSON.stringify({
        content: "Submission content",
        assignmentId: "assign1",
      }),
    });

    const res = await createSubmission(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(newSubmission);
  });

  it("should return 500 if there is an internal server error", async () => {
    const session = { user: { id: "student1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.submission.create as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const req = new NextRequest("http://localhost:3000/api/submission/create", {
      method: "POST",
      body: JSON.stringify({
        content: "Submission content",
        assignmentId: "assign1",
      }),
    });

    const res = await createSubmission(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("GET /api/submission/grading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if the user is not authenticated", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/submission/calculate-grade"
    );

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await calculateAverageGrade(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if the user is not an instructor or admin", async () => {
    const session = { user: { role: "STUDENT" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const req = new NextRequest(
      "http://localhost:3000/api/submission/calculate-grade"
    );

    const res = await calculateAverageGrade(req);
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.message).toBe("Unauthorized");
  });

  it("should calculate and update average grades for all users", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const users = [{ id: "student1", fullName: "John Doe" }];
    const submissions = [{ grade: 90 }, { grade: 80 }];
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(users);
    (prisma.submission.findMany as jest.Mock).mockResolvedValueOnce(
      submissions
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission/calculate-grade"
    );

    const res = await calculateAverageGrade(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual([
      {
        userId: "student1",
        fullName: "John Doe",
        averageGrade: 85,
      },
    ]);
  });

  it("should return 500 if there is an internal server error", async () => {
    const session = { user: { role: "INSTRUCTOR" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);
    (prisma.user.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const req = new NextRequest(
      "http://localhost:3000/api/submission/calculate-grade"
    );

    const res = await calculateAverageGrade(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});
