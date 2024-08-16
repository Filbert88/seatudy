import { render, waitFor } from "@testing-library/react";
import CreateCourse from "@/app/(dashboard)/create-courses/page";
import { SessionProvider } from "next-auth/react";

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

const mockSession = {
  user: {
    name: "test",
    email: "test@gmail.com",
    role: "INSTRUCTOR",
    id: "1",
  },
  expires: "",
};

// pake fetch nanti disini

describe("Create Course Page", () => {
  it("should render", async () => {
    await waitFor(() =>
      render(
        <SessionProvider session={mockSession}>
          <CreateCourse />
        </SessionProvider>
      )
    );
  });
});

// Ini yg masih failed
