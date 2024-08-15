import { GET } from "@/app/api/review/route";
import { POST } from "@/app/api/review/create/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    review: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    course: {
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
  getServerAuthSession: jest.fn(),
}));

describe("GET /api/review", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if courseId is not provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/review", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.message).toBe("Course ID is required");
  });

  it("should return 200 and reviews if courseId is provided", async () => {
    const courseId = "course1";
    const reviews = [
      {
        id: "review1",
        content: "Great course!",
        rating: 5,
        user: { id: "user1", fullName: "John Doe" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.review.findMany as jest.Mock).mockResolvedValueOnce(reviews);

    const req = new NextRequest(`http://localhost:3000/api/review?courseId=${courseId}`, {
      method: "GET",
    });

    const res = await GET(req);

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { courseId },
      select: {
        id: true,
        content: true,
        rating: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual(reviews);
  });

  it("should return 500 if there is an internal server error", async () => {
    const courseId = "course1";

    (prisma.review.findMany as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest(`http://localhost:3000/api/review?courseId=${courseId}`, {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("POST /api/review/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/review/create", {
      method: "GET",
    });

    const res = await POST(req);
    expect(res.status).toBe(405);

    const json = await res.json();
    expect(json.message).toBe("Method GET Not Allowed");
  });

  it("should return 401 if the user is not authenticated", async () => {
    const req = new NextRequest("http://localhost:3000/api/review/create", {
      method: "POST",
      body: JSON.stringify({
        courseId: "course1",
        content: "Great course!",
        rating: 5,
      }),
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const res = await POST(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 400 if courseId, content, or rating is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/review/create", {
      method: "POST",
      body: JSON.stringify({
        courseId: "course1",
        content: "",
        rating: 6,
      }),
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.message).toBe("Course ID, content, and valid rating are required");
  });

  it("should create a review and update the average rating", async () => {
    const newReview = {
      id: "review1",
      content: "Great course!",
      rating: 5,
      userId: "user1",
      courseId: "course1",
    };

    (prisma.review.create as jest.Mock).mockResolvedValueOnce(newReview);
    (prisma.review.findMany as jest.Mock).mockResolvedValueOnce([{ rating: 5 }, { rating: 4 }]);

    const req = new NextRequest("http://localhost:3000/api/review/create", {
      method: "POST",
      body: JSON.stringify({
        courseId: "course1",
        content: "Great course!",
        rating: 5,
      }),
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        content: "Great course!",
        rating: 5,
        course: {
          connect: { id: "course1" },
        },
        user: {
          connect: { id: "user1" },
        },
      },
    });

    expect(prisma.course.update).toHaveBeenCalledWith({
      where: { id: "course1" },
      data: { averageRating: 4.5 },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Review submitted successfully");
    expect(json.review).toEqual(newReview);
    expect(json.updatedAverageRating).toBe(4.5);
  });

  it("should return 500 if there is an internal server error", async () => {
    (prisma.review.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/review/create", {
      method: "POST",
      body: JSON.stringify({
        courseId: "course1",
        content: "Great course!",
        rating: 5,
      }),
    });

    const session = { user: { id: "user1" } };
    (getServerSession as jest.Mock).mockResolvedValueOnce(session);

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});
