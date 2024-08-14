import { render, screen } from "@testing-library/react";
import EditAssignmentPage from "@/app/(dashboard)/edit-assignments/page";

describe("Edit Assignment Page", () => {
  it("should render", () => {
    render(<EditAssignmentPage />);
    expect(screen.getByText("Editing an Assignment")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });
});
