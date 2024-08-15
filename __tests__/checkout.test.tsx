import { render } from "@testing-library/react";
import CheckOutPage from "@/app/(user)/checkout/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("CheckOut Page", () => {
  it("should render", () => {
    render(<CheckOutPage />);
  });
});
