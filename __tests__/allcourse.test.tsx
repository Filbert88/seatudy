import { render } from "@testing-library/react";
import Home from "@/app/(user)/all-courses/page";

// Mock next/navigation module
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

describe("All Courses Page", () => {
  it("should render", () => {
    render(<Home />);
  });
});
