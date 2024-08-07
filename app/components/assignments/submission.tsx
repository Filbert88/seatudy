"use client";
import Image from "next/image";
import InfoIcon from "../../../public/assets/info.png";
import FileIcon from "../../../public/assets/File.png";
import CheckedIcon from "../../../public/assets/checked.png";
import Instructions from "./instructions";
import { useState } from "react";
import { uploadFileToCloudinary } from "@/lib/utils";

const Submission = () => {
  const [validate, setValidate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const allowedFileTypes = [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-compressed",
  ];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please upload a file in .zip or .rar format");
        console.log(selectedFile.type);
        console.log(allowedFileTypes);
      }
    }
  };

  const handleClick = () => {
    setValidate(!validate);
  };

  const handleSubmit = async () => {
    if (validate === false) {
      alert("Please agree to the terms and conditions");
      return;
    }
    if (file === null) {
      alert("Please upload a file");
      return;
    }
    // Submit the file to Cloudinary (sync with Filbert)
    try {
      await uploadFileToCloudinary(file);
    } catch (err) {
      console.error(err);
    } finally {
      alert("File uploaded successfully!");
    }
  };
  return (
    <>
      {/* Information Border*/}
      <div className="border flex flex-row p-5 items-center min-w-[10vh] max-w-fit">
        <Image src={InfoIcon} alt="info" width={40} height={40} />
        <div className="font-nunito font-bold p-5">
          Please upload your file in .zip format
        </div>
      </div>

      {/* Submission Form */}
      <div className="font-nunito pt-5 pb-2">
        Upload your project file down below:
      </div>
      <div className="border-2 flex flex-col max-w-fit min-w-[90vh] border-dashed border-black bg-cyan-100 rounded-xl items-center justify-center p-10">
        {file == null ? (
          <Image src={FileIcon} alt="file" width={80} height={80} />
        ) : (
          <Image src={CheckedIcon} alt="checked" width={80} height={80} />
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
      <Instructions>Supported formats: **.zip, .rar**</Instructions>
      <form className="py-5 flex flex-row">
        <input type="checkbox" className="mr-3" onClick={handleClick} />
        <Instructions>
          I understand that submitting work that isn’t my own may result in a
          **failure** on this course and will not receive a completion
          certificate
        </Instructions>
      </form>
      <button
        className={`font-nunito font-bold py-2 my-3 px-5 rounded-lg text-white ${
          validate ? "bg-cyan-500" : "bg-gray-300"
        }`}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </>
  );
};

export default Submission;
