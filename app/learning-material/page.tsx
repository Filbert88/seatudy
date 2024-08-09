"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import CoursesBar from "../components/assignments/coursesBar";
import React from "react";
import PdfViewer from "../components/pdf-viewer";
import { CourseInterface } from "../components/types/types";
import { BounceLoader } from "react-spinners";

const dummyAssignments = [
  "Basic Arithmetic Calculator",
  "To Do List Application",
  "Javascript Quiz",
];

const MaterialsPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseData, setCourseData] = useState<CourseInterface>();

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
      setCourseId(id);
      getCourses(id);
    }
  }, []);

  return (
    <>
      {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center"><BounceLoader color='#393E46'/></div>}
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary">
        <Navbar isLoggedIn={true} />
        <CoursesBar
          title={courseData?.title || ""}
          materials={courseData?.materials.map((material) => material.title) || []}          
          assignments={dummyAssignments}
        />
        {!isLoading && 
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
            <div className="my-5 font-nunito font-bold text-3xl">
              {`Chapter ${index + 1}: ${courseData?.materials[index].title}`}
            </div>
            <div className='flex h-full pb-20'>
              <PdfViewer url={courseData?.materials[index]?.url ?? "null"} className="flex-grow flex w-full"/>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default MaterialsPage;
