import { render, screen } from "@testing-library/react";
import EditMaterialPage from "@/app/(dashboard)/edit-materials/page";

describe("Edit Material Page", () => {
  it("should render", () => {
    render(<EditMaterialPage />);
    expect(screen.getByText("Editing a Course Material")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Previous material: ")).toBeInTheDocument();
    expect(screen.getByText("Upload new material")).toBeInTheDocument();
    expect(screen.getByText("Drag and drop file here or")).toBeInTheDocument();
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });
});
