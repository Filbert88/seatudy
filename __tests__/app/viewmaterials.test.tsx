import { render, screen } from "@testing-library/react";
import ViewMaterialsPage from "@/app/(dashboard)/view-materials/page";

describe("View Materials Page", () => {
  it("should render", () => {
    render(<ViewMaterialsPage />);
    expect(screen.getByText("Create new material")).toBeInTheDocument();
  });
});
