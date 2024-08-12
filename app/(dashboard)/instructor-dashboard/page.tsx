"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseInterface } from "@/components/types/types";
import CoursesCard from "@/components/courses-card";
import LoadingBouncer from "../loading";

const InstructorDashboard = () => {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
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
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-24">
      <div className="font-nunito font-extrabold mx-20 flex items-center justify-between mt-5">
        <div className="text-3xl mr-auto">Currently Active Courses</div>
        <button
          className="rounded-md text-background bg-fourth px-4 py-2 h-fit font-nunito text-white font-semibold"
          type="button"
          onClick={() => router.push("/create-courses")}
        >
          Create a new course
        </button>
      </div>
      {courseData.length === 0 ? (
        <div className="text-2xl font-nunito font-semibold mt-10 mx-20">
          You have not created any courses yet
        </div>
      ) : (
        <div className="flex-grow mx-20 my-5">
          <div className="flex">
            {courseData.map((course) => (
              <CoursesCard
                key={course.id}
                courseTitle={course.title}
                totalChapters={course.materials.length}
                rating={course.averageRating}
                skills={course.skills}
                totalEnrolled={course.enrollments.length}
                difficulty={course.difficulty}
                thumbnailURL={course.thumbnailUrl}
                className="mr-5 mb-5"
                onClick={() => router.push(`/view-assignments?id=${course.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
