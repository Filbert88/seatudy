import { render } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import AssignmentPage from "@/app/(user)/view-assignment/page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: jest.fn(),
    };
  },
  useSearchParams: () => ({
    get: () => {},
  }),
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

describe("View Assignment Page", () => {
  it("should render", () => {
    render(
      <SessionProvider session={mockSession}>
        <AssignmentPage />
      </SessionProvider>
    );
  });
});
