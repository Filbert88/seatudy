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

// pake fetch nanti disini

describe("Create Course Page", () => {
  it("should render", async () => {
    await waitFor(() =>
      render(
        <SessionProvider>
          <CreateCourse />
        </SessionProvider>
      )
    );
  });
});
