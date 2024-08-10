"use client";
import { useSession } from "next-auth/react";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BounceLoader } from "react-spinners";

const CreateCourse = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseDifficulty, setCourseDifficulty] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "INSTRUCTOR") {
      router.push("/");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <BounceLoader color="#393E46" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 px-16">
        <div className="flex flex-col items-start justify-start">
          <div className="flex font-nunito font-extrabold text-3xl">
            Creating a new course
          </div>
          <div className="bg-secondary rounded-md p-5 my-5 min-w-[120vh] max-w-[120vh]">
            <form className="form-content items-center justify-center">
              <div className="font-semibold text-white mb-2 text-lg">
                Course Title
              </div>
              <div className="form-group pb-5 w-full">
                <input
                  type="text"
                  id="formCourseTitle"
                  placeholder="Course Title"
                  className="p-3 rounded-md bg-white text-grays w-full h-8"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="font-semibold text-white mb-2 text-lg">
                Description
              </div>
              <div className="form-group pb-5 w-full">
                <textarea
                  id="formCourseTitle"
                  placeholder="Description"
                  className="p-3 rounded-md bg-white text-grays w-full h-40 resize-none"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-row">
                <div className="font-semibold text-white mb-2 text-lg">
                  Difficulty:
                </div>
                <div className="flex">
                  <select className="bg-white text-black rounded-md mx-5 mt-0.5 h-6 px-2 min-w-[20vh]">
                    <option value="">Select branch</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
