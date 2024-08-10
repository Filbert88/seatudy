"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CourseInterface } from "@/components/types/types";
import CoursesCard from "@/components/courses-card";
import LoadingBouncer from "@/components/loading";

const InstructorDashboard = () => {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const { data: session, status } = useSession();
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
    <>
      <div className="pt-24 px-8">
        {courseData.length === 0 ? (
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-3xl font-nunito font-extrabold">
                Currently Active Courses
              </div>
              <button
                className="rounded-md bg-tertiary text-background bg-fourth px-4 py-1 font-nunito text-white font-extrabold"
                type="button"
                onClick={() => router.push("/create-courses")}
              >
                Create new courses
              </button>
            </div>
            <div className="text-1xl font-nunito font-bold">
              No courses found
            </div>
          </div>
        ) : (
          <div className="flex-grow mx-20 my-5">
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
          </div>
        )}
      </div>
    </>
  );
};

export default InstructorDashboard;
