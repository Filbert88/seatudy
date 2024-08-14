// import "@testing-library/jest-dom";
// import { render, screen } from "@testing-library/react";
// import Home from "@/app/(user)/(home)/main-client";

// jest.mock("next/navigation", () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
// }));

// const mockCourseData = [
//   {
//     id: "1",
//     title: "Test Course",
//     materials: [{ id: "material1" }],
//     averageRating: 4.5,
//     skills: ["Skill1", "Skill2"],
//     enrollments: [1, 2, 3],
//     difficulty: "Intermediate",
//     thumbnailUrl: "https://example.com/image.png",
//   },
// ];

// const mockSession = {
//   user: { name: "John Doe" },
//   expires: "2024-01-01",
// };

// describe("Home Page", () => {
//   it("renders the logged-in heading", () => {
//     render(<Home initialCourseData={mockCourseData} session={mockSession} />);

//     const heading = screen.getByText(`Welcome back, ${mockSession.user.name}! Ready to continue your journey?`);

//     expect(heading).toBeInTheDocument();
//   });

//   it("renders the logged-out heading", () => {
//     render(<Home initialCourseData={mockCourseData} session={null} />);

//     const heading = screen.getByText(/Elevate your skills with/i);

//     expect(heading).toBeInTheDocument();
//   });

//   it("renders a list of courses", () => {
//     render(<Home initialCourseData={mockCourseData} session={mockSession} />);

//     const courseTitle = screen.getByText(mockCourseData[0].title);
//     expect(courseTitle).toBeInTheDocument();
//   });

//   it("renders the 'See More Courses' button", () => {
//     render(<Home initialCourseData={mockCourseData} session={mockSession} />);

//     const seeMoreButton = screen.getByText(/See More Courses/i);
//     expect(seeMoreButton).toBeInTheDocument();
//   });
// });
