"use client";

import { useRouter } from "next/navigation";
import CoursesCard from "@/components/courses-card";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { CourseInterface } from "@/components/types/types";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { toast } = useToast();

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const [popularCoursesResponse, myCoursesResponse] = await Promise.all([
        fetch(`/api/course/popular`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }),
        fetch("/api/course/my-course", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);
      const allCoursesData = await popularCoursesResponse.json();
      const myCoursesData = await myCoursesResponse.json();

      if (popularCoursesResponse.status === 200 && myCoursesResponse.ok) {
        const allCourses = allCoursesData.data;
        const myCourses = myCoursesData.data;

        const filteredCourses = allCourses.filter(
          (course: CourseInterface) =>
            !myCourses.some((myCourse: CourseInterface) => myCourse.id === course.id)
        );

        setCourseData(filteredCourses);
      } 
      else if (popularCoursesResponse.status === 200) {
        setCourseData(allCoursesData.data);
      }
      else {
        setCourseData([]);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <BounceLoader color="#393E46" />
        </div>
      )}
      <div className="w-full h-[20rem] bg-cover bg-[url('/assets/popular_courses.png')] flex flex-col text-white mt-20">
        <div className="flex-grow flex justify-center">
          <div className="w-full h-full items-center flex flex-col justify-center">
            <span className="font-bold text-6xl p-3">Popular Courses</span>
          </div>
        </div>
      </div>
      <div className="flex-grow mx-40 my-5">
        <div className="font-bold text-2xl mb-5">Our most enrolled courses</div>
        <div className="flex flex-wrap">
          {courseData.map((course) => (
            <div key={course.id} className="mr-5 mb-5">
              <CoursesCard
                courseTitle={course.title}
                totalChapters={course.materials.length}
                rating={course.averageRating}
                skills={course.skills}
                totalEnrolled={course.enrollments.length}
                difficulty={course.difficulty}
                thumbnailURL={course.thumbnailUrl}
                className={course.materials.length === 0 ? "opacity-60 hover:cursor-default": ""}
                onClick={() => router.push(`/course-detail?id=${course.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
