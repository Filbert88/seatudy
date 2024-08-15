import { render } from "@testing-library/react";
import InstructorDashboard from "@/app/(dashboard)/instructor-dashboard/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Instructor Dashboard Page", () => {
  it("should render", () => {
    render(<InstructorDashboard />);
  });
});
