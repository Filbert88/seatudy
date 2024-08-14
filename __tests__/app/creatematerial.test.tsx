import { render, screen } from "@testing-library/react";
import CreateMaterial from "@/app/(dashboard)/create-materials/page";

describe("Create Material Page", () => {
  it("should render", () => {
    render(<CreateMaterial />);
    expect(screen.getByText("Create Material")).toBeInTheDocument();
    expect(screen.getByText("Drag and drop file here or")).toBeInTheDocument();
    expect(screen.getByText("Supported formats: **.pdf**")).toBeInTheDocument();
    expect(screen.getByText("Upload Material")).toBeInTheDocument();
  });
});
