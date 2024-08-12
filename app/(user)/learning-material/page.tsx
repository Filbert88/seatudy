"use client";
import React, { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import PdfViewer from "@/components/pdf-viewer";
import {
  MaterialInterface,
  SideBarDataInterface,
} from "@/components/types/types";
import { BounceLoader } from "react-spinners";
import { getCourses, getSideBarDataFromLocalStorage } from "@/components/worker/local-storage-handler";
import { useToast } from "@/components/ui/use-toast";

const MaterialsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [materialData, setMaterialData] = useState<MaterialInterface>();
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);
  const { toast } = useToast();

  const getMaterialById = async (materialId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/material/${materialId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      setMaterialData(data.data);
      if (data.message !== "Success") {
        toast({
          title: "Failed to load material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to load material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const materialId = param.get("materialId");
    if (id) {
      const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);
      if (sideBarDataFromLocalStorage) {
        setSideBarData(sideBarDataFromLocalStorage);
      }
      else {
        console.log("Fetching course data from server");
        getCourses(id)
        .then((data) => {
          const newSideBarData = {
            materialData: data.materials,
            assignmentData: data.assignments,
            titleData: data.title,
          };
          setSideBarData(newSideBarData);
        })
        .catch((error) => {
          console.error("Error fetching course data:", error);
          setIsMaterialAvailable(false);
          toast({
            title: "Course not found",
            variant: "destructive",
          });
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }
    if (materialId) {
      getMaterialById(materialId);
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <BounceLoader color="#393E46" />
        </div>
      )}
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
        {isMaterialAvailable ? (
          <CoursesBar
            title={sideBarData?.titleData ?? ""}
            materials={sideBarData?.materialData || []}
            assignments={sideBarData?.assignmentData || []}
            active={{ type: "materials", id: materialData?.id ?? "" }}
          />
        ) : (
          <div className="pt-20 text-secondary text-3xl w-screen h-screen justify-center items-center flex">
            {"Course material not found"}
          </div>
        )}
        {!isLoading && isMaterialAvailable && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
            <div className="my-5 font-nunito font-bold text-3xl">
              {materialData?.title}
            </div>
            <div className="flex h-full pb-20">
              <PdfViewer
                url={materialData?.url ?? "null"}
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
