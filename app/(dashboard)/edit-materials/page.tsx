"use client";

import LoadingBouncer from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FiUpload } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

const EditMaterialPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [materialId, setMaterialId] = useState<string>("");
  const [materialTitle, setMaterialTitle] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const allowedFileTypes = [
    "application/pdf",
  ];
  const [materialUrl, setMaterialUrl] =
    useState<string>("");
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileUrl("");
        await uploadFileToCloudinary(selectedFile).then(
          (response) => {
            setFileUrl(response);
          }
        );
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a file in pdf format",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setMaterialId(id);
    }

    const fetchMaterial = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/course/material/${materialId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setMaterialTitle(data.data.title);
          setMaterialUrl(data.data.url);
        } else {
          toast({
            title: "Error fetching material",
            variant: "destructive",
          });
          router.push("/instructor-dashboard");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred while fetching the material",
          variant: "destructive",
        });
        router.push("/instructor-dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId, router, toast]);

  const handleSubmit = async () => {
    if (!materialTitle || !materialUrl) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`/api/course/material/update`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: materialId,
          title: materialTitle,
          url: fileUrl,
        }),
      });
      if (response.ok) {
        toast({
          title: "Material updated successfully",
        });
        router.back();
      } else {
        toast({
          title: "Error updating material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating the material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="pt-32 px-12 font-nunito">
      <h1 className="font-nunito font-bold text-3xl mb-4">
        Editing a Course Material
      </h1>
      <hr className="border-t-2 border-grays w-full" />
      <div className="flex flex-col my-5">
        <form className="form-content items-center justify-center">
          <div className="font-semibold text-black mb-1 text-lg">Title</div>
          <div className="form-group pb-5 w-full">
            <input
              type="text"
              placeholder="Enter new material's title.."
              className="p-3 rounded-md border border-grays min-w-[40%] h-8"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-5 text-md">
            <div className="font-semibold text-black text-lg mr-2">
              Previous material: 
            </div>
            <a href={materialUrl} className="underline text-blue-600 font-semibold" target="_blank">Click to view</a>
          </div>
          <div className="font-semibold text-black mb-1 text-lg">
            Upload new material
          </div>
          <div className="border-2 flex flex-col px-60 py-20 mb-2 border-dashed border-grays bg-white rounded-md items-center justify-center text-secondary w-[40%]">
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
        </form>
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center text-white font-nunito font-semibold bg-fourth rounded-md w-fit px-5 py-2 mt-5 hover:shadow-md transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditMaterialPage;
