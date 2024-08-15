import { GET } from "@/app/api/course/route";
import { GET as SHOW } from "@/app/api/course/[courseId]/route";
import { GET as POPULAR } from "@/app/api/course/popular/route";
import { GET as MYCOURSE } from "@/app/api/course/my-course/route";
import { POST } from "@/app/api/course/create/route";
import { POST as UPDATE } from "@/app/api/course/[courseId]/update/route";
import { POST as DELETE } from "@/app/api/course/delete/route";
import { POST as PURCHASE } from "@/app/api/course/[courseId]/purchase/route";
import { prisma } from "@/lib/prisma";
import { DifficultyLevel, NotificationType, Role, TransactionType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { NextRequest } from "next/server";
import { createNotification } from "@/lib/queries/notification";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    courseCategory: {
      upsert: jest.fn(),
    },
    courseCategoryCourse: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    courseEnrollment: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/cloudinary", () => ({
  uploadFileToCloudinary: jest.fn(),
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/queries/notification", () => ({
  createNotification: jest.fn(),
}));

describe("GET /api/course", () => {
  const mockCourses = [
    {
      id: "course1",
      title: "Course 1",
      difficulty: DifficultyLevel.BEGINNER,
      averageRating: 4.5,
      enrollments: [],
      materials: [],
      categories: [
        {
          category: {
            id: "category1",
            name: "Category 1",
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the courses when searching by title", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const req = new Request("http://localhost:3000/api/course?title=Course 1");

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        title: {
          contains: "Course 1",
          mode: "insensitive",
        },
        categories: undefined,
        difficulty: undefined,
        averageRating: undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourses);
  });

  it("should return 200 and the courses when searching by category", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const req = new Request("http://localhost:3000/api/course?categoryId=category1");

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        title: undefined,
        categories: {
          some: {
            categoryId: "category1",
          },
        },
        difficulty: undefined,
        averageRating: undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourses);
  });

  it("should return 200 and the courses when searching by difficulty", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const req = new Request(`http://localhost:3000/api/course?difficulty=${DifficultyLevel.BEGINNER}`);

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        title: undefined,
        categories: undefined,
        difficulty: DifficultyLevel.BEGINNER,
        averageRating: undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourses);
  });

  it("should return 200 and the courses when searching by averageRating", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const req = new Request("http://localhost:3000/api/course?rating=4");

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        title: undefined,
        categories: undefined,
        difficulty: undefined,
        averageRating: {
          gte: 4,
        },
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourses);
  });

  it("should return 404 when no courses are found", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue([]);

    const req = new Request("http://localhost:3000/api/course?title=Nonexistent");

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        title: {
          contains: "Nonexistent",
          mode: "insensitive",
        },
        categories: undefined,
        difficulty: undefined,
        averageRating: undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.message).toBe("No courses found");
  });

  it("should return 500 when an error occurs", async () => {
    (prisma.course.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/course");

    const res = await GET(req);

    expect(prisma.course.findMany).toHaveBeenCalled();
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("GET /api/course/[courseId]", () => {
  const mockCourse = {
    id: "course1",
    title: "Course 1",
    enrollments: [
      {
        user: {
          fullName: "John Doe",
          profileUrl: "https://example.com/profile.jpg",
        },
        progress: {
          progressPct: 75,
        },
      },
    ],
    materials: [
      {
        id: "material1",
        title: "Material 1",
      },
    ],
    categories: [
      {
        category: {
          id: "category1",
          name: "Category 1",
        },
      },
    ],
    instructor: {
      fullName: "Jane Smith",
    },
    assignments: [
      {
        id: "assignment1",
        title: "Assignment 1",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the course data when the course is found", async () => {
    (prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);

    const req = new Request("http://localhost:3000/api/course/course1");
    const params = { courseId: "course1" };

    const res = await SHOW(req, { params });

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: {
        id: "course1",
      },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                fullName: true,
                profileUrl: true,
              },
            },
            progress: {
              select: {
                progressPct: true,
              },
            },
          },
        },
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        instructor: {
          select: {
            fullName: true,
          },
        },
        assignments: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourse);
  });

  it("should return 404 when the course is not found", async () => {
    (prisma.course.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/course/nonexistent");
    const params = { courseId: "nonexistent" };

    const res = await SHOW(req, { params });

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: {
        id: "nonexistent",
      },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                fullName: true,
                profileUrl: true,
              },
            },
            progress: {
              select: {
                progressPct: true,
              },
            },
          },
        },
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        instructor: {
          select: {
            fullName: true,
          },
        },
        assignments: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.message).toBe("No courses found");
  });

  it("should return 500 when there is a server error", async () => {
    (prisma.course.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/course/course1");
    const params = { courseId: "course1" };

    const res = await SHOW(req, { params });

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: {
        id: "course1",
      },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                fullName: true,
                profileUrl: true,
              },
            },
            progress: {
              select: {
                progressPct: true,
              },
            },
          },
        },
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        instructor: {
          select: {
            fullName: true,
          },
        },
        assignments: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("GET /api/course/popular", () => {
  const mockCourses = [
    {
      id: "course1",
      title: "Course 1",
      enrollments: [{ id: "enrollment1" }],
      materials: [
        {
          id: "material1",
          title: "Material 1",
        },
      ],
      categories: [
        {
          category: {
            id: "category1",
            name: "Category 1",
          },
        },
      ],
    },
    {
      id: "course2",
      title: "Course 2",
      enrollments: [{ id: "enrollment2" }],
      materials: [
        {
          id: "material2",
          title: "Material 2",
        },
      ],
      categories: [
        {
          category: {
            id: "category2",
            name: "Category 2",
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the popular courses", async () => {
    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

    const res = await POPULAR();

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockCourses);
  });

  it("should return 500 when there is a server error", async () => {
    (prisma.course.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const res = await POPULAR();

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("GET /api/course/my-course", () => {
  const mockInstructorCourses = [
    {
      id: "course1",
      title: "Course 1",
      instructorId: "instructor1",
      enrollments: [{ id: "enrollment1" }],
      materials: [{ id: "material1", title: "Material 1" }],
      categories: [{ category: { id: "category1", name: "Category 1" } }],
      transactions: [{ id: "transaction1" }],
    },
  ];

  const mockUserCourses = [
    {
      id: "course2",
      title: "Course 2",
      enrollments: [{ id: "enrollment2", userId: "user1" }],
      materials: [{ id: "material2", title: "Material 2" }],
      categories: [{ category: { id: "category2", name: "Category 2" } }],
      transactions: [{ id: "transaction2" }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the instructor's courses when the user is an instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockInstructorCourses);

    const req = new Request("http://localhost:3000/api/course/my-course");

    const res = await MYCOURSE(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        instructorId: "instructor1",
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockInstructorCourses);
  });

  it("should return 200 and the user's courses when the user is a user", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user1", role: Role.USER },
    });

    (prisma.course.findMany as jest.Mock).mockResolvedValue(mockUserCourses);

    const req = new Request("http://localhost:3000/api/course/my-course");

    const res = await MYCOURSE(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        enrollments: {
          some: {
            userId: "user1",
          },
        },
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockUserCourses);
  });

  it("should return 404 when no courses are found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "instructor1", role: "INSTRUCTOR" },
    });

    (prisma.course.findMany as jest.Mock).mockResolvedValue([]);

    const req = new Request("http://localhost:3000/api/course/my-course");

    const res = await MYCOURSE(req);

    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: {
        instructorId: "instructor1",
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.message).toBe("No courses found");
  });

  it("should return 401 when the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/course/my-course");

    const res = await MYCOURSE(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 500 when there is a server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "instructor1", role: "INSTRUCTOR" },
    });

    (prisma.course.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/course/my-course");

    const res = await MYCOURSE(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("POST /api/course/create", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 201 and the created course if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "user-id",
        role: Role.INSTRUCTOR,
      },
    });

    (uploadFileToCloudinary as jest.Mock).mockResolvedValueOnce("thumbnail-url");

    (prisma.course.create as jest.Mock).mockResolvedValueOnce({
      id: "course-id",
      title: "Course Title",
      description: "Course Description",
      syllabus: ["syllabus1", "syllabus2"],
      thumbnailUrl: "thumbnail-url",
      skills: ["skill1", "skill2"],
      instructorId: "user-id",
      difficulty: DifficultyLevel.BEGINNER,
      price: 100,
    });

    (prisma.courseCategory.upsert as jest.Mock).mockResolvedValueOnce({ id: "category-id" });
    (prisma.courseCategoryCourse.createMany as jest.Mock).mockResolvedValueOnce({ count: 1 });

    const formData = new FormData();
    formData.append("title", "Course Title");
    formData.append("description", "Course Description");
    formData.append("difficulty", "beginner");
    formData.append("price", "100");
    formData.append("categoryNames", "Category1");
    formData.append("syllabus", "syllabus1");
    formData.append("skills", "skill1");
    formData.append("file", new Blob([""], { type: "image/jpeg" }), "thumbnail.jpg");

    const req = new Request("http://localhost:3000/api/course/create", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({
      message: "Success",
      data: {
        id: "course-id",
        title: "Course Title",
        description: "Course Description",
        syllabus: ["syllabus1", "syllabus2"],
        thumbnailUrl: "thumbnail-url",
        skills: ["skill1", "skill2"],
        instructorId: "user-id",
        difficulty: DifficultyLevel.BEGINNER,
        price: 100,
      },
    });
  });

  it("should return 400 if an invalid file type is provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "user-id",
        role: Role.INSTRUCTOR,
      },
    });

    const formData = new FormData();
    formData.append("title", "Course Title");
    formData.append("description", "Course Description");
    formData.append("difficulty", "beginner");
    formData.append("price", "100");
    formData.append("categoryNames", "Category1");
    formData.append("syllabus", "syllabus1");
    formData.append("skills", "skill1");
    formData.append("file", new Blob([""], { type: "text/plain" }), "thumbnail.txt");

    const req = new Request("http://localhost:3000/api/course/create", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: "Invalid File Type" });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append("title", "Course Title");
    formData.append("description", "Course Description");

    const req = new Request("http://localhost:3000/api/course/create", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 403 if user is not an instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "user-id",
        role: Role.USER,
      },
    });

    const formData = new FormData();
    formData.append("title", "Course Title");
    formData.append("description", "Course Description");

    const req = new Request("http://localhost:3000/api/course/create", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json).toEqual({ message: "Forbidden" });
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "user-id",
        role: Role.INSTRUCTOR,
      },
    });

    (uploadFileToCloudinary as jest.Mock).mockRejectedValueOnce(new Error("Upload error"));

    const formData = new FormData();
    formData.append("title", "Course Title");
    formData.append("description", "Course Description");

    const req = new Request("http://localhost:3000/api/course/create", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});

