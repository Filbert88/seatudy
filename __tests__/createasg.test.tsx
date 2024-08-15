import { render } from "@testing-library/react";
import CreateAssignmentsPage from "@/app/(dashboard)/create-assignments/page";

// from the Next.js source code...
// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Create Assignments Page", () => {
  it("should render", () => {
    render(<CreateAssignmentsPage />);
  });
});
