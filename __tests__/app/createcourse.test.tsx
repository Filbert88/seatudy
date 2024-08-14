import { render, screen } from "@testing-library/react";
import CreateCourse from "@/app/(dashboard)/create-courses/page";

describe("Create Course Page", () => {
  it("should render", () => {
    render(<CreateCourse />);
    expect(screen.getByText("Creating a new course")).toBeInTheDocument();
    expect(screen.getByText("Course Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Syllabus")).toBeInTheDocument();
    expect(screen.getByText("Developed skills")).toBeInTheDocument();
    expect(screen.getByText("Difficulty:")).toBeInTheDocument();
    expect(screen.getByText("Create course")).toBeInTheDocument();
  });
});
