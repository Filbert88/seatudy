import { render } from "@testing-library/react";
import ReviewPage from "@/app/(user)/review-course/page";
import { SessionProvider } from "next-auth/react";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: jest.fn(),
    };
  },
}));

jest.mock("node-fetch", () => jest.fn());

const mockSession = {
  user: {
    name: "test",
    email: "test@gmail.com",
    role: "USER",
    id: "1",
  },
  expires: "",
};

describe("Review Page", () => {
  it("should render", () => {
    render(
      <SessionProvider session={mockSession}>
        <ReviewPage />
      </SessionProvider>
    );
  });
});

// Ini masih failed
