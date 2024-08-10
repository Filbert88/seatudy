"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import React from "react";
import { CourseInterface, SideBarDataInterface } from "@/components/types/types";
import { BounceLoader } from "react-spinners";
import { getCourses, getSideBarDataFromLocalStorage } from "@/components/worker/local-storage-handler";
import LoadingBouncer from "./loading";

const ViewForumPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseData, setCourseData] = useState<CourseInterface>();
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const index = param.get("index");
    setIndex(parseInt(index ?? "0"));
    setIsLoading(true);

    const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);

    if (sideBarDataFromLocalStorage) {
      setSideBarData(sideBarDataFromLocalStorage);
    }

    getCourses(id)
      .then((data) => {
        setCourseData(data);
        if (!sideBarDataFromLocalStorage) {
          const newSideBarData = {
            materialData: data.materials.map((material: any) => material.title),
            assignmentData: data.assignments.map(
              (assignment: any) => assignment.title
            ),
          };
          setSideBarData(newSideBarData);
        }
        if (data.materials.length === 0) {
          setIsMaterialAvailable(false);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Updated sideBarData:", sideBarData);
  }, [sideBarData]);

  if(isLoading){
    return(
      <LoadingBouncer />
    )
  }
  return (
    <>
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
        <CoursesBar
          title={courseData?.title || ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "forum", index: 1 }}
        />
        {!isLoading && isMaterialAvailable && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
            <div className="my-5 font-nunito font-bold text-3xl">
              {`Forum Discussions`}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewForumPage;
