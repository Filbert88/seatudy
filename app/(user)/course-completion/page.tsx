"use client";
import { CourseDetailsInterface } from "@/components/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const CourseCompletionPage = () => {
  const router = useRouter();
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
  }, [courseId, router, toast]);
  return (
    <div>
      <h1>Course Completion Page</h1>
    </div>
  );
};

export default CourseCompletionPage;
