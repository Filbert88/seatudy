"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CoursesCard from "@/components/courses-card";
import FilterBar from "@/components/filter-bar";
import { useEffect, useState } from "react";
import { CourseInterface } from "@/components/types/types";
import LoadingBouncer from "@/components/loading";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [results, setResults] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const getCourses = async (params: string) => {
    try {
      setIsLoading(true);

      const [allCoursesResponse, myCoursesResponse] = await Promise.all([
        fetch(`/api/course?${params}`, {
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

      const allCoursesData = await allCoursesResponse.json();
      const myCoursesData = await myCoursesResponse.json();

      if (allCoursesResponse.status === 200 && myCoursesResponse.ok) {
        const allCourses = allCoursesData.data;
        const myCourses = myCoursesData.data;

        const filteredCourses = allCourses.filter(
          (course: CourseInterface) =>
            !myCourses.some((myCourse: CourseInterface) => myCourse.id === course.id)
        );

        setResults(filteredCourses);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildQueryParams = (
    rating?: string,
    difficulty?: string,
    category?: string,
    title?: string
  ) => {
    const params = new URLSearchParams();

    if (rating) {
      params.set("rating", rating);
    }
    if (difficulty) {
      params.set("difficulty", difficulty);
    }
    if (category) {
      params.set("category", category);
    }
    if (title) {
      params.set("title", title);
    }
    return params.toString();
  };

  useEffect(() => {
    const rating = searchParams.get("rating") ?? undefined;
    const difficulty = searchParams.get("difficulty") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const title = searchParams.get("title") ?? undefined;
    setSearchQuery(title);
    const queryParams = buildQueryParams(rating, difficulty, category, title);
    getCourses(queryParams);
  }, [searchParams]); // eslint-disable-line

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary font-nunito font-bold">
      <FilterBar route="all-courses" />
      {!isLoading && (
        <div className="mt-[7.5rem] ml-[16rem] text-2xl">
          {searchQuery ? (
            <div className="mb-5">{`Showing ${results.length} results of "${searchQuery}"`}</div>
          ) : (
            <div className="mb-5">All Courses</div>
          )}
          <div className="flex flex-wrap">
            {results.map((course, index) => (
              <CoursesCard
                key={index}
                courseTitle={course.title}
                totalChapters={course.materials.length}
                rating={course.averageRating}
                skills={course.skills}
                totalEnrolled={course.enrollments.length}
                difficulty={course.difficulty}
                thumbnailURL={course.thumbnailUrl}
                className={`mr-5 mb-5 ${
                  course.materials.length === 0
                    ? "opacity-60 hover:cursor-default"
                    : ""
                }`}
                onClick={() => router.push(`/course-detail?id=${course.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
