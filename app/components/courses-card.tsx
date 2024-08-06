import React from "react";
import { FaStar, FaUser, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface Props {
  courseTitle: string;
  totalChapters: number;
  rating: number;
  skills: string[];
  totalEnrolled: number;
  difficulty: string;
  thumbnailURL: string;
  className?: string;
}

const CoursesCard = ({courseTitle, totalChapters, rating, skills, totalEnrolled, difficulty, thumbnailURL, className}: Props) => {
  return (
  <div className={`bg-white hover:cursor-pointer w-[18rem] h-[20rem] shadow-md shadow-gray-500 rounded-lg p-2 flex flex-col justify-between text-sm ${className}`}>
    <img src={thumbnailURL} alt="course thumbnail" className="rounded-md"/>
    <div className="p-1">
      <div className="font-bold text-xs text-grays flex justify-between items-center mt-1">
        <div>Contains {totalChapters} chapters</div>
        <div className="ml-auto mr-1 text-secondary">{rating.toPrecision(2)}</div>
        {rating < 0.5 ? <FaRegStar color='#B4690E'/> : (rating < 1 ? <FaStarHalfAlt color='#B4690E'/> : <FaStar color='#B4690E'/>)}
        {rating < 1.5 ? <FaRegStar color='#B4690E'/> : (rating < 2 ? <FaStarHalfAlt color='#B4690E'/> : <FaStar color='#B4690E'/>)}
        {rating < 2.5 ? <FaRegStar color='#B4690E'/> : (rating < 3 ? <FaStarHalfAlt color='#B4690E'/> : <FaStar color='#B4690E'/>)}
        {rating < 3.5 ? <FaRegStar color='#B4690E'/> : (rating < 4 ? <FaStarHalfAlt color='#B4690E'/> : <FaStar color='#B4690E'/>)}
        {rating < 4.5 ? <FaRegStar color='#B4690E'/> : (rating < 5 ? <FaStarHalfAlt color='#B4690E'/> : <FaStar color='#B4690E'/>)}
      </div>
      <div className="underline font-bold text-lg mb-2">{courseTitle}</div>
      <div className="text-md font-semibold">{"Skills you'll gain:"}</div>
      <div className="text-sm font-bold text-grays">{skills.join(', ')}</div>
    </div>
    <div className="text-sm text-grays mt-auto p-1 flex items-center justify-between">
      <FaUser className="mr-2"/>
      <div className="font-bold">{totalEnrolled.toLocaleString()}</div>
      <div className="ml-auto text-secondary font-semibold">{difficulty}</div>
    </div>
  </div>
  )

}

export default CoursesCard;