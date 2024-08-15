import { render, waitFor } from "@testing-library/react";
import CoursesDetailPage from "@/app/(user)/course-detail/page";
import { SessionProvider } from "next-auth/react";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

jest.mock("node-fetch", () => jest.fn());

const mockSession = {
  user: {
    name: "test",
    email: "test@gmail.com",
    role: "USER",
    id: "1",
  },
  expires: "",
};

describe("CheckOut Page", () => {
  it("should render", async () => {
    await waitFor(() => {
      render(
        <SessionProvider session={mockSession}>
          <CoursesDetailPage />
        </SessionProvider>
      );
    });
  });
});

// ini masih failed
