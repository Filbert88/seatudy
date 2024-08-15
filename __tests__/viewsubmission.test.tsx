import { render } from "@testing-library/react";
import ViewSubmissionsPage from "@/app/(dashboard)/view-submissions/page";

describe("View Submissions Page", () => {
  it("should render", () => {
    render(<ViewSubmissionsPage />);
  });
});
