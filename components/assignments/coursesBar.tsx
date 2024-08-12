import { useRouter } from "next/navigation";
import { AssignmentInterface, CourseSidebarInterface, MaterialInterface } from "../types/types";

const CoursesBar: React.FC<CourseSidebarInterface> = (props) => {

  const router = useRouter();

  const handleButtonClick = (section: string, courseId: string, materialId: any, assignmentId: any) => {
    router.push(`/${section}?id=${courseId}${materialId === undefined ? "" : "&materialId=" + materialId}
    ${assignmentId === undefined ? "" : "&assignmentId=" + assignmentId}`);
  };

  const listMaterials = (materials: MaterialInterface[]) => {
    return materials.map((item) => {
      return (
        <button
          key={item.id}
          disabled={props.active.type === "materials" && props.active.id === item.id}
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "materials" && props.active.id === item.id ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
          onClick={() => handleButtonClick("learning-material", item.courseId, item.id, undefined)}
        >
          {item.title}
        </button>
      );
    });
  };

  const listAssignments = (assignments: AssignmentInterface[]) => {
    return assignments.map((item) => {
      return (
        <button
          key={item.id}
          disabled={props.active.type === "assignments" && props.active.id === item.id}
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "assignments" && props.active.id === item.id ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
          onClick={() => handleButtonClick("view-assignment", item.courseId, undefined, item.id)}
        >
          {item.title}
        </button>
      );
    });
  };
  return (
    <div className="fixed top-20 mx-5 my-5 max-w-[13rem] min-w-[13rem] font-nunito left-0 text-secondary">
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
        disabled={props.active.type === "forum" &&  props.active.id === "new-thread"}
        className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "forum" && props.active.id === "new-thread" ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
        onClick={() => handleButtonClick("new-thread", new URLSearchParams(window.location.search).get('id') ?? '', undefined, undefined)}
      >
        {"Create a new thread"}
      </button>
      <button 
        disabled={props.active.type === "forum" && props.active.id === "view-forum"}
        className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${props.active.type === "forum" && props.active.id === "view-forum" ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
        onClick={() => handleButtonClick("view-forum", new URLSearchParams(window.location.search).get('id') ?? '', undefined, undefined)}
      >
        {"View all discussions"}
      </button>
      <div className="text-md font-bold">Review</div>
      <hr className="border-t-1 border-secondary mb-3 w-full" />
      <button className="text-sm block text-left w-full p-2 my-2 hover:bg-gray-300">
        Submit a review
      </button>
    </div>
  );
};

export default CoursesBar;
