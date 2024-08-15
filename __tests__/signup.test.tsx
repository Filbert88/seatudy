import { render, screen } from "@testing-library/react";
import SignupForm from "@/app/(auth)/auth/signup/signUpForm";

describe("Sign Up Form", () => {
  it("should render", () => {
    render(<SignupForm />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });
});
