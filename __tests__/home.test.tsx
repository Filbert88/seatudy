import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Home from "@/app/(user)/(home)/main-client";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Home Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("should render the home page", () => {
    render(<Home initialCourseData={[]} session={null} />);
    const title = screen.getByText(/Welcome back/i);
    expect(title).toBeInTheDocument();
  });

  it("should navigate to sign in page when login button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<Home initialCourseData={[]} session={null} />);
    const loginButton = screen.getByText(/I have an account/i);
    loginButton.click();

    expect(pushMock).toHaveBeenCalledWith("/auth/signin");
  });

  it("should navigate to sign up page when register button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<Home initialCourseData={[]} session={null} />);
    const registerButton = screen.getByText(/Join for free/i);
    registerButton.click();

    expect(pushMock).toHaveBeenCalledWith("/auth/signup");
  });
});
