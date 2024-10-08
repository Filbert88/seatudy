"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CourseInterface } from "@/components/types/types";
import CoursesCard from "@/components/courses-card";
import LoadingBouncer from "../../(dashboard)/loading";

const MyCoursesPage = () => {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    // validation if user hasn't logged in yet
    if (!session) {
      router.push("/");
    }

    // validation if user is an instructor
    if (session?.user.role !== "USER") {
      router.push("/");
    }

    // fetch courses that were enrolled by the user
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
    localStorage.setItem("id", "null");
  }, []);

  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <div className="pt-24 px-16 font-nunito">
      <div className="flex-grow mx-20 my-5">
        <div className="font-bold text-3xl mb-5">Your Course</div>
        <div className="flex flex-wrap">
          {courseData.length > 0 ? (
            courseData.map((course) => (
              <CoursesCard
                key={course.id}
                courseTitle={course.title}
                totalChapters={course.materials.length}
                rating={course.averageRating}
                skills={course.skills}
                totalEnrolled={course.enrollments.length}
                difficulty={course.difficulty}
                thumbnailURL={course.thumbnailUrl}
                className={`mr-5 mb-5 ${course.materials.length === 0 ? "opacity-60 hover:cursor-not-allowed": ""}`}
                onClick={() => {
                  if (course.materials.length > 0) {
                    setIsLoading(true);
                    router.push(`/learning-material?id=${course.id}&materialId=${course.materials[0].id}`);
                  }
                }}
              />
            ))
          ) : (
            <div className="font-semibold text-2xl text-gray-800 flex">
              {"Let's get started by purchasing your first course!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
