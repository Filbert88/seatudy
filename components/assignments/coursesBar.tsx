import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseSidebarInterface } from "../types/types";

const CoursesBar: React.FC<CourseSidebarInterface> = (props) => {

  const router = useRouter();

  const handleButtonClick = (section: string, courseId: string, index: any) => {
    location.reload();
    router.push(`/${section}?id=${courseId}${index === undefined ? "" : "&index=" + index}`);
  };

  const listMaterials = (materials: string[]) => {
    return materials.map((item, index) => {
      return (
        <button
          key={index}
          disabled={props.active.type === "materials" && props.active.index === index}
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "materials" && props.active.index === index ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
          onClick={() => handleButtonClick("learning-material", new URLSearchParams(window.location.search).get('id') ?? '', index.toString())}
        >
          {item}
        </button>
      );
    });
  };

  const listAssignments = (assignments: string[]) => {
    return assignments.map((item, index) => {
      return (
        <button
          key={index}
          disabled={props.active.type === "assignments" && props.active.index === index}
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "assignments" && props.active.index === index ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
          onClick={() => handleButtonClick("view-assignment", new URLSearchParams(window.location.search).get('id') ?? '', index.toString())}
        >
          {item}
        </button>
      );
    });
  };
  return (
    <>
      <div className="fixed top-20 mx-5 my-5 min-w-[13rem] font-nunito left-0 text-secondary">
        <div className="text-lg font-bold mb-5">{props.title}</div>
        <div className="text-md font-bold">Course Materials</div>
        <hr className="border-t-1 border-secondary mb-3 w-full" />
        <div className="text-sm">{listMaterials(props.materials)}</div>
        <div className="text-md font-bold">Assignments</div>
        <hr className="border-t-1 border-secondary mb-3 w-full" />
        <div className="text-sm">{listAssignments(props.assignments)}</div>
        <div className="text-md font-bold">Forum</div>
        <hr className="border-t-1 border-secondary mb-3 w-full" />
        <button 
          className="text-sm w-full block text-left p-2 my-2 hover:bg-gray-300"
        >
          {"Create a new thread"}
        </button>
        <button 
          disabled={props.active.type === "forum" && props.active.index === 1}
          className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "forum" && props.active.index === 1 ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
          onClick={() => handleButtonClick("view-forum", new URLSearchParams(window.location.search).get('id') ?? '', undefined)}
        >
          {"View all discussions"}
        </button>
        <div className="text-md font-bold">Review</div>
        <hr className="border-t-1 border-secondary mb-3 w-full" />
        <button className="text-sm block text-left w-full p-2 my-2 hover:bg-gray-300">
          Submit a review
        </button>
      </div>
    </>
  );
};

export default CoursesBar;
