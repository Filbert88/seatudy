"use client";

import { useRouter } from 'next/navigation';
import SeatudyLogo from '../assets/seatudy-logo';
import CoursesCard from '../components/courses-card';
import Navbar from "../components/navbar";
import FilterBar from '../components/filter-bar';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('query');
    if (query) {
      setSearchQuery(query);
    } 
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito font-bold">
      <Navbar isLoggedIn={false} />
      <FilterBar />
      <div className="mt-[7.5rem] ml-[16rem] text-2xl">
        <div className="mb-5">{`Showing n results of ${searchQuery}`}</div>
        <div className="flex flex-wrap">
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5 mb-5"
        />
        
        </div>
      </div>
      
    </main>
  );
}
