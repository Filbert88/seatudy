"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import CoursesBar from "../components/assignments/coursesBar";
import Instructions from "../components/assignments/instructions";
import React from "react";
import PdfViewer from "../components/pdf-viewer";

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
  const index = 1;
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      setCourseId(id);
    } 
  }, []);

  return (
    <>
      <div className=" min-h-screen w-screen flex flex-row bg-primary text-secondary">
        <Navbar isLoggedIn={true} />
        <CoursesBar
          title="Introduction to Javascript"
          materials={dummyMaterials}
          assignments={dummyAssignments}
        />
        <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
          <div className="my-5 font-nunito font-bold text-3xl">
            {`Chapter ${index + 1}: ${dummyMaterials[index]}`}
          </div>
          <div className='flex h-full pb-20'>
            <PdfViewer url={"https://res.cloudinary.com/dl2cqncwz/raw/upload/v1723020884/kl5xknareeipcu89brtq.pdf"} className="flex-grow flex w-full"/>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentPage;
