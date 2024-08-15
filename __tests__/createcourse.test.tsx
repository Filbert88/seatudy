import { render } from "@testing-library/react";
import CreateCourse from "@/app/(dashboard)/create-courses/page";

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Create Course Page", () => {
  it("should render", () => {
    render(<CreateCourse />);
  });
});
