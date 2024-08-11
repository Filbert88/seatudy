"use client";
import { CourseDetailsInterface } from "@/components/types/types";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../(user)/all-courses/loading";

const CreateAssignmentsPage = () => {
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [assignmentDescription, setAssignmentDescription] =
    useState<string>("");
  const [assignmentDuration, setAssignmentDuration] = useState<number>();

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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", assignmentTitle);
    formData.append("description", assignmentDescription);
    formData.append("dueDateOffset", assignmentDuration ? assignmentDuration.toString() : "");
    formData.append("courseId", courseId);
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/create`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({
          title: assignmentTitle,
          description: assignmentDescription,
          dueDateOffset: assignmentDuration,
          courseId: courseId,
        })
      });
      if(response.ok){
        alert("Assignment created successfully");
        setAssignmentTitle("");
        setAssignmentDescription("");
        setAssignmentDuration(0);
      }
      console.log(response);
    }catch(error){
      alert("Error in creating assignment");
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-24 px-16 font-nunito">
      <div className="flex flex-col items-start justify-start">
        <div className="flex font-nunito font-bold text-3xl">
          Course: {courseDetails?.title}
        </div>
        <div className="bg-secondary rounded-md p-5 my-5 min-w-[50rem]">
          <form className="form-content items-center justify-center">
            <div className="font-semibold text-white mb-2 text-lg">
              Assignment&apos;s Title
            </div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Enter assignment's title.."
                className="p-3 rounded-md bg-white w-full h-8"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
            </div>
            <div className="font-semibold text-white mb-2 text-lg">
              Description
            </div>
            <div className="form-group pb-5 w-full">
              <textarea
                placeholder="Enter a short description.."
                className="p-3 rounded-md bg-white w-full min-h-25"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
              />
            </div>
            <div className="font-semibold text-white mb-2 text-lg">
              Duration (day)
            </div>
            <div className="form-group pb-5 w-full">
              <input
                type="number"
                placeholder="Enter assignment's duration.."
                className="p-3 rounded-md bg-white w-full h-8"
                value={assignmentDuration}
                onChange={(e) => setAssignmentDuration(Number(e.target.value))}
              />
            </div>
          </form>
          <button
            onClick={handleSubmit}
            className="bg-fourth text-white py-1 px-12 font-semibold w-fit rounded-md mt-5"
          >
            Upload Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentsPage;
