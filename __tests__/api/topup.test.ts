import { POST } from "@/app/api/topup/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { TransactionType } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    transaction: {
      create: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("POST /api/topup", () => {
  it("should return 405 if method is not POST", async () => {
    const req = new Request("http://localhost:3000/api/topup", {
      method: "GET",
    });

    const res = await POST(req);

    expect(res.status).toBe(405);
    const text = await res.text();
    expect(text).toBe("Method GET Not Allowed");
  });

  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/topup", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        cardNumber: "1234567890123456",
        expirationDate: "12/25",
        cvc: "123",
        cardHolderName: "John Doe",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: "Not authenticated" });
  });

  it("should return 201 and create a transaction if input is valid", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    const mockTransaction = {
      id: "transaction-id",
      amount: 100,
      type: TransactionType.DEPOSIT,
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValueOnce(mockTransaction);

    const req = new Request("http://localhost:3000/api/topup", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        cardNumber: "1234567890123456",
        expirationDate: "12/25",
        cvc: "123",
        cardHolderName: "John Doe",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.message).toBe("Success");
    expect(json.data).toEqual(mockTransaction);
  });

  it("should update the user's balance after a successful transaction", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    const mockTransaction = {
      id: "transaction-id",
      amount: 100,
      type: TransactionType.DEPOSIT,
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValueOnce(mockTransaction);

    const req = new Request("http://localhost:3000/api/topup", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        cardNumber: "1234567890123456",
        expirationDate: "12/25",
        cvc: "123",
        cardHolderName: "John Doe",
      }),
    });

    await POST(req);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: {
        balance: {
          increment: 100,
        },
      },
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { id: "user-id" },
    });

    (prisma.transaction.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const req = new Request("http://localhost:3000/api/topup", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        cardNumber: "1234567890123456",
        expirationDate: "12/25",
        cvc: "123",
        cardHolderName: "John Doe",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});
