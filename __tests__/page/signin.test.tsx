import { render } from "@testing-library/react";
import SigninForm from "@/app/(auth)/auth/signin/signInForm";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Sign In Form", () => {
  it("should render", () => {
    render(<SigninForm />);
  });
});
