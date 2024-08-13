"use client";
import { CourseDetailsInterface } from "@/components/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import CongratulationImage from "../../../public/assets/congratulations_icon.png";
import { useSession } from "next-auth/react";

const CourseCompletionPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseId, setCourseId] = useState<string>("");
  const [courseDetails, setCourseDetails] = useState<CourseDetailsInterface>();
  const { toast } = useToast();
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    } else {
      router.back();
    }

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

    if (status !== "authenticated") {
      toast({
        title: "You need to login first",
        variant: "destructive",
      });
      router.push("/auth/signin");
    }
  }, [courseId, router, toast, status]);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-cover bg-primary">
      <div className="bg-white rounded-lg p-5 flex flex-col font-nunito font-bold text-1xl items-center justify-center max-w-96">
        <Image
          src={CongratulationImage}
          alt="Congratulations"
          className="w-80 h-auto flex mb-5"
          objectFit="contain"
        />
        <h1 className="flex font-nunito text-1xl text-center mb-2">
          We know it was hard but you have successfully completed{" "}
          {courseDetails?.title} Course
        </h1>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-1 bg-secondary rounded-lg w-80 text-white items-center justify-center hover:cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CourseCompletionPage;
