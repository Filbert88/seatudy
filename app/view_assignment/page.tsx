"use client";
import { useState } from "react";
import CoursesBar from "../components/assignments/coursesBar";
import Instructions from "../components/assignments/instructions";
import Navbar from "../components/navbar";

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
      <div className="flex flex-row py-20">
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
            {showInstructions && <Instructions />}
            {showSubmissions && <div>Submissions</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentPage;
