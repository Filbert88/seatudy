"use client";
import { useState } from "react";
import CoursesBar from "../components/assignments/coursesBar";
import Instructions from "../components/assignments/instructions";
import Navbar from "../components/navbar";
import Submission from "../components/assignments/submission";

const dummyMaterials = [
  "Quick Introduction",
  "Algorithm & Basic Logics",
  "Object Oriented Programming",
  "DOM Manipulation",
];

const dummyAssignments = [
  "Basic Arithmetic Calculator",
  "To Do List Application",
  "Javascript Quiz",
];

const dummyInstructions =
  "**Create a simple to-do list application using JavaScript.** *The application should have the following features*:\n\n- Add a new task\n- Mark a task as completed\n- Delete a task\n- Edit a task\n\nYou can use any front-end framework or library to build the application. The application should be responsive and user-friendly. You can use any CSS framework to style the application. The application should be hosted on a public URL. You can use any hosting platform to host the application. The application should be accessible via the URL provided in the submission. The application should be built using JavaScript, HTML, and CSS. You can use any front-end framework or library to build the application. The application should be responsive and user-friendly. You can use any CSS framework to style the application. The application should be hosted on a public URL. You can use any hosting platform to host the application. The application should be accessible via the URL provided in the submission.";

const AssignmentPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const handleClickInstructions = () => {
    setShowInstructions(true);
    setShowSubmissions(false);
  };
  const handleClickSubmissions = () => {
    setShowInstructions(false);
    setShowSubmissions(true);
  };
  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="flex flex-row py-20 pl-64">
        <CoursesBar
          title="Introduction to Javascript"
          materials={dummyMaterials}
          assignments={dummyAssignments}
        />
        <div className="flex flex-col ">
          <div className="my-5 ml-10 font-nunito font-bold text-3xl">
            Assignment 2: To do list application
          </div>
          <div className="flex flex-row font-nunito font-semibold mx-10 space-x-5">
            <button
              onClick={handleClickInstructions}
              className={`px-2 ${
                showInstructions ? "border-b-2 border-cyan-500 font-bold" : ""
              }`}
            >
              Instructions
            </button>
            <button
              onClick={handleClickSubmissions}
              className={`px-2 ${
                showSubmissions ? "border-b-2 border-cyan-500 font-bold" : ""
              }`}
            >
              Submissions
            </button>
          </div>
          <hr className="border-t-2 border-gray-300 mx-10 mt-3 mb-5 min-w-[150vh]" />
          <div className="ml-10">
            {showInstructions && (
              <Instructions>{dummyInstructions}</Instructions>
            )}
            {showSubmissions && <Submission />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentPage;
