"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/course-bar";
import Instructions from "@/components/assignments/instructions";
import Submission from "@/components/assignments/submission";
import {
  AssignmentInterface,
  SideBarDataInterface,
} from "@/components/types/types";
import {
  getCourses,
  getSideBarDataFromLocalStorage,
} from "@/components/worker/local-storage-handler";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import CertificateGenerator from "@/components/worker/certificate-generator";
import { useSearchParams } from "next/navigation";
import { BounceLoader } from "react-spinners";

const AssignmentPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [asgId, setAsgId] = useState<string | null>("");
  const [isAssignmentAvailable, setIsAssignmentAvailable] = useState(true);
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const session = useSession();
  const [assignmentData, setAssignmentData] = useState<AssignmentInterface>();

  const { toast } = useToast();

  const searchParams = useSearchParams();

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
    const id = searchParams.get("id");
    const assignmentId = searchParams.get("assignmentId");
    setAsgId(assignmentId);

    console.log("Current URL Params:", { id, assignmentId });

    if (id) {
      const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);
      if (sideBarDataFromLocalStorage) {
        setSideBarData(sideBarDataFromLocalStorage);
        setIsLoading(false);
      } else {
        console.log("Fetching course data from server");
        getCourses(id, session.data?.user?.id)
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
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (asgId) {
      getAssignmentById(asgId);
    }
  }, [asgId]);

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <BounceLoader className="text-secondary" />
        </div>
      )}
      <main className="flex flex-row py-20 pl-64 font-nunito">
      {isAssignmentAvailable ? (
        <CoursesBar
          title={sideBarData?.titleData ?? ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "assignments", id: assignmentData?.id ?? "" }}
        />
      ) : (
        <div className="pt-20 text-secondary text-3xl w-screen h-screen justify-center items-center flex">
          {"Course assignment not found"}
        </div>
      )}
      
      {!isLoading && isAssignmentAvailable && (
        <div className="flex flex-col">
          {localStorage.getItem("progress") === "100.00%" ? (
            <div className="flex ml-10 mt-5">
              <div className="mr-2">
                {"You've completed this course. Download your certificate "}
              </div>
              <CertificateGenerator courseName={sideBarData?.titleData ?? ""} />
            </div>
          ) : (
            <div className="flex ml-10 mt-5">
              <div className="mr-2">
                {"Your current progress:"}
              </div>
              <div className="font-semibold">{localStorage.getItem("progress")}</div>
            </div>
          )}
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
          <div className="ml-10 px-2.5">
            {showInstructions && (
              <Instructions>
                {assignmentData?.description ?? "No instructions given"}
              </Instructions>
            )}
            {showSubmissions && assignmentData?.id && (
              <Submission assignmentId={assignmentData.id} />
            )}
          </div>
        </div>
      )}
    </main>
    </>
    
  );
};

export default AssignmentPage;
