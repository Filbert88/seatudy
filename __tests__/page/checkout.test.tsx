import { render, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import CheckOutPage from "@/app/(user)/checkout/page";

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

describe("CheckOut Page", () => {
  it("should render", async () => {
    await waitFor(() => {
      render(
        <SessionProvider session={mockSession}>
          <CheckOutPage />
        </SessionProvider>
      );
    });
  });
});

// ini masih failed