describe("POST /api/course/[courseId]/update", () => {
  const mockCourse = {
    id: "course1",
    title: "Course 1",
    description: "Description 1",
    syllabus: ["syllabus1", "syllabus2"],
    thumbnailUrl: "existing-thumbnail-url",
    skills: ["skill1", "skill2"],
    instructorId: "instructor1",
    difficulty: DifficultyLevel.BEGINNER,
    price: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and the updated course if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "instructor1",
        role: Role.INSTRUCTOR,
      },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce(mockCourse);
    (uploadFileToCloudinary as jest.Mock).mockResolvedValueOnce("new-thumbnail-url");
    (prisma.course.update as jest.Mock).mockResolvedValueOnce({
      ...mockCourse,
      title: "Updated Course Title",
      thumbnailUrl: "new-thumbnail-url",
    });

    const formData = new FormData();
    formData.append("title", "Updated Course Title");
    formData.append("difficulty", "intermediate");
    formData.append("price", "150");
    formData.append("file", new Blob([""], { type: "image/jpeg" }), "thumbnail.jpg");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(prisma.course.findUnique).toHaveBeenCalledWith({ where: { id: "course1" } });
    expect(uploadFileToCloudinary).toHaveBeenCalledWith(expect.any(File));
    expect(prisma.course.update).toHaveBeenCalledWith({
      where: { id: "course1" },
      data: {
        title: "Updated Course Title",
        difficulty: DifficultyLevel.INTERMEDIATE,
        price: 150,
        thumbnailUrl: "new-thumbnail-url",
        updatedAt: expect.any(Date),
      },
    });

    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      ...mockCourse,
      title: "Updated Course Title",
      difficulty: DifficultyLevel.INTERMEDIATE,
      price: 150,
      thumbnailUrl: "new-thumbnail-url",
    });
  });

  it("should return 400 if an invalid file type is provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "instructor1",
        role: Role.INSTRUCTOR,
      },
    });

    const formData = new FormData();
    formData.append("title", "Updated Course Title");
    formData.append("file", new Blob([""], { type: "text/plain" }), "thumbnail.txt");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("Invalid File Type");
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append("title", "Updated Course Title");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 403 if the user is not the course instructor", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "different-instructor",
        role: Role.INSTRUCTOR,
      },
    });

    const formData = new FormData();
    formData.append("title", "Updated Course Title");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("should return 404 if the course is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "instructor1",
        role: Role.INSTRUCTOR,
      },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append("title", "Updated Course Title");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Course not found");
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "instructor1",
        role: Role.INSTRUCTOR,
      },
    });

    (prisma.course.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const formData = new FormData();
    formData.append("title", "Updated Course Title");

    const req = new Request("http://localhost:3000/api/course/course1/update", {
      method: "POST",
      body: formData,
    });

    const res = await UPDATE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });
});

