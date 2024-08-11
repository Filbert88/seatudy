"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiDownload2Line } from "react-icons/ri";
import LoadingBouncer from "../../(user)/all-courses/loading";
import {
  CourseDetailsInterface,
  SubmissionDataInterface,
} from "@/components/types/types";
import pencil_icon from "../../../public/assets/edit_icon.png";
import delete_icon from "../../../public/assets/trash_icon.png";
import Image from "next/image";

const ViewSubmissionsPage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submissionData, setSubmissionData] = useState<SubmissionDataInterface[]>([]);

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

  if (isLoading) {
    return <LoadingBouncer />;
  }

  const handleDelete = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({assignmentId})
      })
      const data = await response.json();
      console.log(data);
      if(data.message === "Success"){
        window.location.reload();
        alert("Assignment deleted successfully");
      }
    }catch(error){
      alert("Error deleting assignment");
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }

  const handleSubmissionClick = (submissionId: string) => {
    // router.push(`/view-submissions?id=${assignmentId}`);
  }

  return (
    <div className="px-10 pt-28 bg-primary w-screen h-screen">
      <div className="font-nunito text-3xl font-bold">
        {"Submissions"}
      </div>
      <div className="flex flex-col">
        {submissionData.length === 0 ? (
          <div className="font-nunito text-2xl font-semibold">
            {"Submission list is empty"}
          </div>
        ) : (
          submissionData.map((submission) => (
            <div key={submission.id} onClick={() => handleSubmissionClick(submission.id)} className="bg-white hover:cursor-pointer hover:shadow-xl rounded-md shadow-sm p-5 my-5 min-w-[140vh]">
              <div className="flex justify-between items-center">
                <div className="font-nunito text-xl font-bold w-[40%] whitespace-nowrap">
                  {submission.student.fullName}
                </div>
                <div className="font-nunito text-xl font-semibold">
                  {submission.assignment.title}
                </div>
                <div className="flex ml-auto">
                  <a className="hover:bg-gray-100 rounded-lg mr-2" href={submission.content} target="_blank">
                    <RiDownload2Line size={30} />
                  </a>
                  <input type="text" className="border border-grays rounded-md py-1 px-3 w-[5rem]"/>
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
