"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import React from "react";
import { CourseInterface, ForumPostInterface, SideBarDataInterface } from "@/components/types/types";
import { getCourses, getSideBarDataFromLocalStorage } from "@/components/worker/local-storage-handler";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import LoadingBouncer from "./loading";

const ViewForumPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseData, setCourseData] = useState<CourseInterface>();
  const [forumData, setForumData] = useState<ForumPostInterface[]>();
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);

  const getForumData = async (courseId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/forum?courseId=${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch forum data");
      }
      const data = await response.json();
      setForumData(data.posts);
    } catch (error) {
      console.error("Error fetching forum data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const index = param.get("index");
    setIndex(parseInt(index ?? "0"));
    setCourseId(id);
    setIsLoading(true);
    if (id !== null) {
      getForumData(id);
    }

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

  if(isLoading){
    return(
      <LoadingBouncer />
    )
  }
  return (
    <>
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito scroll">
        <CoursesBar
          title={courseData?.title || ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "forum", index: 1 }}
        />
        {!isLoading && isMaterialAvailable && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10">
            <div className="my-5 font-nunito font-bold text-3xl">
              {`Forum Discussions`}
            </div>
            {forumData && forumData.map((post: any, index: number) => {
              return (
                <div key={index} className="flex flex-col bg-white shadow-lg rounded-md my-3 p-3 justify-between">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-semibold">{post.user.fullName}</div>
                    <div className="text-sm font-semibold ml-auto">
                      {new Date(post.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                  <div className="text-lg font-bold underline mb-1">{post.title}</div>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-current pl-2" />
                  <div className="flex pl-2 mt-2 mb-1 items-center hover:cursor-pointer w-fit">
                    <FaAngleDown/>
                    <div className="ml-1 text-sm font-bold">{`View ${post._count.comments} replies`}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewForumPage;
