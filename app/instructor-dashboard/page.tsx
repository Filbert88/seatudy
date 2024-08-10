"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CourseInterface } from "../components/types/types";
import { BounceLoader } from "react-spinners";
import CoursesCard from "../components/courses-card";

const InstructorDashboard = () => {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    // validation if user is not an instructor
    if (status === "authenticated" && session?.user.role !== "INSTRUCTOR") {
      router.push("/");
    }

    // fetch all courses created by the instructor
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/course/my-course", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setCourseData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [router, session, status]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  console.log(courseData);
  return (
    <>
      <Navbar />
      {/* <div className="flex-grow mx-20 my-5">
        <div className="font-bold text-2xl mb-5">Explore our courses</div>
        <div className="flex">
          {courseData.map((course, index) => (
            <CoursesCard
              key={index}
              courseTitle={course.title}
              totalChapters={course.materials.length}
              rating={course.averageRating}
              skills={course.skills}
              totalEnrolled={course.enrollments.length}
              difficulty={course.difficulty}
              thumbnailURL={course.thumbnailUrl}
              className="mr-5 mb-5"
              onClick={() => router.push(`/course-detail?id=${course.id}`)}
            />
          ))}
        </div>
      </div> */}
    </>
  );
};

export default InstructorDashboard;
