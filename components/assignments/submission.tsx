"use client";
import Instructions from "./instructions";
import { useState } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import LoadingBouncer from "../loading";
import { useToast } from "@/components/ui/use-toast";
import { FiUpload } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";
import { MdInfoOutline } from "react-icons/md";

interface SubmissionProps {
  assignmentId: string;
}

const Submission = ({ assignmentId }: SubmissionProps) => {
  const [validate, setValidate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

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
          description: "Please upload a file in pdf, png, jpeg, or jpg format",
          variant: "destructive",
        });
      }
    }
  };

  const handleClick = () => {
    setValidate(!validate);
  };

  const handleAnswerSubmit = async () => {
    try {
      setUploading(true);
      const response = await fetch(`/api/submission/create?assignmentId=${assignmentId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: fileUrl,
          assignmentId: assignmentId,
        }),
      });
      if (response.ok) {
        toast({
          title: "Submission successful",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "You can only submit once!",
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
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate) {
      toast({
        title: "Terms not accepted",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    if (fileUrl === "") {
      toast({
        title: "No file uploaded",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setIsLoading(true);
      await handleAnswerSubmit();
    } catch (err) {
      console.error(err);
      toast({
        title: "File upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };

  if (loading) return <LoadingBouncer />;

  return (
    <>
      <div className="border border-secondary font-secondary flex flex-row px-5 py-3 items-center min-w-[10vh] max-w-fit">
        <MdInfoOutline size={40} />
        <div className="font-nunito font-bold p-5">
          Please upload your file in pdf, png, jpeg, or jpg format
        </div>
      </div>

      <div className="font-nunito mt-5 mb-3">
        Upload your project file down below:
      </div>
      <div className="border-2 flex flex-col max-w-fit px-60 py-20 mb-2 border-dashed border-black rounded-xl items-center justify-center p-10">
        {fileUrl === "" ? (
          <FiUpload size={50} />
        ) : (
          <GrDocumentVerified size={50} />
        )}
        <div className="flex flex-row">
          <div className="font-nunito font-bold pr-1 py-5">
            Drag and drop file here or
          </div>
          <label className="cursor-pointer bg-transparent py-5 text-gray-700">
            <span className="font-bold underline">Choose File</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        {fileUrl !== "" && (
          <div className="flex items-center">
            <div className="text-green-600 font-bold underline mr-3">
              {"File uploaded: "}
            </div>
            <a href={fileUrl} className="underline font-semibold" target="_blank">
              {file?.name}
            </a>
          </div>
        )}
      </div>
      <Instructions>Supported formats: **pdf, png, jpeg, jpg**</Instructions>
      <form className="py-5 flex flex-row">
        <input type="checkbox" className="mr-3" onClick={handleClick} checked={validate} />
        <Instructions>
          {`I understand that submitting work that is not my own may result in a
          **failure** on this course and will not receive a completion
          certificate`}
        </Instructions>
      </form>
      <button
        className={`font-nunito font-bold py-2 my-3 px-5 rounded-lg text-white ${
          validate ? "bg-fourth" : "bg-gray-300"
        }`}
        disabled={!validate}
        onClick={handleSubmit}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </>
  );
};

export default Submission;
