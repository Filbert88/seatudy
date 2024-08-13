import React from "react";
import { FaStar, FaUser, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Image from "next/image";
import { CardInterface } from "./types/types";

const CoursesCard = ({
  courseTitle,
  totalChapters,
  rating,
  skills,
  totalEnrolled,
  difficulty,
  thumbnailURL,
  className,
  onClick,
}: CardInterface) => {
  const truncateString = (input: string, maxChars: number): string => {
    if (input.length <= maxChars) {
      return input;
    }
    return input.substring(0, maxChars) + "...";
  };

  return (
    <button onClick={onClick} className="text-start">
      <div
        className={`bg-white hover:cursor-pointer w-[18rem] h-[20rem] shadow-md hover:shadow-lg transition hover:shadow-gray-500 shadow-gray-400 rounded-lg p-2 flex flex-col justify-between text-sm ${className}`}
      >
        <div className="aspect-w-16 aspect-h-9 relative">
          <Image
            src={
              thumbnailURL ??
              "https://res.cloudinary.com/dl2cqncwz/image/upload/v1723488183/zfprmxxybgzwffyj8kon.png"
            }
            alt="course thumbnail"
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
            className="rounded-md"
          />
        </div>
        <div className="p-1">
          <div className="font-bold text-xs text-grays flex justify-between items-center mt-1">
            <div>Contains {totalChapters} chapters</div>
            <div className="ml-auto mr-1 text-secondary">
              {rating.toPrecision(2)}
            </div>
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 0.5;
              if (rating >= i + 1) {
                return <FaStar key={i} color="#B4690E" />;
              } else if (rating >= starValue) {
                return <FaStarHalfAlt key={i} color="#B4690E" />;
              } else {
                return <FaRegStar key={i} color="#B4690E" />;
              }
            })}
          </div>
          <div className="underline font-bold text-lg mb-2">
            {truncateString(courseTitle, 25)}
          </div>
          <div className="text-md font-semibold">{"Skills you'll gain:"}</div>
          <div className="text-sm font-semibold text-grays">
            {truncateString(skills.join(", "), 60)}
          </div>
        </div>
        <div className="text-sm text-grays mt-auto p-1 flex items-center justify-between">
          <FaUser className="mr-2" />
          <div className="font-bold">{totalEnrolled.toLocaleString()}</div>
          <div className="ml-auto text-secondary font-semibold">
            {difficulty}
          </div>
        </div>
      </div>
    </button>
  );
};

export default CoursesCard;
