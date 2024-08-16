import { render } from "@testing-library/react";
import ViewForumPage from "@/app/(user)/view-forum/forum-page";
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

describe("View Forum Page", () => {
  it("should render", () => {
    render(
      <SessionProvider session={mockSession}>
        <ViewForumPage session={mockSession} />
      </SessionProvider>
    );
  });
});
