"use client";
import { useState } from "react";
import CoursesBar from "../components/assignments/coursesBar";
import Instructions from "../components/assignments/instructions";

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
      <div className="flex flex-row">
        <CoursesBar
          title="Introduction to Javascript"
          materials={dummyMaterials}
          assignments={dummyAssignments}
        />
        <div className="flex flex-col ml-[15rem]">
          <div className="my-5 ml-10 font-nunito font-bold text-3xl">
            Assignment 2: To do list application
          </div>
          <div className="flex flex-row font-nunito font-semibold mx-10 space-x-5">
            <button onClick={handleClickInstructions}>Instructions</button>
            <button onClick={handleClickSubmissions}>Submissions</button>
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
