import { render } from "@testing-library/react";
import SignupForm from "@/app/(auth)/auth/signup/signUpForm";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Sign Up Form", () => {
  it("should render", () => {
    render(<SignupForm />);
  });
});
