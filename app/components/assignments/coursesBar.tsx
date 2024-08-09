import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  materials: string[];
  assignments: string[];
}

const CoursesBar: React.FC<Props> = (props) => {
  const [activeSection, setActiveSection] = useState<string>("Materials");

  const router = useRouter();

  const handleButtonClick = (section: string, courseId: string, index: string) => {
    location.reload();
    router.push(`/${section}?id=${courseId}&index=${index}`);
  };

  const listMaterials = (materials: string[]) => {
    return materials.map((item, index) => {
      return (
        <button
          className="block text-left w-full p-2 my-2 hover:bg-gray-300"
          key={index}
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
          className={`block text-left w-full p-2 my-2 hover:bg-gray-300 
            ${activeSection === item ? "bg-black" : ""}`}
          onClick={() => setActiveSection("Assignments")}
        >
          {item}
        </button>
      );
    });
  };
  return (
    <>
      <div className="fixed top-20 mx-5 my-5 font-nunito left-0">
        <div className="text-lg font-bold mb-5">{props.title}</div>
        <div className="text-md font-bold">Course Materials</div>
        <hr className="border-t-2 border-secondary mb-4 w-[13rem]" />
        <div className="text-sm">{listMaterials(props.materials)}</div>
        <div className="text-md font-bold">Assignments</div>
        <hr className="border-t-2 border-secondary mb-4 w-[13rem]" />
        <div className="text-sm">{listAssignments(props.assignments)}</div>
        <div className="text-md font-bold">Forum</div>
        <hr className="border-t-2 border-secondary mb-4 w-[13rem]" />
        {["Create a new thread", "View All Discussions"].map((item, index) => {
          return (
            <button
              key={index}
              className="text-sm w-full block text-left p-2 my-2 hover:bg-gray-300"
            >
              {item}
            </button>
          );
        }, [])}
        <div className="text-md font-bold">Review</div>
        <hr className="border-t-2 border-secondary mb-4 w-[13rem]" />
        <button className="text-sm block text-left w-full p-2 my-2 hover:bg-gray-300">
          Submit a review
        </button>
      </div>
    </>
  );
};

export default CoursesBar;
