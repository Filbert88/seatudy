"use client";
import { useRouter } from "next/navigation";
import SeatudyLogo from "@/components/assets/seatudy-logo";
import CoursesCard from "@/components/courses-card";
import { useEffect, useState } from "react";
import { CourseInterface } from "@/components/types/types";
import LoadingBouncer from "../all-courses/loading";

interface HomeProps {
  initialCourseData: CourseInterface[];
  session: any;
}

export default function Home({ initialCourseData, session }: HomeProps) {
  const [courseData, setCourseData] =
    useState<CourseInterface[]>(initialCourseData);
  const [myCourseData, setMyCourseData] = useState<CourseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  const handleRegisterClick = () => {
    router.push("/auth/signup");
  };

  if (isLoading) {
    <LoadingBouncer />;
  }

  // JANGAN DISATUIN PLS PLS PLS!!!!
  // JANGAN DISENTUH TERUNTUK SIAPA SAJA YANG MEMBACA INI!!
  // JANGAN DISATUIN PLS PLS PLS!!!!
  // JANGAN DISENTUH TERUNTUK SIAPA SAJA YANG MEMBACA INI!!
  // JANGAN DISATUIN PLS PLS PLS!!!!
  // JANGAN DISENTUH TERUNTUK SIAPA SAJA YANG MEMBACA INI!!
  // JANGAN DISATUIN PLS PLS PLS!!!!
  // JANGAN DISENTUH TERUNTUK SIAPA SAJA YANG MEMBACA INI!!
  useEffect(() => {
    const fetchMyCourses = async () => {
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
          setMyCourseData(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (
      courseData &&
      myCourseData &&
      courseData.length > 0 &&
      myCourseData.length > 0
    ) {
      // Filter out courses the user is already enrolled in
      const filteredCourseData = courseData.filter(
        (course) => !myCourseData.some((myCourse) => myCourse.id === course.id)
      );
      setCourseData(filteredCourseData);
    }
  }, [myCourseData]);

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito">
      {session ? (
        <div className="w-full h-[20rem] bg-cover bg-[url('/assets/home_loggedin.png')] flex flex-col text-white mt-20">
          <div className="flex-grow flex justify-center">
            <div className="w-full h-full items-center flex flex-col justify-center">
              <span className="font-bold text-3xl sm:text-4xl lg:text-5xl p-3">{`Welcome back, ${session.user.name}! Ready to continue your journey?`}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[20rem] bg-cover bg-[url('/assets/home_loggedout.png')] flex flex-col text-white mt-20">
          <div className="flex-grow flex justify-center md:justify-end">
            <div className="w-full md:w-[40%] h-full items-center flex flex-col justify-center text-center md:text-left">
              <span className="font-bold text-4xl p-3">
                Elevate your skills with
              </span>
              <div className="flex flex-col md:flex-row p-3 justify-center md:justify-start items-center">
                <SeatudyLogo className="h-10 w-10 mx-2" />
                <span className="font-bold text-3xl">seatudy</span>
              </div>
              <div className="flex flex-col md:flex-row p-3 justify-center md:justify-start items-center">
                <a
                  onClick={handleRegisterClick}
                  className="bg-transparent hover:cursor-pointer border border-white rounded-md px-10 py-1.5 font-semibold mx-4 mb-3 md:mb-0"
                >
                  Join for free
                </a>
                <a
                  onClick={handleLoginClick}
                  className="bg-white hover:cursor-pointer rounded-md px-5 py-1.5 text-secondary font-semibold mx-4"
                >
                  I have an account
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow mx-10 2xl:mx-20 my-5">
        <div className="font-bold text-2xl sm:text-3xl mb-5 lg:text-left text-center">
          Explore our courses
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center place-items-center lg:place-items-start">
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
              className={`mr-5 mb-5 ${
                course.materials.length === 0
                  ? "opacity-60 hover:cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (course.materials.length > 0) {
                  // router.push(`/learning-material?id=${course.id}&materialId=${course.materials[0].id}`);
                  router.push(`/course-detail?id=${course.id}`);
                }
              }}
            />
          ))}
        </div>
        <div className="text-center mt-5">
          <button
            className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/all-courses")}
          >
            See More Courses
          </button>
        </div>
      </div>
    </main>
  );
}
