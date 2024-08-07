"use client";
import Image from "next/image";
import DummyImage from "../../../public/assets/dummyCourse.png";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  price: number;
  isLogin: boolean;
  averageRating: number;
  syllabus: string[];
}

const listSyllabus = (syllabus: string[]) => {
  return syllabus.map((item, index) => {
    return (
      <li key={index} className="my-2">
        {item}
      </li>
    );
  });
};

const Card: React.FC<Props> = (props) => {
  const router = useRouter();
  const handleClick = () => {
    if (props.isLogin) {
      alert("Add to cart");
    } else {
      alert("Sign in to purchase");
    }
  };
  return (
    <>
      <div
        className="flex flex-col rounded-md drop-shadow-md border absolute bottom-0 top-[7rem] right-[12rem] bg-white ml-20"
        style={{ width: "500px", height: "580px" }}
      >
        <div className="relative w-full">
          <Image
            src={DummyImage}
            width={500}
            height={300}
            className="w-full h-auto rounded-t-md p-0.5"
            alt="Course Image"
          />
        </div>
        <div className="p-6 overflow-y-auto">
          <h1 className="font-nunito font-bold text-3xl mb-3">
            Rp {props.price.toLocaleString()}
          </h1>
          <div>
            {props.isLogin ? (
              <button
                onClick={handleClick}
                type="button"
                className="bg-primary text-black border-black border-2 font-nunito font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-black hover:text-white"
              >
                Add to cart
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
          <div className="flex items-end justify-end">
            <span className="font-nunito font-bold text-black">
              {props.averageRating}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
