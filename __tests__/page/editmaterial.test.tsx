import { render } from "@testing-library/react";
import EditMaterialPage from "@/app/(dashboard)/edit-materials/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Edit Material Page", () => {
  it("should render", () => {
    render(<EditMaterialPage />);
  });
});
