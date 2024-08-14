import { render, screen } from "@testing-library/react";
import ViewAssignmentPage from "@/app/(dashboard)/view-assignments/page";

describe("View Assignment Page", () => {
  it("should render", () => {
    render(<ViewAssignmentPage />);
    expect(screen.getByText("Create new task")).toBeInTheDocument();
    expect(screen.getByText("View Submissions")).toBeInTheDocument();
  });
});
