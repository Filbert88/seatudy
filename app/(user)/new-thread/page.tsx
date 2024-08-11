"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import React from "react";
import {
  CourseInterface,
  SideBarDataInterface,
} from "@/components/types/types";
import { BounceLoader } from "react-spinners";
import {
  getCourses,
  getSideBarDataFromLocalStorage,
} from "@/components/worker/local-storage-handler";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";
import LoadingBouncer from "../all-courses/loading";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });

const ViewForumPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseData, setCourseData] = useState<CourseInterface>();
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const postCourse = async (
    materialTitle: string,
    pdfUrl: string,
    courseId: string
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/course/material/create", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          title: materialTitle,
          url: pdfUrl,
        }),
      });
      if (response.status !== 200) {
        console.error("Failed to post course");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const index = param.get("index");
    setIndex(parseInt(index ?? "0"));
    setCourseId(id);
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

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    // postCourse("Restful web API", "https://res.cloudinary.com/dl2cqncwz/raw/upload/v1723290929/kdjps8r1rg5ozec9il8u.pdf", "a64c60f6-ba19-496a-9d6e-707f0d3b4513");
    // return;
    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/forum/create", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          postTitle: title,
          postContent: content,
        }),
      });
      if (response.status === 200) {
        alert("Forum thread created successfully");
      } else {
        alert("Error creating forum thread");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <>
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
        <CoursesBar
          title={courseData?.title || ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "forum", index: 0 }}
        />
        {!isLoading && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
            <div className="my-5 font-nunito font-bold text-3xl">
              {`Create a new forum thread`}
            </div>
            <div className="text-xl font-semibold mb-3">{"Title"}</div>
            <input
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              className="w-full h-10 rounded-lg px-3 mb-10"
              placeholder=""
              name="title"
              required
            />
            <div className="text-xl font-semibold mb-3">{"Content"}</div>
            <div className="min-h-60 w-full bg-white rounded-lg">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                className="h-full"
                style={{ height: "calc(30vh - 40px)" }} // Adjust the height to account for the toolbar
              />
            </div>
            <div>
              <button
                onClick={async () => await handleSubmit()}
                className="bg-fourth text-white font-semibold px-10 py-2 rounded-lg mt-10"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewForumPage;
