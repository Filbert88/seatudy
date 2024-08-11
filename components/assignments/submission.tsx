"use client";
import Image from "next/image";
import Instructions from "./instructions";
import { useState } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import LoadingBouncer from "../loading";
import { useToast } from "@/components/ui/use-toast";

interface SubmissionProps {
  assignmentId: string;
}

const Submission = ({ assignmentId }: SubmissionProps) => {
  const [validate, setValidate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
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

  const handleAnswerSubmit = async (url: string) => {
    try {
      setUploading(true);
      const response = await fetch(`/api/submission/create?assignmentId=${assignmentId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: url,
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
    if (!file) {
      toast({
        title: "No file uploaded",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadFileToCloudinary(file);
      setUrl(uploadedUrl);
      handleAnswerSubmit(uploadedUrl);
    } catch (err) {
      console.error(err);
      toast({
        title: "File upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {uploading && <LoadingBouncer />}
      <div className="border border-secondary flex flex-row px-5 py-3 items-center min-w-[10vh] max-w-fit">
        <Image src="/assets/info.png" alt="info" width={40} height={40} />
        <div className="font-nunito font-bold p-5">
          Please upload your file in pdf, png, jpeg, or jpg format
        </div>
      </div>

      <div className="font-nunito pt-5 pb-2">
        Upload your project file down below:
      </div>
      <div className="border-2 flex flex-col max-w-fit px-60 py-20 border-dashed border-black bg-cyan-100 rounded-xl items-center justify-center p-10">
        {file == null ? (
          <Image src="/assets/File.png" alt="file" width={80} height={80} />
        ) : (
          <Image src="/assets/checked.png" alt="checked" width={80} height={80} />
        )}
        <div className="flex flex-row">
          <div className="font-nunito font-bold pr-1 py-5">
            Drag and drop file here or
          </div>
          <label className="cursor-pointer bg-transparent py-5 text-gray-700">
            <span className="font-nunito font-bold underline">Choose File</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        {file != null && (
          <span className="pl-2 text-green-500 font-nunito font-bold underline">
            Ready to be submitted!
          </span>
        )}
      </div>
      <Instructions>Supported formats: **pdf, png, jpeg, jpg**</Instructions>
      <form className="py-5 flex flex-row">
        <input type="checkbox" className="mr-3" onClick={handleClick} />
        <Instructions>
          {`I understand that submitting work that is not my own may result in a
          **failure** on this course and will not receive a completion
          certificate`}
        </Instructions>
      </form>
      <button
        className={`font-nunito font-bold py-2 my-3 px-5 rounded-lg text-white ${
          validate ? "bg-cyan-500" : "bg-gray-300"
        }`}
        onClick={handleSubmit}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
      {url && (
        <div className="mt-4">
          <h2 className="text-md font-semibold">Your submission:</h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {url}
          </a>
        </div>
      )}
    </>
  );
};

export default Submission;
