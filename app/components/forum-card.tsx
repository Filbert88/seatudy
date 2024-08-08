"use client";
import { Forum } from "@prisma/client";
import { useState } from "react";

interface ForumCardProps {
  id: string;
  content: string;
  forumID: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
  courseID: string;
  comment: object[];
}

const ForumCard: React.FC<ForumCardProps> = (props) => {
  return (
    <div className="border-2 border-white rounded-md bg-white p-3 px-5">
      <div className="font-nunito font-bold text-xl">William Theodorus</div>
      <div className="font-nunito font-normal text-lg">
        <p>{props.content}</p>
      </div>
    </div>
  );
};

export default ForumCard;
