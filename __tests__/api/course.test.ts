import { GET } from "@/app/api/course/route";
import { GET as SHOW } from "@/app/api/course/[courseId]/route";
import { GET as POPULAR } from "@/app/api/course/popular/route";
import { GET as MYCOURSE } from "@/app/api/course/my-course/route";
import { prisma } from "@/lib/prisma";
import { DifficultyLevel, Role } from "@prisma/client";
import { getServerSession } from "next-auth";

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
  },
}));

jest.mock("@/lib/cloudinary", () => ({
  uploadFileToCloudinary: jest.fn(),
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
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