describe("POST /api/course/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the deleted course if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "instructor1", role: Role.INSTRUCTOR },
    });

    (prisma.course.delete as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      description: "Description 1",
    });

    const req = new NextRequest("http://localhost:3000/api/course/delete", {
      method: "POST",
      body: JSON.stringify({ courseId: "course1" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(prisma.course.delete).toHaveBeenCalledWith({
      where: { id: "course1" },
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      id: "course1",
      title: "Course 1",
      description: "Description 1",
    });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/course/delete", {
      method: "POST",
      body: JSON.stringify({ courseId: "course1" }),
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

    const req = new NextRequest("http://localhost:3000/api/course/delete", {
      method: "POST",
      body: JSON.stringify({ courseId: "course1" }),
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

    (prisma.course.delete as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/course/delete", {
      method: "POST",
      body: JSON.stringify({ courseId: "course1" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/course/delete", {
      method: "GET",
    });

    const res = await DELETE(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});

describe("POST /api/course/[courseId]/purchase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and the transaction data if successful", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      price: 100,
      instructorId: "instructor1",
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
      fullName: "User One",
      balance: 200,
    });

    (prisma.courseEnrollment.findFirst as jest.Mock).mockResolvedValueOnce(null);

    (prisma.transaction.create as jest.Mock).mockResolvedValueOnce({
      userId: "user1",
      courseId: "course1",
      amount: 100,
      type: TransactionType.PURCHASE,
    });

    (prisma.courseEnrollment.create as jest.Mock).mockResolvedValueOnce({});
    (prisma.user.update as jest.Mock).mockResolvedValueOnce({});
    (createNotification as jest.Mock).mockResolvedValueOnce({});

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: "course1" },
      select: { id: true, title: true, price: true, instructorId: true },
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user1" },
      select: { id: true, fullName: true, balance: true },
    });

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        userId: "user1",
        courseId: "course1",
        amount: 100,
        type: TransactionType.PURCHASE,
      },
    });

    expect(prisma.courseEnrollment.create).toHaveBeenCalledWith({
      data: {
        userId: "user1",
        courseId: "course1",
      },
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user1" },
      data: { balance: { decrement: 100 } },
    });

    expect(createNotification).toHaveBeenCalledWith("instructor1", "User One bought course Course 1", NotificationType.COURSE_PURCHASE);

    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.message).toBe("Success");
    expect(json.data).toEqual({
      userId: "user1",
      courseId: "course1",
      amount: 100,
      type: TransactionType.PURCHASE,
    });
  });

  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe("Not authenticated");
  });

  it("should return 404 if course is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("No courses found");
  });

  it("should return 404 if user is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      price: 100,
      instructorId: "instructor1",
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("No users found");
  });

  it("should return 400 if user balance is insufficient", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      price: 100,
      instructorId: "instructor1",
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
      fullName: "User One",
      balance: 50,
    });

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("Insufficient balance");
  });

  it("should return 400 if the user has already purchased the course", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      price: 100,
      instructorId: "instructor1",
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
      fullName: "User One",
      balance: 200,
    });

    (prisma.courseEnrollment.findFirst as jest.Mock).mockResolvedValueOnce({
      id: "enrollment1",
    });

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("Already purchased this course");
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user1" },
    });

    (prisma.course.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "course1",
      title: "Course 1",
      price: 100,
      instructorId: "instructor1",
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user1",
      fullName: "User One",
      balance: 200,
    });

    (prisma.courseEnrollment.findFirst as jest.Mock).mockResolvedValueOnce(null);

    (prisma.transaction.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "POST",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal Server Error");
  });

  it("should return 405 if the method is not POST", async () => {
    const req = new Request("http://localhost:3000/api/course/course1/purchase", {
      method: "GET",
    });

    const res = await PURCHASE(req, { params: { courseId: "course1" } });

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });
});
