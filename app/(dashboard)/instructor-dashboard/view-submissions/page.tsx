"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../../(user)/all-courses/loading";
import {
  AssignmentSubmissionInterface,
  SubmissionInterface,
} from "@/components/types/types";
import pencil_icon from "../../../../public/assets/edit_icon.png";
import delete_icon from "../../../../public/assets/trash_icon.png";
import Image from "next/image";

const ViewSubmissionsPage = () => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionInterface[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<
    AssignmentSubmissionInterface[]
  >([]);
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }

    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/submissions?courseId=${courseId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setSubmissions(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="px-72 pt-24 bg-primary w-screen h-screen">
      <div className="font-nunito text-4xl font-bold">
        Introduction to Numerical Programming
      </div>
      <button
        type="button"
        className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-2"
      >
        Create new task
      </button>
      <div className="flex flex-col">
        <button>
          <div className="bg-white rounded-md shadow-md p-5 my-5">
            <div className="flex justify-between">
              <div className="font-nunito text-2xl font-extrabold">
                Deep Convolutional Neural Network
              </div>
              <div className="flex">
                <button>
                  <Image src={pencil_icon} alt="edit" width={30} height={10} />
                </button>
                <button>
                  <Image
                    src={delete_icon}
                    alt="delete"
                    width={30}
                    height={10}
                  />
                </button>
              </div>
            </div>
            <div className="font-nunito text-base font-semibold">
              We are going to implement a deep convolutional neural network
            </div>
            <div className="font-nunito text-sm items-end justify-end flex font-semibold">
              29 June 2021
            </div>
          </div>
        </button>
      </div>
      {/* {submissions === undefined ? (
        <div className="font-nunito text-2xl font-semibold">
          No Submissions yet... :(
        </div>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-md shadow-md p-5 my-5"
          >
            <div className="flex justify-between">
              <div className="font-nunito text-2xl font-semibold">
                {submission.assignment.title}
              </div>
              <div className="font-nunito text-2xl font-semibold">
                {submission.grade}
              </div>
            </div>
            <div className="font-nunito text-lg font-semibold">
              {submission.assignment.description}
            </div>
            <div className="font-nunito text-lg font-semibold">
              {submission.createdAt}
            </div>
          </div>
        ))
      )} */}
    </div>
  );
};

export default ViewSubmissionsPage;
