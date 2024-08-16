import { render } from "@testing-library/react";
import InstructorNotificationPage from "@/app/(dashboard)/instructor-notification-page/page";

describe("Instructor Notification Page", () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it("should render", () => {
    render(<InstructorNotificationPage />);
  });
});
