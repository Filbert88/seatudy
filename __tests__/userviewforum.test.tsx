import { render } from "@testing-library/react";
import ViewForumPage from "@/app/(user)/view-forum/forum-page";

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
    render(<ViewForumPage session={mockSession} />);
  });
});
