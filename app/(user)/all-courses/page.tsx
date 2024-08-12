"use client";

import { useRouter } from "next/navigation";
import CoursesCard from "@/components/courses-card";
import FilterBar from "@/components/filter-bar";
import { useEffect, useState } from "react";
import { CourseInterface } from "@/components/types/types";
import LoadingBouncer from "@/components/loading";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [results, setResults] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const getCourses = async (params: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course?${params}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        setResults(data.data);
      } else {
        setResults([]);
        toast({
          title: "Failed to fetch courses",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to fetch courses",
        variant: "destructive",
      });
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
    const searchParams = new URLSearchParams(window.location.search);
    const rating = searchParams.get("rating") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    const category = searchParams.get("category") || undefined;
    const title = searchParams.get("title") || undefined;
    setSearchQuery(title);
    const queryParams = buildQueryParams(rating, difficulty, category, title);
    getCourses(queryParams);
  }, []);

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
                className={`mr-5 mb-5 ${course.materials.length === 0 ? "opacity-60 hover:cursor-default": ""}`}
                onClick={() => router.push(`/course-detail?id=${course.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
