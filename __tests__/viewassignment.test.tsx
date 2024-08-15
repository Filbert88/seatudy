import { render } from "@testing-library/react";
import ViewAssignmentPage from "@/app/(dashboard)/view-assignments/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("View Assignment Page", () => {
  it("should render", () => {
    render(<ViewAssignmentPage />);
  });
});
