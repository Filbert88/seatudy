import { render, screen } from "@testing-library/react";
import MyCoursesPage from "@/app/(user)/my-courses/page";

describe("My Courses Page", () => {
  it("should render", () => {
    render(<MyCoursesPage />);
    expect(screen.getByText("Your Course")).toBeInTheDocument();
  });
});
