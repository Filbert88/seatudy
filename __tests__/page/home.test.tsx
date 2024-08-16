import { render } from "@testing-library/react";
import Home from "@/app/(user)/(home)/main-client";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
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

describe("Home Page", () => {
  it("should render the home page", () => {
    render(<Home initialCourseData={[]} session={mockSession} />);
  });
});
