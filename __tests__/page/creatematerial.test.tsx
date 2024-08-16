import { render } from "@testing-library/react";
import CreateMaterial from "@/app/(dashboard)/create-materials/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Create Material Page", () => {
  it("should render", () => {
    render(<CreateMaterial />);
  });
});
