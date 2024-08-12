"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../(user)/all-courses/loading";
import {
  CourseDetailsInterface,
} from "@/components/types/types";
import { PiNotePencilBold } from "react-icons/pi";
import { PiTrashBold } from "react-icons/pi";
import { useToast } from "@/components/ui/use-toast";
import StudentBar from "@/components/student-enrolled/student-bar";

const ViewAssignmentPage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const { toast } = useToast();

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
        if (response.ok) {
          setCourseDetails(data.data);
        } else {
          toast({
            title: "Failed to load course details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, toast]);

  const handleDelete = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignmentId }),
      });
      const data = await response.json();
      if (data.message === "Success") {
        toast({
          title: "Assignment deleted successfully",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error deleting assignment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred while deleting the assignment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <>
      <StudentBar/>
      <div className="px-[24rem] pt-28 bg-primary w-screen h-screen">
        <div className="font-nunito text-4xl font-bold">
          {courseDetails?.title}
        </div>
        <div className="flex">
          <button
            onClick={() => router.push(`/create-assignments?id=${courseId}`)}
            type="button"
            className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-2 mr-5"
          >
            Create new task
          </button>
          <button
            onClick={() => router.push(`/view-submissions?id=${courseId}`)}
            type="button"
            className="rounded-md bg-tertiary text-background bg-fourth px-10 font-nunito text-white font-extrabold my-5 py-2"
          >
            View Submissions
          </button>
        </div>
        <div className="flex flex-col">
          {courseDetails?.assignments.length === 0 ? (
            <div className="font-nunito text-2xl font-semibold">
              {"No Assignments yet... :("}
            </div>
          ) : (
            courseDetails?.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white hover:shadow-xl rounded-md shadow-sm p-5 my-5 min-w-[140vh]"
              >
                <div className="flex justify-between">
                  <div className="font-nunito text-2xl font-extrabold">
                    {assignment.title}
                  </div>
                  <div className="flex text-grays">
                    <button
                      className="hover:bg-gray-100 rounded-lg mr-1 p-1"
                      onClick={() =>
                        router.push(`edit-assignments?id=${assignment.id}`)
                      }
                    >
                      <PiNotePencilBold size={30} />
                    </button>
                    <button
                      className="hover:bg-gray-100 rounded-lg p-1"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <PiTrashBold size={30}/>
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAssignmentPage;
