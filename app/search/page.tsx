"use client";

import { useRouter } from 'next/navigation';
import SeatudyLogo from '../assets/seatudy-logo';
import CoursesCard from '../components/courses-card';
import Navbar from "../components/navbar";
import FilterBar from '../components/filter-bar';
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';

export default function Home() {
  interface Course {
    id: string;
    title: string;
    materials: object[];
    averageRating: number;
    skills: string[];
    enrollments: object[];
    difficulty: string;
    thumbnailUrl: string;
  }

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [results, setResults] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const getCourses = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course?title=${query}`, {
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('query');
    if (query) {
      setSearchQuery(query);
      getCourses(query);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito font-bold">
      {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center"><BounceLoader color='#393E46'/></div>}
      <Navbar isLoggedIn={false} />
      <FilterBar />
      <div className="mt-[7.5rem] ml-[16rem] text-2xl">
        <div className="mb-5">{`Showing ${results.length} results of ${searchQuery}`}</div>
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
            className="mr-5"
            onClick={() => router.push(`/learning-material?id=${course.id}`)}
          />
        ))}
        
        </div>
      </div>
      
    </main>
  );
}
