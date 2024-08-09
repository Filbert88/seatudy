"use client";

import { useRouter } from 'next/navigation';
import CoursesCard from '../components/courses-card';
import Navbar from "../components/navbar";
import FilterBar from '../components/filter-bar';
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { CourseInterface } from '../components/types/types';
import build from 'next/dist/build';

export default function Home() {
  const router = useRouter();
  const [results, setResults] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const getCourses = async (params: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course?${params}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
      });
      const data = await response.json();
      response.status === 200 ? setResults(data.data) : setResults([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    } 
  }

  const buildQueryParams = (rating?: string, difficulty?: string, category?: string, title?: string) => {
    const params = new URLSearchParams();
    
    if (rating) {
      params.set('rating', rating);
    }
    if (difficulty) {
      params.set('difficulty', difficulty);
    }
    if (category) {
      params.set('category', category);
    }
    if (title) {
      params.set('title', title);
    }
    return params.toString();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const rating = searchParams.get('rating') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const category = searchParams.get('category') || undefined;
    const title = searchParams.get('title') || undefined;
    setSearchQuery(title);
    const queryParams = buildQueryParams(rating, difficulty, category, title);
    getCourses(queryParams);
  }, []);

  return (
    <>
    {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center"><BounceLoader color='#393E46'/></div>}
    <div className="flex min-h-screen flex-col bg-primary font-nunito font-bold">
      <Navbar />
      <FilterBar route='all-courses' />
      {!isLoading &&
        <div className="mt-[7.5rem] ml-[16rem] text-2xl">
          {searchQuery ? <div className="mb-5">{`Showing ${results.length} results of "${searchQuery}"`}</div> : <div className="mb-5">All Courses</div>}
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
              className="mr-5 mb-5"
              onClick={() => router.push(`/learning-material?id=${course.id}`)}
            />
          ))}
          </div>
        </div>
      }
    </div>
    </>
  );
}
