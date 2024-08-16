"use client";
import { useEffect, useState } from "react";
import Card from "@/components/courses/card";
import { CourseDetailsInterface, ReviewDataProps } from "@/components/types/types";
import { useSession } from "next-auth/react";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";

const CoursesDetailPage = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewDataProps[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [courseId, setCourseId] = useState<string>("");
  const { status } = useSession();
  const courseDetailUrl = `/api/course/${courseId}`;
  const { toast } = useToast();

  useEffect(() => {
    const getReviews = async (id: string) => {
      try {
        const response = await fetch(`/api/review?courseId=${id}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setReviewData(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to load reviews data",
          variant: "destructive",
        });
      }
    };

    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
      getReviews(id);
    }
  }, []);

  useEffect(() => {
    const getCoursesDetail = async () => {
      try {
        const response = await fetch(courseDetailUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setCourseDetails(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      getCoursesDetail();
    }

    const checkIfUserIsLoggedIn = () => {
      if (status === "authenticated") {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkIfUserIsLoggedIn();
  }, [courseId, courseDetailUrl, status]);

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number) + ".00";
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Course details not available.</p>
      </div>
    );
  }

  const outline = courseDetails.skills?.map((item, index) => (
    <li key={index} className="my-2">
      {item}
    </li>
  ));

  return (
    <div className="font-nunito">
      <div className="bg-secondary px-40 mt-20 pb-8">
        <div className="font-bold text-4xl ml-3 pt-10 text-primary">
          {courseDetails.title}
        </div>
        <div className="flex flex-row w-[55%] ml-3">
          <p className="font-semibold text-lg text-primary py-5">
            {courseDetails.description}
          </p>
        </div>
        <div className="flex flex-row font-semibold text-primary w-[55%] justify-between ml-3">
          <div>{`Difficulty: ${courseDetails.difficulty}`}</div>
          <div>{`Instructor: ${courseDetails.instructor.fullName}`}</div>
          <div>{`Last Updated: ${new Date(courseDetails.updatedAt).toLocaleDateString()}`}</div>
        </div>
      </div>
      <div className="flex flex-col px-40">
        <div className="m-5 mx-2.5 w-[50%]">
          <div className="bg-white rounded-md shadow-md px-4 py-4 m-1">
            <div className="font-bold text-xl">
              {"What you'll learn from this course"}
            </div>
            <ul className="font-bold list-disc pl-8">
              {outline}
            </ul>
          </div>
        </div>
        <div className="px-4 text-md font-bold mb-3">{"Student's reviews:"}</div>
        <div className="flex flex-wrap mx-2.5 w-[50%]">
          {reviewData.slice(0, 12).map((review) => (
            <div key={review.id} className="bg-white shadow-md flex flex-col flex-grow rounded-md px-2 py-2 mx-1 my-1">
              <div className="font-bold text-xs mb-0.5">
                {review.user.fullName}
              </div>
              <div className="text-xs mb-0.5">
                {review.content}
              </div>
              <div className="font-semibold text-xs">
                {`Rating: ${review.rating}`}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card
        courseId={courseDetails.id}
        thumbnailUrl={courseDetails.thumbnailUrl}
        price={formatNumber(courseDetails.price)}
        isLogin={isLogin}
        averageRating={courseDetails.averageRating}
        syllabus={courseDetails.syllabus}
      />
    </div>
  );
};

export default CoursesDetailPage;
