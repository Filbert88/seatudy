"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../(user)/all-courses/loading";
import {
  CourseDetailsInterface,
} from "@/components/types/types";
import pencil_icon from "../../../public/assets/edit_icon.png";
import delete_icon from "../../../public/assets/trash_icon.png";
import Image from "next/image";

const ViewSubmissionsPage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/course/${courseId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        setCourseDetails(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="px-72 pt-24 bg-primary w-screen h-screen">
      <div className="font-nunito text-4xl font-bold">
        {courseDetails?.title}
      </div>
      <button
        onClick={() => router.push(`/create-assignments?id=${courseId}`)}
        type="button"
        className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-2"
      >
        Create new task
      </button>
      <div className="flex flex-col">
        {courseDetails?.assignments === undefined ? (
          <div className="font-nunito text-2xl font-semibold">
            No Submissions yet... :(
          </div>
        ) : (
          courseDetails?.assignments.map((assignment) => (
            <div key={assignment.id}>
              <button>
                <div className="bg-white rounded-md shadow-md p-5 my-5 min-w-[140vh]">
                  <div className="flex justify-between">
                    <div className="font-nunito text-2xl font-extrabold">
                      {assignment.title}
                    </div>
                    <div className="flex">
                      <button>
                        <Image
                          src={pencil_icon}
                          alt="edit"
                          width={30}
                          height={10}
                        />
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
                  <div className="font-nunito text-base font-semibold flex">
                    {assignment.description}
                  </div>
                  <div className="font-nunito text-sm items-end justify-end flex font-semibold">
                    {assignment.dueDateOffset} days left
                  </div>
                </div>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewSubmissionsPage;
