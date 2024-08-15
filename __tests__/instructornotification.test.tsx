import { render, screen } from "@testing-library/react";
import InstructorNotificationPage from "@/app/(dashboard)/instructor-notification-page/page";

describe("Instructor Notification Page", () => {
  it("should render", () => {
    render(<InstructorNotificationPage />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});
