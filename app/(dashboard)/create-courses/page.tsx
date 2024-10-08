"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingBouncer from "./loading";
import { FaRegImage } from "react-icons/fa6";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const CreateCourse = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseDifficulty, setCourseDifficulty] = useState<string>("Beginner");
  const [coursePrice, setCoursePrice] = useState<string>("");
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [syllabus, setSyllabus] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const { toast } = useToast();

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = formatNumberWithCommas(val);
    setCoursePrice(val);
  };

  const handleSubmit = async () => {
    if (
      !courseTitle ||
      !courseDescription ||
      !courseDifficulty ||
      !coursePrice ||
      !syllabus ||
      !skills ||
      !category
    ) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
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
      f.append("difficulty", courseDifficulty.toUpperCase());
      f.append("price", coursePrice.replace(/,/g, ""));
      category
        .split(",")
        .forEach((item) =>
          f.append("categoryNames", item.trim().toLowerCase())
        );

      const response = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: f,
      });
      if (response.status === 201) {
        toast({
          title: "Course created successfully",
        });
        router.push("/instructor-dashboard");
      } else {
        toast({
          title: "Error creating course",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
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

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-28 px-16 font-nunito">
      <div className="flex flex-col items-center justify-start">
        <div className="bg-white text-secondary shadow-md p-5 my-5 min-w-[50rem]">
          <div className="flex font-nunito font-bold text-3xl mb-3 justify-center">
            Creating a new course
          </div>
          <form className="form-content items-center justify-center">
            <div className="font-semibold mb-2 text-lg">Course Title</div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Enter course title.."
                className="p-3 border border-grays rounded-md bg-white w-full h-8"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2 text-lg">Description</div>
            <div className="form-group pb-5 w-full">
              <textarea
                placeholder="Enter a short description.."
                className="p-3 border border-grays rounded-md w-full min-h-30"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2 text-lg">Syllabus</div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Separate with comma.."
                className="p-3 border border-grays rounded-md w-full h-8"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2 text-lg">Developed skills</div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Separate with comma.."
                className="p-3 border border-grays rounded-md w-full h-8"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center mb-5">
              <div className="font-semibold text-lg">Difficulty</div>
              <select
                className="bg-white border border-grays text-secondary rounded-md ml-5 px-2 py-1 hover:cursor-pointer font-nunito"
                onChange={(e) => setCourseDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <label className="text-secondary border-2 border-grays border-dashed py-10 rounded-md flex flex-col items-center w-80 hover:cursor-pointer hover:opacity-80 transition">
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
            <div className="font-semibold mb-2 text-lg mt-5">Category</div>
            <input
              type="text"
              className="p-3 rounded-md border border-grays w-full h-8"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Separate with comma.."
            />
            <div className="font-semibold mb-2 text-lg mt-5">Price</div>
            <div className="form-group pb-5 w-full flex items-center">
              <div className="font-semibold text-lg mr-3">Rp </div>
              <input
                type="text"
                placeholder="Enter course price.."
                className="p-3 rounded-md border border-grays w-full h-8"
                value={coursePrice}
                onChange={handlePriceChange}
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
  );
};

export default CreateCourse;
