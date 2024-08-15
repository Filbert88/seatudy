import { render } from "@testing-library/react";
import MaterialsPage from "@/app/(user)/learning-material/page";
import ErrorBoundary from "@/components/error-boundaries/error-boundary";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams: () => new URLSearchParams(), // Mock implementation
}));

jest.mock("node-fetch", () => jest.fn());

describe("Learning Material Page", () => {
  it("should render", () => {
    render(
      <ErrorBoundary>
        <MaterialsPage />
      </ErrorBoundary>
    );
  });
});
