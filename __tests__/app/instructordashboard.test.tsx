import { render, screen } from "@testing-library/react";
import InstructorDashboard from "@/app/(dashboard)/instructor-dashboard/page";

describe("Instructor Dashboard Page", () => {
  it("should render", () => {
    render(<InstructorDashboard />);
    expect(screen.getByText("Currently Active Courses")).toBeInTheDocument();
    expect(screen.getByText("Create a new course")).toBeInTheDocument();
  });
});
