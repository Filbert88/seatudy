"use client";
import { CourseDetailsInterface } from "@/components/types/types";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../(user)/all-courses/loading";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const CreateAssignmentsPage = () => {
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [assignmentDescription, setAssignmentDescription] =
    useState<string>("");
  const [assignmentDuration, setAssignmentDuration] = useState<number>();
  const { toast } = useToast();
  const router = useRouter();

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
          title: "An error occurred while fetching the course details",
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

  const handleSubmit = async () => {
    if (!assignmentTitle || !assignmentDescription || !assignmentDuration) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", assignmentTitle);
      formData.append("description", assignmentDescription);
      formData.append(
        "dueDateOffset",
        assignmentDuration ? assignmentDuration.toString() : ""
      );
      formData.append("courseId", courseId);

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
        }),
      });

      if (response.ok) {
        toast({
          title: "Assignment created successfully",
        });
        router.back();
      } else {
        const data = await response.json();
        toast({
          title: "Failed to create assignment",
          description: data.message || "Please try again later.",
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

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-28 px-16 font-nunito text-secondary">
      <div className="flex flex-col items-center">

        <div className="bg-white shadow-md p-5 my-5 min-w-[50rem]">
          <div className="flex font-nunito font-bold text-3xl justify-center mb-3">
            Course: {courseDetails?.title}
          </div>
          <form className="form-content items-center justify-center">
            <div className="font-semibold mb-2 text-lg">
              {"Assignment Title"}
            </div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Enter assignment's title.."
                className="p-3 border border-grays rounded-md w-full h-8"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2 text-lg">
              Description
            </div>
            <div className="form-group pb-5 w-full">
              <textarea
                placeholder="Enter a short description.."
                className="p-3 border border-grays rounded-md w-full min-h-25"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2 text-lg">
              Duration (days)
            </div>
            <div className="form-group pb-5 w-full">
              <input
                type="number"
                placeholder="Enter assignment's duration.."
                className="p-3 rounded-md border border-grays w-full h-8"
                value={assignmentDuration ?? ""}
                onChange={(e) => setAssignmentDuration(Number(e.target.value))}
              />
            </div>
          </form>
          <button
            onClick={handleSubmit}
            className="bg-fourth text-white py-2 px-10 hover:shadow-md font-semibold w-fit rounded-md my-5 transition"
          >
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentsPage;
