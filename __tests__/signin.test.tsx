import { render, screen } from "@testing-library/react";
import SigninForm from "@/app/(auth)/auth/signin/signInForm";

describe("Sign In Form", () => {
  it("should render", () => {
    render(<SigninForm />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
