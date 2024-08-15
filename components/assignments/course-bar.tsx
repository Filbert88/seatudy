import { useRouter } from "next/navigation";
import { AssignmentInterface, CourseSidebarInterface, MaterialInterface, SideBarDataInterface } from "../types/types";
import { useEffect, useState } from "react";
import { getSideBarDataFromLocalStorage } from "../worker/local-storage-handler";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

const CoursesBar: React.FC<CourseSidebarInterface> = (props) => {
  const router = useRouter();
  const [courseData, setCourseData] = useState<SideBarDataInterface>();
  const { toast } = useToast();
  const session = useSession();

  const getCourseData = async (id: string) => {
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      if (data.message === "Success") {
        setCourseData({
          materialData: data.data.materials,
          assignmentData: data.data.assignments,
          titleData: data.data.title,
        });
        localStorage.setItem('materialData', JSON.stringify(data.data.materials));
        localStorage.setItem('assignmentData', JSON.stringify(data.data.assignments));
        localStorage.setItem('title', data.data.title);
        const userEnrollment = data.data.enrollments.find((enrollment: any) => enrollment.userId === session.data?.user.id);
        const userProgress = userEnrollment ? userEnrollment.progress[userEnrollment.progress.length - 1].progressPct : "0%";
        localStorage.setItem('userData', JSON.stringify({
          progress: userProgress,
          id: session.data?.user.id,
          courseId: data.data.id
        }));
      } else {
        toast({
          title: "Failed to fetch course data",
          variant: "destructive",
        });
        console.error("Failed to fetch course data");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error fetching course data",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const datas = {
      materialData: JSON.parse(localStorage.getItem('materialData') ?? "[]"),
      assignmentData: JSON.parse(localStorage.getItem('assignmentData') ?? "[]"),
      titleData: localStorage.getItem('title') ?? ""
    }
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    if (id) {
      setCourseData(datas);
      getCourseData(id);
    }
  }, []);

  const handleButtonClick = (
    section: string, 
    courseId: string, 
    materialId?: string, 
    assignmentId?: string
  ) => {
    router.push(`/${section}?id=${courseId}${materialId ? `&materialId=${materialId}` : ""}${assignmentId ? `&assignmentId=${assignmentId}` : ""}`);
  };

  const listMaterials = (materials: MaterialInterface[]) => {
    return materials.map((item) => {
      return (
        <button
          key={item.id}
          disabled={props.active.type === "materials" && props.active.id === item.id}
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${
            props.active.type === "materials" && props.active.id === item.id 
              ? "bg-secondary text-primary hover:bg-secondary"
              : ""
          }`}
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
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 ${
            props.active.type === "assignments" && props.active.id === item.id
              ? "bg-secondary text-primary hover:bg-secondary"
              : ""
          }`}
          onClick={() => handleButtonClick("view-assignment", item.courseId, undefined, item.id)}
        >
          {item.title}
        </button>
      );
    });
  };

  return (
    <div className="fixed top-20 mx-5 my-5 max-w-[13rem] min-w-[13rem] font-nunito left-0 text-secondary">
      <div className="text-lg font-bold mb-5">{courseData?.titleData}</div>
      <div className="text-md font-bold">Course Materials</div>
      <hr className="border-t-1 border-secondary mb-3 w-full" />
      <div className="text-sm">{listMaterials(courseData?.materialData ?? [])}</div>
      <div className="text-md font-bold">Assignments</div>
      <hr className="border-t-1 border-secondary mb-3 w-full" />
      <div className="text-sm">{listAssignments(courseData?.assignmentData ?? [])}</div>
      <div className="text-md font-bold">Forum</div>
      <hr className="border-t-1 border-secondary mb-3 w-full" />
      <button 
        disabled={props.active.type === "forum" && props.active.id === "new-thread"}
        className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${
          props.active.type === "forum" && props.active.id === "new-thread" 
            ? "bg-secondary text-primary hover:bg-secondary"
            : ""
        }`}
        onClick={() => handleButtonClick("new-thread", new URLSearchParams(window.location.search).get('id') ?? '', undefined, undefined)}
      >
        {"Create a new thread"}
      </button>
      <button 
        disabled={props.active.type === "forum" && props.active.id === "view-forum"}
        className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${
          props.active.type === "forum" && props.active.id === "view-forum"
            ? "bg-secondary text-primary hover:bg-secondary"
            : ""
        }`}
        onClick={() => handleButtonClick("view-forum", new URLSearchParams(window.location.search).get('id') ?? '', undefined, undefined)}
      >
        {"View all discussions"}
      </button>
      <div className="text-md font-bold">Review</div>
      <hr className="border-t-1 border-secondary mb-3 w-full" />
      <button
        disabled={props.active.type === "review" && props.active.id === "review-course"}
        className={`block text-left text-sm w-full p-2 my-2 hover:bg-gray-300 ${props.active.id === "review-course" ? "bg-secondary text-primary hover:bg-secondary" : ""}`}
        onClick={() => handleButtonClick("review-course", new URLSearchParams(window.location.search).get('id') ?? '', undefined, undefined)}
      >
        {"Submit a review"}
      </button>
    </div>
  );
};

export default CoursesBar;
