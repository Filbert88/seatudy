"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { CourseDetailCardProps } from "../types/types";

const listSyllabus = (syllabus: string[]) => {
  return syllabus?.map((item, index) => {
    return <li key={index}>{item}</li>;
  });
};

const Card: React.FC<CourseDetailCardProps> = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (props.isLogin) {
      router.push(`/checkout?id=${props.courseId}`);
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <div className="flex flex-col rounded-md drop-shadow-md border absolute top-[6.5rem] right-[12rem] bg-white ml-20 w-[25rem] h-fit">
      <div className="relative w-full aspect-w-16 aspect-h-9">
        <Image
          src={props.thumbnailUrl || "/assets/dummyCourse.png"}
          fill
          className="rounded-t-md cover p-0.5"
          alt="Course Image"
        />
      </div>
      <div className="p-6 overflow-y-auto h-full">
        <h1 className="font-nunito font-bold text-3xl mb-3">
          Rp {props?.price?.toLocaleString()}
        </h1>
        <div>
          {props.isLogin ? (
            <button
              onClick={handleClick}
              type="button"
              className="text-secondary border-secondary border-2 font-nunito font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-secondary hover:text-white z-1"
            >
              {isLoading ? "Loading ..." : "Purchase this Course"}
            </button>
          ) : (
            <button
              onClick={handleClick}
              type="button"
              className="text-secondary border-secondary border-2 font-nunito font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-secondary hover:text-white"
            >
              {isLoading ? "Loading ..." : "Sign in to Purchase"}
            </button>
          )}
        </div>
        <p className="font-nunito font-semibold text-grays my-5">
          Full lifetime access
        </p>
        <div className="font-nunito font-bold">This course includes:</div>
        <ul className="font-nunito font-bold list-disc ml-5">
          {listSyllabus(props.syllabus)}
        </ul>
        <div className="flex flex-row justify-end mb-auto">
          <span className="font-nunito mt-5 mx-3 font-bold text-secondary">
            {props.averageRating.toPrecision(2)}
          </span>
          <div className="flex justify-end flex-row items-end mb-1">
            {props.averageRating < 0.5 ? (
              <FaRegStar color="#B4690E" />
            ) : props.averageRating < 1 ? (
              <FaStarHalfAlt color="#B4690E" />
            ) : (
              <FaStar color="#B4690E" />
            )}
            {props.averageRating < 1.5 ? (
              <FaRegStar color="#B4690E" />
            ) : props.averageRating < 2 ? (
              <FaStarHalfAlt color="#B4690E" />
            ) : (
              <FaStar color="#B4690E" />
            )}
            {props.averageRating < 2.5 ? (
              <FaRegStar color="#B4690E" />
            ) : props.averageRating < 3 ? (
              <FaStarHalfAlt color="#B4690E" />
            ) : (
              <FaStar color="#B4690E" />
            )}
            {props.averageRating < 3.5 ? (
              <FaRegStar color="#B4690E" />
            ) : props.averageRating < 4 ? (
              <FaStarHalfAlt color="#B4690E" />
            ) : (
              <FaStar color="#B4690E" />
            )}
            {props.averageRating < 4.5 ? (
              <FaRegStar color="#B4690E" />
            ) : props.averageRating < 5 ? (
              <FaStarHalfAlt color="#B4690E" />
            ) : (
              <FaStar color="#B4690E" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
