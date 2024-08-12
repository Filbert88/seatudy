"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBouncer from "../../(user)/all-courses/loading";
import {
  CourseDetailsInterface,
  StudentEnrollmentInterface,
} from "@/components/types/types";
import { useToast } from "@/components/ui/use-toast";
import { PiNotePencilBold, PiTrashBold } from "react-icons/pi";
import StudentBar from "@/components/student-enrolled/student-bar";

const ViewMaterialsPage = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const [students, setStudents] = useState<StudentEnrollmentInterface[]>([]);
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
          setStudents(data.data.enrollments);
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

  const handleDelete = async (materialId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/material/delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId }),
      });
      if (response.ok) {
        toast({
          title: "Material deleted successfully",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error deleting material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred while deleting the material",
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
    {courseDetails && <StudentBar students={students}/>}
    <div className="px-[24rem] pt-28 bg-primary w-screen h-screen">
      <div className="font-nunito text-3xl font-bold">
        {courseDetails?.title}
      </div>
      <button
        onClick={() => router.push(`/create-materials?id=${courseId}`)}
        type="button"
        className="rounded-md bg-tertiary text-background bg-fourth px-5 font-nunito text-white font-bold my-5 py-2"
      >
        Create new material
      </button>
      <div className="flex flex-col">
        {courseDetails?.materials.length === 0 ? (
          <div className="font-nunito text-2xl font-semibold">
            {"You haven't created any materials yet"}
          </div>
        ) : (
          courseDetails?.materials.map((material) => (
            <div
              key={material.id}
              className="bg-white hover:shadow-xl rounded-md shadow-sm p-5 my-5 min-w-[140vh]"
            >
              <div className="flex justify-between">
                <div className="font-nunito text-2xl font-bold">
                  {material.title}
                </div>
                <div className="flex text-grays">
                  <button
                    className="hover:bg-gray-100 rounded-lg p-1 mr-1"
                    onClick={() => router.push(`edit-materials?id=${material.id}`)}
                  >
                    <PiNotePencilBold size={30} />
                  </button>
                  <button
                    className="hover:bg-gray-100 rounded-lg p-1"
                    onClick={() => handleDelete(material.id)}
                  >
                    <PiTrashBold size={30}/>
                  </button>
                </div>
              </div>
              <div className="font-nunito text-base font-semibold flex">
                <a href={material.url} className="hover:underline" target="_blank">{"View PDF material"}</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default ViewMaterialsPage;
