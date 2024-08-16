import { render } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import MyCoursesPage from "@/app/(user)/my-courses/page";

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

describe("My Courses Page", () => {
  it("should render", () => {
    render(
      <SessionProvider session={mockSession}>
        <MyCoursesPage />
      </SessionProvider>
    );
  });
});

// Ini masih failed
