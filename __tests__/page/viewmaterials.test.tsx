import { render } from "@testing-library/react";
import ViewMaterialsPage from "@/app/(dashboard)/view-materials/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("View Materials Page", () => {
  it("should render", () => {
    render(<ViewMaterialsPage />);
  });
});
