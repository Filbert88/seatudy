import { render } from "@testing-library/react";
import SigninForm from "@/app/(auth)/auth/signin/signInForm";

describe("Sign In Form", () => {
  it("should render", () => {
    render(<SigninForm />);
  });
});
