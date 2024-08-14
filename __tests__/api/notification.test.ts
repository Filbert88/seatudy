import { GET } from "@/app/api/notification/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("GET /api/notification", () => {
  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/notification");
    const res = await GET(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 404 if no notifications are found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.notification.findMany as jest.Mock).mockResolvedValueOnce([]);

    const req = new Request("http://localhost/api/notification");
    const res = await GET(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "No notifications found" });
  });

  it("should return 200 and notifications if found", async () => {
    const mockNotifications = [{ id: "notification-id", title: "Test Notification", content: "This is a test notification." }];

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.notification.findMany as jest.Mock).mockResolvedValueOnce(mockNotifications);

    const req = new Request("http://localhost/api/notification");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockNotifications);
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.notification.findMany as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost/api/notification");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});
