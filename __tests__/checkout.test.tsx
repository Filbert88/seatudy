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

describe("CheckOut Page", () => {
  it("should render", async () => {
    await waitFor(() => {
      render(
        <SessionProvider>
          <CheckOutPage />
        </SessionProvider>
      );
    });
  });
});
