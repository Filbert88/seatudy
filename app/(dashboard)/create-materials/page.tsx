"use client";
import { useEffect, useState } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import LoadingBouncer from "../loading";
import Instructions from "@/components/assignments/instructions";
import { FiUpload } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";
import { useRouter } from "next/navigation";

interface SubmissionProps {
  assignmentId: string;
}

const CreateMaterial = ({assignmentId}: SubmissionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const allowedFileTypes = [
    "application/pdf",
  ];

  const router = useRouter();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setCourseId(id);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please upload a file in pdf or image format");
        console.log(selectedFile.type);
        console.log(allowedFileTypes);
      }
    }
  };

  const handleCreateMaterial = async (url: string) => {
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
          url: url,
        }),
      });
      if (response.ok) {
        alert("Successfully created material!");
        router.push(`view-materials?id=${courseId}`);
      }
      else {
        alert(response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }
    if (title === "") {
      alert("Please enter the material's title");
      return;
    }
    try {
      setIsLoading(true);
      await uploadFileToCloudinary(file).then((uploadedUrl: string) => {
        handleCreateMaterial(uploadedUrl);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="pt-24 flex flex-col items-center text-primary font-nunito">
      {isLoading && <LoadingBouncer />}
      <div className="text-3xl font-bold my-5 text-secondary">Create Material</div>
      <div className="bg-secondary rounded-md px-10 py-5">
        {/* Submission Form */}
        <div className="pb-2 text-xl font-semibold">
          {"Material's title"}
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter material's title.." className="w-full py-1 px-3 rounded-sm text-secondary bg-primary border"/>
        <div className="pt-5 pb-2 text-xl font-semibold">
          {"Material resource (.pdf)"}
        </div>
        <div className="border-2 flex flex-col w-full px-60 py-20 mb-2 border-dashed border-black bg-primary rounded-sm items-center justify-center text-secondary">
          {file == null ? (
            <FiUpload size={50} />
          ) : (
            <GrDocumentVerified size={50} />
          )}
          <div className="flex flex-row">
            <div className="font-bold pr-1 py-5">
              Drag and drop file here or
            </div>
            <label className="cursor-pointer bg-transparent py-5 text-gray-700">
              <span className="font-bold underline">Choose File</span>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          {file != null && (
            <span className="pl-2 text-green-500 font-bold underline">
              Ready to be submitted!
            </span>
          )}
        </div>
        <Instructions>Supported formats: **.pdf**</Instructions>
        <button
          className="font-bold py-3 my-3 px-10 rounded-lg text-white w-fit bg-fourth hover:shadow-md"
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
