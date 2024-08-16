import { render } from "@testing-library/react";
import UserNotificationPage from "@/app/(user)/notification-page/page";

describe("User Notification Page", () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it("should render", () => {
    render(<UserNotificationPage />);
  });
});
