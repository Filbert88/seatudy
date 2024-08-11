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

const ViewMaterialsPage = () => {
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

  const handleDelete = async (materialId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/material/delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({materialId})
      })
      const data = await response.json();
      console.log(data);
      if (data.message === "Success"){
        window.location.reload();
        alert("Material deleted successfully");
      }
    }catch(error){
      alert("Error deleting material");
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
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
            <div key={material.id} className="bg-white hover:shadow-xl rounded-md shadow-sm p-5 my-5 min-w-[140vh]">
              <div className="flex justify-between">
                <div className="font-nunito text-2xl font-bold">
                  {material.title}
                </div>
                <div className="flex">
                  <button className="hover:bg-gray-100 rounded-lg" onClick={() => router.push(`edit-materials?id=${material.id}`)}>
                    <Image
                      src={pencil_icon}
                      alt="edit"
                      width={30}
                      height={10}
                    />
                  </button>
                  <button className="hover:bg-gray-100 rounded-lg" onClick={() => handleDelete(material.id)}>
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
                <a href={material.url} className="hover:underline" target="_blank">{"View PDF material"}</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewMaterialsPage;
