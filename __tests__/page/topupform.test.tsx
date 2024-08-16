import { render } from "@testing-library/react";
import TopUpFormPage from "@/app/(user)/topup-form/page";
import { SessionProvider } from "next-auth/react";

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

describe("Top Up Form Page", () => {
  it("should render", () => {
    render(
      <SessionProvider session={mockSession}>
        <TopUpFormPage />
      </SessionProvider>
    );
  });
});

// ini masih failed
