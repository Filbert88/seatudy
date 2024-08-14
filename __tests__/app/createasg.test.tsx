import { render, screen } from "@testing-library/react";
import CreateAssignmentsPage from "@/app/(dashboard)/create-assignments/page";

describe("Create Assignments Page", () => {
  it("should render", () => {
    render(<CreateAssignmentsPage />);
    expect(screen.getByText("Upload Assignment")).toBeInTheDocument();
  });
});
