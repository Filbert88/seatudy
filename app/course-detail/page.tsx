"use client";
import { useEffect, useState } from "react";
import Card from "../components/courses/card";
import Navbar from "../components/navbar";
import { CourseDetailsInterface } from "../components/types/types";

const CoursesDetailPage = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState<string>("");
  const courseDetailUrl = `/api/course/${courseId}`;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  useEffect(() => {
    const getCoursesDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(courseDetailUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setCourseDetails(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      getCoursesDetail();
    }
  }, [courseId, courseDetailUrl]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Course details not available.</p>
      </div>
    );
  }

  const outline = courseDetails?.syllabus?.map((item, index) => {
    return (
      <li key={index} className="my-2">
        {item}
      </li>
    );
  });
  return (
    <>
      <Navbar />
      <div className="bg-secondary px-40 pt-20 pb-5">
        <h1 className="font-nunito font-bold text-4xl mx-5 pt-10 text-primary">
          {courseDetails.title}
        </h1>
        <div className="flex flex-row w-[50%]">
          <p className="font-nunito font-bold text-lg text-primary mx-5 py-5">
            {courseDetails.description}
          </p>
        </div>
        <div className="flex flex-row font-bold text-primary space-x-20 mx-5">
          <p>Difficulty: {courseDetails.difficulty}</p>
          <p>Instructor: {courseDetails.instructorId}</p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse">
        <div className=" border-black border-2 px-5 py-4 m-5 ml-[25vh] w-full order-2 md:order-1">
          <h1 className="font-nunito font-bold text-2xl">
            What you’ll learn from this course
          </h1>
          <ul
            className="font-nunito font-bold"
            style={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            {outline}
          </ul>
        </div>
        <div className="px-5 py-4 m-5 w-full order-1 md:order-2 z-50">
          <div className="px-5 py-4 m-5 w-[50%] z-1">
            <Card
              thumbnailUrl={courseDetails.thumbnailUrl}
              price={courseDetails.price}
              isLogin={false}
              averageRating={courseDetails.averageRating}
              syllabus={courseDetails.syllabus}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesDetailPage;
