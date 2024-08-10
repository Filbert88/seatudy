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
        if (response.ok) {
          const data = await response.json();
          setCourseData(data.data);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <div className="font-nunito font-extrabold mx-20 flex items-center justify-between mt-5">
          <div className="text-3xl mr-auto">Currently Active Courses</div>
          <button
            className="rounded-md text-background bg-fourth px-4 py-2 h-fit font-nunito text-white font-semibold"
            type="button"
            onClick={() => router.push("/create-courses")}
          >Create a new course
          </button>
        </div>
        {courseData.length === 0 ? (
        <div className="text-2xl font-nunito font-semibold mt-10 mx-20">
          You have not created any courses yet
        </div>
        ) : (
        <div className="flex-grow mx-20 my-5">
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
        </div>
        )}
      </div>
    </>
  );
};

export default InstructorDashboard;
