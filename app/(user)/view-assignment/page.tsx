"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import Instructions from "@/components/assignments/instructions";
import Submission from "@/components/assignments/submission";
import { AssignmentInterface, SideBarDataInterface } from "@/components/types/types";
import { getCourses, getSideBarDataFromLocalStorage } from "@/components/worker/local-storage-handler";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";

const AssignmentPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentAvailable, setIsAssignmentAvailable] = useState(true);
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [assignmentData, setAssignmentData] = useState<AssignmentInterface>();

  const { toast } = useToast();

  const handleClickInstructions = () => {
    setShowInstructions(true);
    setShowSubmissions(false);
  };
  const handleClickSubmissions = () => {
    setShowInstructions(false);
    setShowSubmissions(true);
  };

  const getAssignmentById = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/${assignmentId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      setAssignmentData(data.data);
      if (data.message !== "Success") {
        toast({
          title: "Failed to load material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to load material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const assignmentId = param.get("assignmentId");
    if (id) {
      const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);
      if (sideBarDataFromLocalStorage) {
        setSideBarData(sideBarDataFromLocalStorage);
        setIsLoading(false);
      }
      else {
        console.log("Fetching course data from server");
        getCourses(id)
        .then((data) => {
          const newSideBarData = {
            materialData: data.materials,
            assignmentData: data.assignments,
            titleData: data.title,
          };
          setSideBarData(newSideBarData);
        })
        .catch((error) => {
          console.error("Error fetching course data:", error);
          setIsAssignmentAvailable(false);
          toast({
            title: "Course not found",
            variant: "destructive",
          });
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }
    if (assignmentId) {
      getAssignmentById(assignmentId);
    }
  }, []);

  if(isLoading){
    return(
      <LoadingBouncer />
    )
  }

  return (
    <div className="flex flex-row py-20 pl-64">
      {isAssignmentAvailable ? (
        <CoursesBar
          title={sideBarData?.titleData || ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "assignments", id: assignmentData?.id || "" }}
        />
      ) : (
        <div className="pt-20 text-secondary text-3xl w-screen h-screen justify-center items-center flex">
          {"Course assignment not found"}
        </div>
      )}
      {(!isLoading && isAssignmentAvailable) && (
        <div className="flex flex-col ">
          <div className="my-5 ml-10 font-nunito font-bold text-3xl">
            {assignmentData?.title}
          </div>
          <div className="flex flex-row font-nunito font-semibold mx-10 space-x-5">
            <button
              onClick={handleClickInstructions}
              className={`mx-2 px-0.5 pb-1 ${
                showInstructions ? "border-b-2 border-fourth font-bold" : ""
              }`}
            >
            Instructions
            </button>
            <button
              onClick={handleClickSubmissions}
              className={`mx-2 px-0.5 pb-1 ${
                showSubmissions ? "border-b-2 border-fourth font-bold" : ""
              }`}
            >
            Submissions
            </button>
          </div>
          <hr className="border-t border-secondary mx-10 mt-1 mb-5 min-w-[150vh]" />
          <div className="ml-10">
            {showInstructions && (
              <Instructions>
                {assignmentData?.description ??
                  "No instructions given"}
              </Instructions>
            )}
            {showSubmissions && <Submission assignmentId={assignmentData?.id!}/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
