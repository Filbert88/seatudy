"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CourseDetailsInterface } from "@/components/types/types";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";

const DeleteCoursePage = () => {
  const { data: session } = useSession();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  useEffect(() => {
    const getCourse = async () => {
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
        toast({
          title: "Failed to load course details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      getCourse();
    }
  }, [courseId, session]); // eslint-disable-line

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === "Success") {
        toast({
          title: "Succesfully deleted the course",
        });
        router.push("/instructor-dashboard");
      } else {
        toast({
          title: `Failed to delete course`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: `Failed to purchase a course`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <div className="min-w-screen h-screen items-center bg-primary flex flex-col text-secondary font-nunito pt-20">
      <form className="form-content mt-10 max-w-[30%] items-center h-fit w-fit justify-center bg-white shadow-lg p-2">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={
              courseDetails
                ? courseDetails?.thumbnailUrl
                : "/assets/checkout_banner.gif"
            }
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
            alt="Course Image"
          />
        </div>
        <div className="p-3">
          <div className="font-nunito text-xl mb-2 text-start font-semibold">
            Course Title
          </div>
          <input
            value={courseDetails?.title}
            disabled
            className="py-1 px-3 rounded-md border border-grays w-full"
          />
          <div className="text-xs flex items-center my-5">
            By clicking “delete”, you acknowledge that you are deleting this
            course.
          </div>
          <div className="text-xs flex items-center mb-8 max-w-[80%]">
            {"*This action is non reversible. Please note that you, as the instructor, are solely responsible for any consequences resulting from deleting this course."}
          </div>
          <div className="flex flex-row justify-end space-x-4 mb-2">
            <button
              onClick={() => router.back()}
              type="button"
              className="rounded-md text-background px-5 py-1 font-nunito border-2 border-fourth text-fourth hover:opacity-65 transition text-sm font-extrabold"
            >
              Go Back
            </button>
            <button
              onClick={handleDelete}
              type="button"
              className="rounded-md bg-tertiary text-background bg-fourth px-5 font-nunito text-sm py-1 text-white hover:shadow-md transition font-extrabold"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteCoursePage;
