"use client";

import LoadingBouncer from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const EditAssignmentPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [assignmentDescription, setAssignmentDescription] =
    useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setAssignmentId(id);
    }

    const fetchAssignment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/assignment/${assignmentId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAssignmentTitle(data.data.title);
          setAssignmentDescription(data.data.description);
        } else {
          toast({
            title: "Error fetching assignment",
            variant: "destructive",
          });
          router.push("/instructor-dashboard");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred while fetching the assignment",
          variant: "destructive",
        });
        router.push("/instructor-dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, router, toast]);

  const handleChanges = async () => {
    if (!assignmentTitle || !assignmentDescription) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/${assignmentId}/update`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: assignmentTitle,
          description: assignmentDescription,
        }),
      });
      const data = await response.json();
      if (data.message === "Success") {
        toast({
          title: "Assignment updated successfully",
        });
        router.back();
      } else {
        toast({
          title: "Error updating assignment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating the assignment",
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
    <div className="pt-32 px-12 text-secondary">
      <h1 className="font-nunito font-bold text-3xl mb-4">
        Editing an Assignment
      </h1>
      <hr className="border-t-2 border-grays w-full" />
      <div className="flex flex-col my-5">
        <form className="form-content items-center justify-center">
          <div className="font-semibold text-secondary mb-1 text-lg">Title</div>
          <div className="form-group pb-5 w-full">
            <input
              type="text"
              placeholder="Enter new assignment's title.."
              className="p-3 rounded-md border border-grays min-w-[40%] h-8"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
            />
          </div>
          <div className="font-semibold text-secondary mb-1 text-lg">
            Description
          </div>
          <div className="form-group pb-5 w-full">
            <textarea
              placeholder="Enter new assignment's descriptions.."
              className="p-3 rounded-md border border-grays min-w-[40%] h-40"
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
            />
          </div>
        </form>
        <button
          onClick={handleChanges}
          className="flex items-center justify-center text-white font-nunito font-semibold bg-fourth rounded-md w-fit px-5 py-2 hover:shadow-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditAssignmentPage;
