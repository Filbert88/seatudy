"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/course-bar";
import Instructions from "@/components/assignments/instructions";
import Submission from "@/components/assignments/submission";
import {
  AssignmentInterface,
  StudentEnrollmentInterface,
} from "@/components/types/types";

import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import CertificateGenerator from "@/components/worker/certificate-generator";
import { useSearchParams } from "next/navigation";


const AssignmentPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [asgId, setAsgId] = useState<string | null>("");
  const [isAssignmentAvailable, setIsAssignmentAvailable] = useState(true);
  const [userProgress, setUserProgress] = useState<string>();
  const [courseTitle, setCourseTitle] = useState<string>("");
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
        setIsAssignmentAvailable(false);
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

    const userData = JSON.parse(localStorage.getItem("userData") ?? "{}");
    if (userData.id === session.data?.user.id && userData.courseId === id) {
      setUserProgress(userData.progress);
      setCourseTitle(localStorage.getItem("title") ?? "");
    }
    else {
      fetch(`/api/course/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const userEnrollment = data.data.enrollments.find(
            (enrollment: StudentEnrollmentInterface) => enrollment.userId === session.data?.user.id
          );
          const userProgress = userEnrollment
            ? (userEnrollment.progress[userEnrollment.progress.length - 1]?.progressPct ?? "0%")
            : "0%";
          setUserProgress(userProgress);
          setCourseTitle(data.data.title);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    if (asgId) {
      getAssignmentById(asgId);
    }
  }, [asgId]);

  return (
    <>
      {isLoading && <LoadingBouncer />}
      <main className="flex flex-row py-20 pl-64 font-nunito">
      <CoursesBar
        active={{ type: "assignments", id: assignmentData?.id ?? "" }}
      />
      {!isAssignmentAvailable && 
        <div className="pt-20 text-secondary text-3xl w-screen h-screen justify-center items-center flex">
          {"Course assignment not found"}
        </div>
      }
      
      {!isLoading && isAssignmentAvailable && (
        <div className="flex flex-col">
          {userProgress === "100.00%" ? (
            <div className="flex ml-10 mt-5">
              <div className="mr-2">
                {"You've completed this course. Download your certificate "}
              </div>
              <CertificateGenerator courseName={courseTitle} />
            </div>
          ) : (
            <div className="flex ml-10 mt-5">
              <div className="mr-2">
                {"Your current progress:"}
              </div>
              <div className="font-semibold">{userProgress}</div>
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
