"use client";
import { useEffect, useState } from "react";
import { RiDownload2Line } from "react-icons/ri";
import LoadingBouncer from "../../(user)/all-courses/loading";
import {
  SubmissionDataInterface,
} from "@/components/types/types";

import { useToast } from "@/components/ui/use-toast";

const ViewSubmissionsPage = () => {
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [grade, setGrade] = useState<string>("");
  const [activeGradingId, setActiveGradingId] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submissionData, setSubmissionData] = useState<SubmissionDataInterface[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }

    const fetchSubmission = async (courseId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/submission?courseId=${courseId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setSubmissionData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchSubmission(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (grade === "") {
      setActiveGradingId("");
      setComment("");
    }
  }, [grade, activeGradingId])

  if (isLoading) {
    return <LoadingBouncer />;
  }

  const handleChange = (value: string, id: string) => {
    value = value.replace(/\D/g, "");
    if (parseInt(value) > 100) {
      value = "100";
    }
    else if (parseInt(value) < 0) {
      value = "0"
    }
    setGrade(value);
  }



  const handleSubmissionClick = async (assignmentId:string, studentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/submission-score/create`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ 
          grade: parseInt(grade),
          assignmentId: assignmentId,
          studentId: studentId,
        }),
      });
      if (!response.ok) {
        toast({
          title: "An error occurred while grading the submission",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successfully graded the submission",
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred while grading the submission",
        variant: "destructive",
      });
    } finally { 
      setIsLoading(false);
      setGrade("");
      setActiveGradingId("");
      setComment("");
    }
  }

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="px-10 pt-28 bg-primary w-screen h-screen">
      <div className="font-nunito text-3xl mb-3 font-bold">
        {"Submissions"}
      </div>
      <div className="flex flex-col">
        {submissionData.length === 0 ? (
          <div className="font-nunito text-2xl font-semibold">
            {"Submission list is empty"}
          </div>
        ) : (
          submissionData.map((submission) => (
            <div key={submission.id} className={`bg-white hover:shadow-xl rounded-md shadow-sm p-5 my-3 min-w-[140vh] ${activeGradingId !== submission.id && activeGradingId !== "" && "opacity-60"}`}>
              <div className="flex justify-between items-center">
                <div className="font-nunito text-xl font-bold w-[40%] whitespace-nowrap">
                  {submission.student.fullName}
                </div>
                <div className="font-nunito text-xl font-semibold">
                  {submission.assignment.title}
                </div>
                <div className="flex ml-auto">
                  
                  {activeGradingId === submission.id && 
                    <button 
                      className="mr-10 px-3 py-1 bg-fourth text-white font-semibold rounded-md hover:shadow-md"
                      onClick={() => {
                        handleSubmissionClick(submission.assignmentId, submission.studentId);
                      }}
                    >Grade</button>
                  }
                  <a className="hover:bg-gray-100 text-grays rounded-lg mr-3" href={submission.content} target="_blank">
                    <RiDownload2Line size={30} />
                  </a>
                  <input 
                    type="text" 
                    value={activeGradingId === submission.id ? grade : (submission.grade ? submission.grade.toString() : "")}
                    disabled={(activeGradingId !== submission.id && activeGradingId !== "") || submission.grade !== null}
                    className="border border-grays rounded-md py-1 px-3 w-[5rem]"
                    onChange={(e) => {
                      handleChange(e.target.value, submission.id);
                      setActiveGradingId(submission.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewSubmissionsPage;
