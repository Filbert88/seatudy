import React from "react";
import { FaStar, FaUser, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Image from "next/image";

interface Props {
  courseTitle: string;
  totalChapters: number;
  rating: number;
  skills: string[];
  totalEnrolled: number;
  difficulty: string;
  thumbnailURL: string;
  className?: string;
  onClick?: () => void;
}

const CoursesCard = ({ courseTitle, totalChapters, rating, skills, totalEnrolled, difficulty, thumbnailURL, className, onClick }: Props) => {
  return (
    <div onClick={onClick} className={`bg-white hover:cursor-pointer w-[18rem] h-[20rem] shadow-md shadow-gray-500 rounded-lg p-2 flex flex-col justify-between text-sm ${className}`}>
      <div className="aspect-w-16 aspect-h-9 relative">
        <Image 
          src={thumbnailURL ? thumbnailURL : 'https://imgur.com/O1gDMZb.png'} 
          alt="course thumbnail" 
          layout="fill" 
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <div className="p-1">
        <div className="font-bold text-xs text-grays flex justify-between items-center mt-1">
          <div>Contains {totalChapters} chapters</div>
          <div className="ml-auto mr-1 text-secondary">{rating.toPrecision(2)}</div>
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 0.5;
            if (rating >= i + 1) {
              return <FaStar key={i} color='#B4690E' />;
            } else if (rating >= starValue) {
              return <FaStarHalfAlt key={i} color='#B4690E' />;
            } else {
              return <FaRegStar key={i} color='#B4690E' />;
            }
          })}
        </div>
        <div className="underline font-bold text-lg mb-2">{courseTitle}</div>
        <div className="text-md font-semibold">{"Skills you'll gain:"}</div>
        <div className="text-sm font-bold text-grays">{skills.join(', ')}</div>
      </div>
      <div className="text-sm text-grays mt-auto p-1 flex items-center justify-between">
        <FaUser className="mr-2" />
        <div className="font-bold">{totalEnrolled.toLocaleString()}</div>
        <div className="ml-auto text-secondary font-semibold">{difficulty}</div>
      </div>
    </div>
  );
};

export default CoursesCard;
