"use client";
import Image from "next/image";
import CoursesBar from "../components/assignments/coursesBar";
import Navbar from "../components/navbar";
import plus_icon from "../../public/assets/plus_icon.png";
import ForumCard from "../components/forum-card";

let CourseTitle = "Introduction to Javascript";
let dummyMaterials = [
  "Quick Introduction",
  "Algorithm & Basic Logics",
  "Object Oriented Programming",
  "DOM Manipulation",
];

let dummyAssign = [
  "Basic Arithmetic Calculator",
  "To Do List Application",
  "Javascript Quiz",
];

const viewForum = () => {
  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="flex flex-row py-20 pl-64 bg-primary">
        <CoursesBar
          title={CourseTitle}
          materials={dummyMaterials}
          assignments={dummyAssign}
        />
        <div className="flex flex-col w-screen h-screen">
          <div className="flex flex-row justify-between items-center">
            <div className="my-5 ml-10 font-nunito font-bold text-3xl">
              Forum Discussions
            </div>
            <div className="my-5 mr-10">
              <button className=" py-2 px-4">
                <Image
                  src={plus_icon}
                  width={20}
                  height={20}
                  alt="Create Forum"
                />
              </button>
            </div>
          </div>
          {/* Later the forum components will be placed on this positions yak */}
          <div className="px-5 ml-3 mr-3">
            <ForumCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default viewForum;
