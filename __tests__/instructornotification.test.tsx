import { render } from "@testing-library/react";
import InstructorNotificationPage from "@/app/(dashboard)/instructor-notification-page/page";

describe("Instructor Notification Page", () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    // Save the original console.error function
    originalConsoleError = console.error;
    // Mock console.error to suppress error messages in tests
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore the original console.error function
    console.error = originalConsoleError;
  });

  it("should render", () => {
    render(<InstructorNotificationPage />);
  });
});
