"use client";
import React, { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/course-bar";
import PdfViewer from "@/components/pdf-viewer";
import {
  MaterialInterface,
  StudentEnrollmentInterface,
} from "@/components/types/types";

import { useSearchParams } from "next/navigation";
import CertificateGenerator from "@/components/worker/certificate-generator";
import { useSession } from "next-auth/react";
import LoadingBouncer from "./loading";

const MaterialsPage = () => {
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [materialData, setMaterialData] = useState<MaterialInterface | null>(
    null
  );
  const [userProgress, setUserProgress] = useState<string>();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const session = useSession();

  const getMaterialById = async (materialId: string) => {
    console.log("Fetching material for ID:", materialId);
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/material/${materialId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      if (data.message === "Success") {
        setMaterialData(data.data);
      } else {
        console.log("Failed to fetch material");
        setMaterialData(null);
        setIsMaterialAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching material:", error);
      setMaterialData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    const materialId = searchParams.get("materialId");

    setMaterialId(materialId);

    const userData = JSON.parse(localStorage.getItem("userData") ?? "{}");
    if (userData.id === session.data?.user.id && userData.courseId === id) {
      setUserProgress(userData.progress);
      setCourseTitle(localStorage.getItem("title") ?? "");
    }
    else {
      fetch(`/api/course/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const userEnrollment = data.data.enrollments.find(
            (enrollment: StudentEnrollmentInterface) => enrollment.userId === session.data?.user.id
          );
          const userProgress = userEnrollment
            ? (userEnrollment.progress[userEnrollment.progress.length - 1]?.progressPct ?? "0%")
            : "0%";
          setUserProgress(userProgress);
          setCourseTitle(data.data.title);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

  }, [searchParams]);

  useEffect(() => {
    if (materialId) {
      getMaterialById(materialId);
    }
  }, [materialId]);

  return (
    <>
      {isLoading && <LoadingBouncer />}
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
        <CoursesBar
          active={{ type: "materials", id: materialData?.id ?? "" }}
        />
        {!isMaterialAvailable &&
          <div className="pt-20 text-secondary text-3xl w-screen h-screen justify-center items-center flex">
            {"Course material not found"}
          </div>
        }
        {!isLoading && isMaterialAvailable && materialData && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
            {userProgress === "100.00%" ? (
              <div className="flex">
                <div className="mr-2">
                  {"You've completed this course. Download your certificate "}
                </div>
                <CertificateGenerator
                  courseName={courseTitle}
                />
              </div>
            ) : (
              <div className="flex">
                <div className="mr-2">
                  {"Your current progress:"}
                </div>
                <div className="font-semibold">{userProgress}</div>
              </div>
            )}
            <div className="my-5 font-nunito font-bold text-3xl">
              {materialData.title}
            </div>
            <div className="flex h-full pb-20">
              <PdfViewer
                url={materialData.url ?? "null"}
                className="flex-grow flex w-full"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MaterialsPage;
