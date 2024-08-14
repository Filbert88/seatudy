import { GET } from "@/app/api/notification/route";
import { POST } from "@/app/api/notification/read/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("GET /api/notification", () => {
  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/notification");
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

    const req = new Request("http://localhost:3000/api/notification");
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

    const req = new Request("http://localhost:3000/api/notification");
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

    const req = new NextRequest("http://localhost:3000/api/notification");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});

describe("POST /api/notification/read", () => {
  it("should return 405 if method is not POST", async () => {
    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "GET",
    });

    const res = await POST(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });

  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: "notification-id" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 404 if notification is not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.notification.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: "non-existent-id" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ message: "Notification not found" });
  });

  it("should return 403 if the notification does not belong to the user", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    const mockNotification = {
      id: "notification-id",
      userId: "another-user-id",
      read: false,
    };

    (prisma.notification.findUnique as jest.Mock).mockResolvedValueOnce(mockNotification);

    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: "notification-id" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json).toEqual({ message: "Forbidden" });
  });

  it("should return 200 and mark the notification as read if it belongs to the user", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    const mockNotification = {
      id: "notification-id",
      userId: "user-id",
      read: false,
    };

    (prisma.notification.findUnique as jest.Mock).mockResolvedValueOnce(mockNotification);
    (prisma.notification.update as jest.Mock).mockResolvedValueOnce({
      ...mockNotification,
      read: true,
    });

    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: "notification-id" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("Notification marked as read");
    expect(json.data.read).toBe(true);
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.notification.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new NextRequest("http://localhost:3000/api/notification/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: "notification-id" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});
