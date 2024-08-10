"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Props {
  thumbnailUrl: string;
  price: number;
  isLogin: boolean;
  averageRating: number;
  syllabus: string[];
  courseId: string;
}

const listSyllabus = (syllabus: string[]) => {
  return syllabus?.map((item, index) => {
    return <li key={index}>{item}</li>;
  });
};

const Card: React.FC<Props> = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (props.isLogin) {
      router.push(`/checkout?id=${props.courseId}`);
    } else {
      router.push("/auth/signin");
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="text-center flex flex-col">
          Loading course details...
        </div>
      ) : (
        <div
          className="flex flex-col rounded-md drop-shadow-md border absolute bottom-0 top-[5rem] right-[12rem] bg-white ml-20"
          style={{ width: "400px", height: "550px" }}
        >
          <div className="relative w-full h-48">
            <Image
              src={props.thumbnailUrl || "/assets/dummyCourse.png"}
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
              alt="Course Image"
            />
          </div>
          <div className="p-6 overflow-y-auto">
            <h1 className="font-nunito font-bold text-3xl mb-3">
              Rp {props?.price?.toLocaleString()}
            </h1>
            <div>
              {props.isLogin ? (
                <button
                  onClick={handleClick}
                  type="button"
                  className="bg-primary text-black border-black border-2 font-nunito font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-black hover:text-white z-1"
                >
                  Checkout
                </button>
              ) : (
                <button
                  onClick={handleClick}
                  type="button"
                  className="bg-primary text-black border-black border-2 font-nunito font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-black hover:text-white"
                >
                  Sign in to purchase
                </button>
              )}
            </div>
            <p className="font-nunito font-bold text-gray-400 my-5">
              30 days money back guarantee
              <br />
              Full lifetime access
            </p>
            <div className="font-nunito font-extrabold">
              This course includes:
            </div>
            <ul
              className="font-nunito font-bold"
              style={{ listStyleType: "disc", paddingLeft: "20px" }}
            >
              {listSyllabus(props.syllabus)}
            </ul>
            <div className="flex flex-row items-end justify-end">
              <span className="font-nunito mt-5 mx-3 font-bold text-black">
                {props.averageRating}
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
      )}
    </>
  );
};

export default Card;
