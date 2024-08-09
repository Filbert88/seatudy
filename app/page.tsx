"use client";

import { useRouter } from "next/navigation";
import SeatudyLogo from "./assets/seatudy-logo";
import CoursesCard from "./components/courses-card";
import Navbar from "./components/navbar";
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { CourseInterface } from './components/types/types';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [courseData, setCourseData] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  const handleRegisterClick = () => {
    router.push("/auth/signup");
  };

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/course", {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      setCourseData(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito">
      {(isLoading || status === "loading") && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center"><BounceLoader color='#393E46'/></div>}
      <Navbar isLoggedIn={false} />
      {status === "authenticated" ? 
        <div className="w-full h-[20rem] bg-cover bg-[url('/assets/home_loggedin.png')] flex flex-col text-white mt-20">
          <div className="flex-grow flex justify-center">
            <div className="w-full h-full items-center flex flex-col justify-center">
              <span className="font-bold text-5xl p-3">Welcome back, User! Ready to continue your journey?</span>     
            </div>
          </div>
        </div>
        :
        <div className="w-full h-[20rem] bg-cover bg-[url('/assets/home_loggedout.png')] flex flex-col text-white mt-20">
          <div className="flex-grow flex justify-end">
            <div className="w-[40%] h-full items-center flex flex-col justify-center">
              <span className="font-bold text-4xl p-3">Elevate your skills with</span>
              <div className="flex p-3">
                <SeatudyLogo className="h-10 w-10 mx-2"/>
                <span className="font-bold text-3xl">seatudy</span>
              </div>
              <div className="flex p-3">
                <a onClick={handleRegisterClick} className="bg-transparent hover:cursor-pointer border border-white rounded-md px-10 py-1.5 font-semibold mx-4">Join for free</a>
                <a onClick={handleLoginClick} className="bg-white hover:cursor-pointer rounded-md px-5 py-1.5 text-secondary font-semibold mx-4">I have an account</a>
              </div>
            </div>
          </div>
        </div>
      }
      
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
              className="mr-5"
              onClick={() => router.push(`/course-detail?id=${course.id}`)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
