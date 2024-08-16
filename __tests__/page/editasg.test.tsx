import { render } from "@testing-library/react";
import EditAssignmentPage from "@/app/(dashboard)/edit-assignments/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Edit Assignment Page", () => {
  it("should render", () => {
    render(<EditAssignmentPage />);
  });
});
