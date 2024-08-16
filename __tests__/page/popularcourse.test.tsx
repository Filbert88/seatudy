import { render } from "@testing-library/react";
import Home from "@/app/(user)/popular-courses/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: jest.fn(),
    };
  },
}));

jest.mock("node-fetch", () => jest.fn());

describe("Popular Courses Page", () => {
  it("should render", () => {
    render(<Home />);
  });
});
