import { render } from "@testing-library/react";
import Home from "@/app/(user)/all-courses/page";

// Mock useRouter:
jest.mock("next/router", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("All Courses Page", () => {
  it("should render", () => {
    render(<Home />);
  });
});
