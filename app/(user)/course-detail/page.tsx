"use client";
import { useEffect, useState } from "react";
import Card from "@/components/courses/card";
import { CourseDetailsInterface } from "@/components/types/types";
import { useSession } from "next-auth/react";
import { getInstructorNamebyId } from "@/lib/queries/profile";
import LoadingBouncer from "./loading";

const CoursesDetailPage = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [courseId, setCourseId] = useState<string>("");
  const { data: session, status } = useSession();
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

    const checkIfUserIsLoggedIn = () => {
      if (status === "authenticated") {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkIfUserIsLoggedIn();
  }, [courseId, courseDetailUrl, status]);

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number) + ".00";
  };


  if (isLoading) {
    return <LoadingBouncer />;
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Course details not available.</p>
      </div>
    );
  }

  const outline = courseDetails?.skills?.map((item, index) => {
    return (
      <li key={index} className="my-2">
        {item}
      </li>
    );
  });

  return (
    <>
      <div className="bg-secondary px-40 pt-20 pb-5">
        <h1 className="font-nunito font-bold text-4xl mx-5 pt-10 text-primary max-w-[100vh]">
          {courseDetails.title}
        </h1>
        <div className="flex flex-row w-[50%]">
          <p className="font-nunito font-bold text-lg text-primary mx-5 py-5 max-w-[100vh]">
            {courseDetails.description}
          </p>
        </div>
        <div className="flex flex-row font-bold text-primary space-x-20 mx-5">
          <p>Difficulty: {courseDetails.difficulty}</p>
          <p>Instructor: {courseDetails.instructor.fullName}</p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse px-40">
        <div className=" border-black border-2 px-5 py-4 m-5 w-[75%]">
          <h1 className="font-nunito font-bold text-2xl">
            What you’ll learn from this course
          </h1>
          <ul
            className="font-nunito font-bold list-disc pl-8"
          >
            {outline}
          </ul>
        </div>
        <div className="px-5 py-4 m-5 w-[50%]">
          <div className="px-5 py-4 m-5 max-w-[50%] z-0">
            <Card
              courseId={courseDetails.id}
              thumbnailUrl={courseDetails.thumbnailUrl}
              price={formatNumber(courseDetails.price)}
              isLogin={isLogin}
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
