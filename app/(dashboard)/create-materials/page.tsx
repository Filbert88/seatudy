"use client";
import { useEffect, useState } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import LoadingBouncer from "../loading";
import Instructions from "@/components/assignments/instructions";
import { FiUpload } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const CreateMaterial = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const { toast } = useToast();
  const allowedFileTypes = ["application/pdf"];

  const router = useRouter();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileUrl("");
        await uploadFileToCloudinary(selectedFile).then((response) => {
          setFileUrl(response);
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a file in pdf format",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateMaterial = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/course/material/create", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          title: title,
          url: fileUrl,
        }),
      });
      if (response.ok) {
        toast({
          title: "Material uploaded successfully",
        });
        router.push(`view-materials?id=${courseId}`);
      } else {
        toast({
          title: "Failed to upload material",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred while uploading material",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (fileUrl === "") {
      toast({
        title: "Please upload a file",
        variant: "destructive",
      });
      return;
    }
    if (title === "") {
      toast({
        title: "Please enter the material's title",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      handleCreateMaterial();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-32 flex flex-col items-center text-secondary font-nunito">
      <div className="bg-white shadow-md px-5 pb-5">
        {/* Submission Form */}
        <div className="text-3xl font-bold justify-center mt-5 mb-3 flex">Create Material</div>
        <div className="pb-2 text-xl font-semibold">{"Material's title"}</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter material's title.."
          className="w-full py-1 px-3 rounded-md border border-grays"
        />
        <div className="pt-5 pb-2 text-xl font-semibold">
          {"Material resource (.pdf)"}
        </div>
        <div className="border-2 flex flex-col w-full px-60 py-20 mb-2 border-dashed border-grays rounded-md items-center justify-center text-secondary">
          {fileUrl === "" ? (
            <FiUpload size={50} />
          ) : (
            <GrDocumentVerified size={50} />
          )}
          <div className="flex flex-row">
            <div className="font-bold pr-1 py-5">
              Upload material file by
            </div>
            <label className="cursor-pointer bg-transparent py-5 text-gray-700">
              <span className="font-bold underline hover:text-blue-600 transition">Choose File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {fileUrl !== "" && (
            <div className="flex items-center">
              <div className="text-green-600 font-bold underline mr-3">
                {"File uploaded: "}
              </div>
              <a
                href={fileUrl}
                className="underline font-semibold"
                target="_blank"
              >
                {file?.name}
              </a>
            </div>
          )}
        </div>
        <Instructions>Supported formats: **.pdf**</Instructions>
        <button
          className="font-bold py-2 my-5 px-10 rounded-lg text-white w-fit bg-fourth hover:shadow-md transition"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {"Upload material"}
        </button>
      </div>
    </div>
  );
};

export default CreateMaterial;
