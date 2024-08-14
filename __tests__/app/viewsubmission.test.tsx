import { render, screen } from "@testing-library/react";
import ViewSubmissionsPage from "@/app/(dashboard)/view-submissions/page";

describe("View Submissions Page", () => {
  it("should render", () => {
    render(<ViewSubmissionsPage />);
    expect(screen.getByText("Create new task")).toBeInTheDocument();
    expect(screen.getByText("View Submissions")).toBeInTheDocument();
  });
});
