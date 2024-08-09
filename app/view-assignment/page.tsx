"use client";
import { useEffect, useState } from "react";
import CoursesBar from "../components/assignments/coursesBar";
import Instructions from "../components/assignments/instructions";
import Navbar from "../components/navbar";
import Submission from "../components/assignments/submission";
import { CourseInterface } from "../components/types/types";
import { BounceLoader } from "react-spinners";

let AssignmentTitle = "Assignment 2: To do list application";
let CourseTitle = "Introduction to Javascript";

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
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState<number>(0);
  const [courseData, setCourseData] = useState<CourseInterface>();


  const handleClickInstructions = () => {
    setShowInstructions(true);
    setShowSubmissions(false);
  };
  const handleClickSubmissions = () => {
    setShowInstructions(false);
    setShowSubmissions(true);
  };

  const getCourses = async (id: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/${id}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
      });
      const data = await response.json();
      setCourseData(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    const index = new URLSearchParams(window.location.search).get('index');
    setIndex(parseInt(index ?? '0'));
    if (id) {
      getCourses(id);
    }
  }, [])

  return (
    <>
      {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center"><BounceLoader color='#393E46'/></div>}
      <Navbar />
      <div className="flex flex-row py-20 pl-64">
        <CoursesBar
          title={courseData?.title || ""}
          materials={courseData?.materials.map((material) => material.title) || []}
          assignments={courseData?.assignments?.map((assignment) => assignment.title) || []}
          active={{ type: "assignments", index: index }}
        />
        {!isLoading &&
          <div className="flex flex-col ">
            <div className="my-5 ml-10 font-nunito font-bold text-3xl">
              {`Assignment ${index + 1}: ${courseData?.assignments?.[index].title}`}
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
                <Instructions>{courseData?.assignments?.[index].description ?? "No instructions given"}</Instructions>
              )}
              {showSubmissions && <Submission />}
            </div>
          </div>
        }
      </div>
      
    </>
  );
};

export default AssignmentPage;
