"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingBouncer from "./loading";
import { FaRegImage } from "react-icons/fa6";
import Image from "next/image";

const CreateCourse = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseDifficulty, setCourseDifficulty] = useState<string>("BEGINNER");
  const [coursePrice, setCoursePrice] = useState<string>("");
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [syllabus, setSyllabus] = useState<string>("");
  const [skills, setSkills] = useState<string>("");

  const handleSubmit = async () => {
    if (
      !courseTitle ||
      !courseDescription ||
      !courseDifficulty ||
      !coursePrice
    ) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const f = new FormData();
      if (courseThumbnail) {
        f.append("file", courseThumbnail);
      }
      f.append("title", courseTitle);
      f.append("description", courseDescription);
      syllabus.split(",").forEach((item) => f.append("syllabus", item.trim()));
      skills.split(",").forEach((item) => f.append("skills", item.trim()));
      f.append("difficulty", courseDifficulty);
      f.append("price", coursePrice);
      f.append(
        "categoryNames",
        JSON.stringify(["Programming", "Web Development"])
      );

      const response = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: f,
      });
      if (response.status === 201) {
        alert("Course created successfully");
        router.push("/instructor-dashboard");
      } else {
        alert("Error creating course");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setCourseThumbnail(selectedFile);
      setThumbnailUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "INSTRUCTOR") {
      router.push("/");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <>
      <div className="pt-24 px-16 font-nunito">
        <div className="flex flex-col items-start justify-start">
          <div className="flex font-nunito font-bold text-3xl">
            Creating a new course
          </div>
          <div className="bg-secondary rounded-md p-5 my-5 min-w-[50rem]">
            <form className="form-content items-center justify-center">
              <div className="font-semibold text-white mb-2 text-lg">
                Course Title
              </div>
              <div className="form-group pb-5 w-full">
                <input
                  type="text"
                  placeholder="Enter course title.."
                  className="p-3 rounded-md bg-white w-full h-8"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="font-semibold text-white mb-2 text-lg">
                Description
              </div>
              <div className="form-group pb-5 w-full">
                <textarea
                  placeholder="Enter a short description.."
                  className="p-3 rounded-md bg-white w-full min-h-25"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
              </div>
              <div className="font-semibold text-white mb-2 text-lg">
                Syllabus
              </div>
              <div className="form-group pb-5 w-full">
                <input
                  type="text"
                  placeholder="Separate with comma.."
                  className="p-3 rounded-md bg-white w-full h-8"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                />
              </div>
              <div className="font-semibold text-white mb-2 text-lg">
                Developed skills
              </div>
              <div className="form-group pb-5 w-full">
                <input
                  type="text"
                  placeholder="Separate with comma.."
                  className="p-3 rounded-md bg-white w-full h-8"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center mb-5">
                <div className="font-semibold text-white text-lg">
                  Difficulty:
                </div>
                <select
                  className="bg-white text-black rounded-md ml-5 px-2 py-1"
                  onChange={(e) => setCourseDifficulty(e.target.value)}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <label className="text-white border-2 border-dashed py-10 rounded-md flex flex-col items-center w-80">
                {thumbnailUrl.length > 0 ? (
                  <Image
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    width={160}
                    height={90}
                    className="object-cover"
                  />
                ) : (
                  <div className="mx-3 items-center flex flex-col">
                    <FaRegImage className="text-2xl mb-2" />
                    <span>Select a thumbnail file</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  placeholder="Select a thumbnail file"
                />
              </label>
              <div className="font-semibold text-white mb-2 text-lg mt-5">
                Price
              </div>
              <div className="form-group pb-5 w-full">
                <input
                  type="text"
                  placeholder="Enter a course price in IDR.. (Type only the number)"
                  className="p-3 rounded-md bg-white w-full h-8"
                  value={coursePrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setCoursePrice(val);
                  }}
                />
              </div>
            </form>
            <button
              onClick={handleSubmit}
              className="bg-fourth text-white py-2 px-5 font-semibold w-fit rounded-md mt-5"
            >
              Create course
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
